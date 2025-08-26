import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {
  const [destaques, setDestaques] = useState<any[]>([]);
  useEffect(() => {
    async function load() {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products?perPage=8`);
      setDestaques(res.data.items.slice(0, 8));
    }
    load();
  }, []);
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Destaques</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {destaques.map((p) => (
          <div key={p.id} className="bg-white p-4 rounded-2xl shadow-sm">
            <img src={p.images?.[0]} alt={p.title} className="w-full h-40 object-cover rounded-lg" />
            <h3 className="mt-2 font-semibold">{p.title}</h3>
            <p className="text-sm text-gray-500">{p.brand}</p>
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
