"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post("/api/forgot-password", {
        email,
      });

      alert(res.data.message);
    } catch (error) {
      alert(error.response?.data?.error || "İşlem başarısız");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto p-10 text-slate-900">
      <h1 className="text-3xl font-bold mb-6">Şifremi Unuttum</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-2xl p-6 space-y-4"
      >
        <input
          type="email"
          placeholder="Email adresiniz"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-3 rounded-xl"
        />

        <button
          disabled={loading}
          className="bg-black text-white px-6 py-3 rounded-xl w-full"
        >
          {loading ? "Gönderiliyor..." : "Yeni Şifre Gönder"}
        </button>
      </form>

      <Link href="/login" className="inline-block mt-5 font-medium">
        Giriş sayfasına dön
      </Link>
    </main>
  );
}
