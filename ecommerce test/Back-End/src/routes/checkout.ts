import { Router } from "express";
import { prisma } from "../prismaClient";
import { initializePayment } from "../services/payment.service";

const router = Router();

/**
 * POST /checkout
 * body: { cartId, addressId, paymentMethod }
 */
router.post("/", async (req, res) => {
  const { cartId, addressId, paymentMethod } = req.body;
  if (!cartId || !addressId || !paymentMethod) return res.status(400).json({ code: "INVALID_PAYLOAD" });

  const cart = await prisma.cart.findUnique({ where: { id: cartId }, include: { items: { include: { product: true } } } });
  if (!cart) return res.status(404).json({ code: "CART_NOT_FOUND" });

  const address = await prisma.address.findUnique({ where: { id: addressId } });
  if (!address) return res.status(404).json({ code: "ADDRESS_NOT_FOUND" });

  const subtotal = cart.items.reduce((s, it) => s + it.qty * it.unitPrice, 0);
  const shipping = 15.0; // simple flat or calculate by CEP
  const total = subtotal + shipping;

  const order = await prisma.order.create({
    data: {
      userId: cart.userId,
      addressId,
      subtotal,
      shipping,
      discount: 0,
      total,
      status: "created",
      paymentMethod,
      items: { create: cart.items.map((it) => ({ productId: it.productId, title: it.product.title, qty: it.qty, variant: it.variant, unitPrice: it.unitPrice })) },
    },
    include: { items: true },
  });

  const payment = await initializePayment({ method: paymentMethod, amount: total, orderId: order.id });
  await prisma.order.update({ where: { id: order.id }, data: { paymentId: payment.paymentId } });

  res.json({ order, payment });
});

export default router;
