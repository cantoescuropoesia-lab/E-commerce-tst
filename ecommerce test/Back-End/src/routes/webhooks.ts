import { Router } from "express";
import { prisma } from "../prismaClient";
import { simulatePaymentPaid } from "../services/payment.service";

const router = Router();

// GET /webhooks/payment?paymentId= (for demo)
router.get("/payment", async (req, res) => {
  const { paymentId } = req.query as any;
  if (!paymentId) return res.status(400).json({ code: "INVALID" });
  // in real life you'd fetch from DB or gateway
  // for demo, return a made-up object or from DB orders
  const order = await prisma.order.findFirst({ where: { paymentId } });
  if (!order) return res.json({ paymentId, status: "pending", payload: {} });

  // if status paid in DB -> return paid
  if (order.status === "paid") return res.json({ paymentId, status: "paid", payload: {} });

  // else return pending with sample payload
  const amount = order.total;
  // guess payment method
  if (order.paymentMethod === "PIX") {
    return res.json({ paymentId, status: "pending", payload: { qrImage: `https://api.qrserver.com/v1/create-qr-code/?data=pix-${paymentId}&size=300x300` } });
  }
  return res.json({ paymentId, status: "pending", payload: { linhaDigitavel: `00190.00009 01234.567890 12345.678901 8 000${Math.round(amount*100)}` } });
});

// webhook to mark paid (simulate)
router.post("/payment/paid", async (req, res) => {
  const { paymentId } = req.body;
  const order = await prisma.order.findFirst({ where: { paymentId } });
  if (!order) return res.status(404).json({ ok: false });
  await prisma.order.update({ where: { id: order.id }, data: { status: "paid" } });
  // send email via service (omitted)
  res.json({ ok: true });
});

export default router;
