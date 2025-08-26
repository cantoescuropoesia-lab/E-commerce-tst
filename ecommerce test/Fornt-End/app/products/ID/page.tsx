import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<any>(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    async function load() {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`);
      setProduct(res.data);
    }
    load();
  }, [id]);

  async function addToCart() {
    // simplistic: create or get cart from localStorage session token
    const sessionId = localStorage.getItem("sessionId") || Math.random().toString(36).slice(2);
    localStorage.setItem("sessionId", sessionId);
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/cart/items`, { sessionId, productId: id, qty, unitPrice: product.price });
    alert("Adicionado ao carrinho");
  }

  if (!product) return <div>Carregando...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="col-span-2">
        <img src={product.images?.[0]} alt={product.title} className="w-full h-96 object-cover rounded" />
      </div>
      <div>
        <h1 className="text-2xl font-bold">{product.title}</h1>
        <p className="mt-2">{product.description}</p>
        <div className="mt-4 text-xl font-bold">R$ {product.price.toFixed(2)}</div>
        <div className="mt-4">
          <label>Quantidade</label>
          <input value={qty} onChange={(e) => setQty(parseInt(e.target.value || "1"))} type="number" min={1} className="w-20 border p-2 rounded" />
        </div>
        <button onClick={addToCart} className="mt-4 w-full bg-green-600 text-white p-3 rounded">Adicionar ao carrinho</button>
      </div>
    </div>
  );
}
