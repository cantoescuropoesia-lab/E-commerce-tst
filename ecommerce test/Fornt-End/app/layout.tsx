import "./globals.css";
import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Lojica - E-commerce",
  description: "E-commerce elegante e responsivo",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-50 text-gray-800">
        <header className="bg-white shadow-sm p-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold">Lojica</Link>
            <nav className="space-x-4">
              <Link href="/products">Produtos</Link>
              <Link href="/hot">HOT</Link>
            </nav>
            <div className="flex gap-3 items-center">
              <Link href="/auth/login">Entrar</Link>
              <Link href="/cart">Carrinho</Link>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto p-6">{children}</main>

        <footer className="bg-white mt-12 p-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Lojica. Todos os direitos reservados.
        </footer>

        {/* Cookie consent simple */}
        <div id="cookie-consent" className="fixed bottom-4 left-4 right-4 max-w-2xl mx-auto bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              Usamos cookies para melhorar a experiência. Ao continuar, você concorda com nossa <a className="underline" href="/privacy">Política de Privacidade</a>.
            </div>
            <button className="ml-4 px-3 py-1 bg-blue-600 text-white rounded">Aceitar</button>
          </div>
        </div>
      </body>
    </html>
  );
}
