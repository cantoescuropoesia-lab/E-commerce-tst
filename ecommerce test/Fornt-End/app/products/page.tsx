import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ProductsPage({ searchParams }: any) {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    async function load() {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products?perPage=24`);
      setItems(res.data.items);
    }
    load();
  }, []);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Produtos</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((p) => (
          <div key={p.id} className="bg-white p-4 rounded-2xl shadow">
            <img src={p.images?.[0]} alt={p.title} className="w-full h-40 object-cover rounded" />
            <h3 className="mt-2 font-semibold">{p.title}</h3>
            <div className="mt-2 flex items-center justify-between">
              <div className="font-bold">R$ {p.price.toFixed(2)}</div>
              <Link href={`/product/${p.id}`} className="text-blue-600">Ver</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
