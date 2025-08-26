import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function CartPage() {
  const [items, setItems] = useState<any[]>([]);
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    async function load() {
      const sessionId = localStorage.getItem("sessionId");
      if (!sessionId) return;
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cart?sessionId=${sessionId}`);
      setItems(res.data.items || []);
      setSubtotal(res.data.subtotal || 0);
    }
    load();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Carrinho</h1>
      <div className="bg-white p-4 rounded">
        {items.length === 0 ? <div>Carrinho vazio</div> : (
          <div>
            {items.map(it => (
              <div key={it.id} className="flex items-center justify-between border-b py-2">
                <div>
                  <div className="font-semibold">{it.product.title}</div>
                  <div className="text-sm text-gray-500">Qty: {it.qty}</div>
                </div>
                <div>R$ {(it.unitPrice * it.qty).toFixed(2)}</div>
              </div>
            ))}
            <div className="mt-4 flex justify-between font-bold">
              <div>Subtotal</div>
              <div>R$ {subtotal.toFixed(2)}</div>
            </div>
            <div className="mt-4">
              <Link href="/checkout" className="w-full inline-block bg-blue-600 text-white p-3 rounded text-center">Ir para checkout</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
