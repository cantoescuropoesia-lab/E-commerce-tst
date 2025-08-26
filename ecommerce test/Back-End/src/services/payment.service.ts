import { v4 as uuidv4 } from "uuid";

/**
 * initializePayment({method, amount, orderId})
 * returns a payment object with id, status, payload (qrCode / boleto line)
 */
export async function initializePayment({ method, amount, orderId }: { method: "PIX" | "BOLETO"; amount: number; orderId: string }) {
  const paymentId = uuidv4();
  if (method === "PIX") {
    // simulate PIX payload
    const qr = `pix://qrcode/${paymentId}`;
    return { paymentId, status: "pending", payload: { qr, qrImage: `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qr)}&size=300x300` } };
  }
  // boleto
  const linhaDigitavel = `00190.00009 01234.567890 12345.678901 8 000${Math.round(amount * 100)}`;
  return { paymentId, status: "pending", payload: { linhaDigitavel, pdfUrl: `https://example.com/boleto/${paymentId}.pdf` } };
}

/**
 * simulate webhook call to mark payment as paid - in real gateways, you'd use webhooks
 */
export function simulatePaymentPaid(paymentId: string) {
  // call backend webhook handler or change DB - simplified here
  return { paymentId, status: "paid" };
}
