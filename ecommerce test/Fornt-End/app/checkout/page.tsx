import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [cart, setCart] = useState<any>(null);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"PIX" | "BOLETO">("PIX");
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const sessionId = localStorage.getItem("sessionId");
      if (!sessionId) return;
      const cartRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cart?sessionId=${sessionId}`);
      setCart(cartRes.data);
      // load addresses for demo - public route simplified
      const addrRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/me/addresses`);
      setAddresses(addrRes.data || []);
      if (addrRes.data?.length) setSelectedAddress(addrRes.data[0].id);
    }
    load();
  }, []);

  async function handlePay() {
    if (!cart || !selectedAddress) return alert("Escolha endereço");
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, { cartId: cart.id, addressId: selectedAddress, paymentMethod });
    const { order, payment } = res.data;
    // store order and redirect to payment page
    localStorage.setItem("lastOrder", JSON.stringify(order));
    router.push(`/payment?paymentId=${payment.paymentId}`);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-white p-4 rounded">
          <h2 className="font-semibold mb-2">Endereço de entrega</h2>
          {addresses.length === 0 ? <div>Nenhum endereço cadastrado</div> : (
            addresses.map(a => (
              <div key={a.id} className="p-2 border rounded mb-2">
                <input type="radio" name="addr" checked={selectedAddress === a.id} onChange={() => setSelectedAddress(a.id)} /> <strong>{a.label}</strong> — {a.street}, {a.number} — {a.city}/{a.state}
              </div>
            ))
          )}
        </div>
        <div className="bg-white p-4 rounded">
          <h2 className="font-semibold">Resumo</h2>
          <div className="mt-2">Subtotal: R$ {cart?.subtotal?.toFixed(2) || "0.00"}</div>
          <div>Frete: R$ 15.00</div>
          <div className="font-bold mt-2">Total: R$ {(cart?.subtotal || 0 + 15).toFixed(2)}</div>
          <div className="mt-4">
            <label className="block">Forma de pagamento</label>
            <select className="w-full border p-2 rounded mt-2" value={paymentMethod} onChange={(e)=> setPaymentMethod(e.target.value as any)}>
              <option value="PIX">PIX</option>
              <option value="BOLETO">Boleto</option>
            </select>
            <button onClick={handlePay} className="mt-4 w-full bg-green-600 text-white p-3 rounded">Pagar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
