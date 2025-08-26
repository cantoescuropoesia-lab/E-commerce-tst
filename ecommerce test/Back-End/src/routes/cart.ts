import { Router } from "express";
import { prisma } from "../prismaClient";
const router = Router();

// GET /cart?sessionId= or with auth
router.get("/", async (req, res) => {
  const { sessionId } = req.query as any;
  if (!sessionId) return res.json({ items: [], subtotal: 0 });
  let cart = await prisma.cart.findFirst({ where: { sessionId }, include: { items: { include: { product: true } } } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { sessionId } , include: { items: { include: { product: true } } }});
  }
  const subtotal = cart.items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
  res.json({ id: cart.id, items: cart.items, subtotal });
});

// POST /cart/items
router.post("/items", async (req, res) => {
  const { sessionId, productId, qty = 1, unitPrice } = req.body;
  if (!sessionId || !productId || !unitPrice) return res.status(400).json({ code: "INVALID" });

  let cart = await prisma.cart.findFirst({ where: { sessionId } });
  if (!cart) cart = await prisma.cart.create({ data: { sessionId } });

  const existing = await prisma.cartItem.findFirst({ where: { cartId: cart.id, productId } });
  if (existing) {
    await prisma.cartItem.update({ where: { id: existing.id }, data: { qty: existing.qty + qty } });
  } else {
    await prisma.cartItem.create({ data: { cartId: cart.id, productId, qty, unitPrice } });
  }
  // update subtotal
  const updated = await prisma.cart.findUnique({ where: { id: cart.id }, include: { items: true } });
  const subtotal = updated!.items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
  await prisma.cart.update({ where: { id: cart.id }, data: { subtotal } });
  res.json({ ok: true });
});

// PATCH /cart/items/:id (change qty)
router.patch("/items/:id", async (req, res) => {
  const { id } = req.params;
  const { qty } = req.body;
  await prisma.cartItem.update({ where: { id }, data: { qty } });
  res.json({ ok: true });
});

router.delete("/items/:id", async (req, res) => {
  const { id } = req.params;
  await prisma.cartItem.delete({ where: { id } });
  res.json({ ok: true });
});

export default router;
