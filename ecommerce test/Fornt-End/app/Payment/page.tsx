import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function PaymentPage() {
  const sp = useSearchParams();
  const paymentId = sp.get("paymentId");
  const [payment, setPayment] = useState<any>(null);

  useEffect(() => {
    async function load() {
      // backend would have an endpoint to retrieve payment details by id — simplified here
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/webhooks/payment?paymentId=${paymentId}`);
      setPayment(res.data);
    }
    if (paymentId) load();
  }, [paymentId]);

  if (!payment) return <div>Carregando pagamento...</div>;

  if (payment.payload?.qrImage) {
    return (
      <div>
        <h1 className="text-2xl font-bold">PIX</h1>
        <img src={payment.payload.qrImage} alt="QR" />
        <div>Status: {payment.status}</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Boleto</h1>
      <div>Linha: {payment.payload.linhaDigitavel}</div>
      <a href={payment.payload.pdfUrl} className="underline">Baixar PDF</a>
      <div>Status: {payment.status}</div>
    </div>
  );
}
