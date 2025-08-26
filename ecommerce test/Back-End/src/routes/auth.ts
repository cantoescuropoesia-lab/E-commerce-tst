import { Router } from "express";
import { z } from "zod";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { prisma } from "../prismaClient";
import crypto from "crypto";
import { sendResetEmail } from "../services/email.service";

const router = Router();

const jwtSecret = process.env.JWT_SECRET || "dev_secret";

router.post("/register", async (req, res) => {
  const schema = z.object({
    username: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(8),
    phone: z.string().optional(),
    cpf: z.string().optional(),
    name: z.string().optional(),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ code: "INVALID_PAYLOAD", message: parsed.error.message });

  const { username, email, password, phone, cpf } = parsed.data;

  const existing = await prisma.user.findFirst({ where: { OR: [{ email }, { username }, { cpf }] } });
  if (existing) return res.status(409).json({ code: "USER_EXISTS", message: "Usuário já existe" });

  const passwordHash = await argon2.hash(password);
  const user = await prisma.user.create({
    data: { username, email, phone, cpf, passwordHash },
  });

  const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: "7d" });
  res.cookie("token", token, { httpOnly: true, sameSite: "lax" });
  res.json({ user: { id: user.id, email: user.email, username: user.username } });
});

router.post("/login", async (req, res) => {
  const schema = z.object({
    identifier: z.string(), // email | username | cpf | phone
    password: z.string(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ code: "INVALID_PAYLOAD", message: parsed.error.message });

  const { identifier, password } = parsed.data;
  const user = await prisma.user.findFirst({
    where: { OR: [{ email: identifier }, { username: identifier }, { cpf: identifier }, { phone: identifier }] },
  });
  // generic message to avoid enumeration
  if (!user) return res.status(401).json({ code: "INVALID_CREDENTIALS", message: "Credenciais inválidas" });

  if (!user.passwordHash) return res.status(400).json({ code: "NO_PASSWORD", message: "Conta sem senha" });

  const valid = await argon2.verify(user.passwordHash, password);
  if (!valid) return res.status(401).json({ code: "INVALID_CREDENTIALS", message: "Credenciais inválidas" });

  const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: "7d" });
  res.cookie("token", token, { httpOnly: true, sameSite: "lax" });
  res.json({ user: { id: user.id, email: user.email, username: user.username } });
});

// forgot password (send email regardless)
router.post("/forgot", async (req, res) => {
  const schema = z.object({ email: z.string().email() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ code: "INVALID_PAYLOAD", message: parsed.error.message });

  const { email } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1h
    await prisma.passwordResetToken.create({
      data: { userId: user.id, token, expiresAt },
    });
    await sendResetEmail(email, token);
  }
  // generic response
  res.json({ message: "Se houver conta, enviamos instruções para o e-mail." });
});

router.post("/reset", async (req, res) => {
  const schema = z.object({ token: z.string(), password: z.string().min(8) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ code: "INVALID_PAYLOAD", message: parsed.error.message });

  const { token, password } = parsed.data;
  const pr = await prisma.passwordResetToken.findUnique({ where: { token } });
  if (!pr || pr.expiresAt < new Date() || pr.usedAt) return res.status(400).json({ code: "INVALID_TOKEN", message: "Token inválido" });

  const passwordHash = await argon2.hash(password);
  await prisma.user.update({ where: { id: pr.userId }, data: { passwordHash } });
  await prisma.passwordResetToken.update({ where: { token }, data: { usedAt: new Date() } });

  res.json({ message: "Senha alterada com sucesso." });
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ ok: true });
});

export default router;
