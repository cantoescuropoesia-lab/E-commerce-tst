"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const router = useRouter();

  async function handleLogin(e: any) {
    e.preventDefault();
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, { identifier, password }, { withCredentials: true });
      router.push("/");
    } catch (err: any) {
      setMsg(err?.response?.data?.message || "Erro ao logar");
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-4">Entrar</h2>
      <form onSubmit={handleLogin} className="space-y-3">
        <input value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="E-mail, usuário, CPF ou telefone" className="w-full border p-3 rounded" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Senha" className="w-full border p-3 rounded" />
        <button className="w-full bg-blue-600 text-white p-3 rounded">Entrar</button>
      </form>
      {msg && <div className="mt-3 text-sm text-red-600">{msg}</div>}
      <div className="mt-4 text-sm">
        <a href="/auth/forgot" className="underline">Esqueci minha senha</a>
      </div>
    </div>
  );
}
