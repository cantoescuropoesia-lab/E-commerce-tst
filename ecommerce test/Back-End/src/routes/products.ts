import { Router } from "express";
import { prisma } from "../prismaClient";

const router = Router();

router.get("/", async (req, res) => {
  const { q, category, sort, page = "1", perPage = "20" } = req.query as any;
  const where: any = {};
  if (category) where.category = { slug: category };
  if (q) where.OR = [{ title: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }];
  const pageNum = parseInt(page);
  const per = Math.min(parseInt(perPage), 100);

  const products = await prisma.product.findMany({ where, take: per, skip: (pageNum - 1) * per });
  res.json({ items: products });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return res.status(404).json({ code: "NOT_FOUND" });
  res.json(product);
});

export default router;
