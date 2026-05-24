"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Lock,
  ShieldCheck,
  UserPlus,
  CheckCircle2,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Lütfen ad soyad giriniz.";
    }

    if (!form.email.trim()) {
      newErrors.email = "Lütfen email adresinizi giriniz.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Geçerli bir email adresi giriniz.";
    }

    if (!form.password.trim()) {
      newErrors.password = "Lütfen şifre giriniz.";
    } else if (form.password.length < 6) {
      newErrors.password = "Şifre en az 6 karakter olmalıdır.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      await axios.post("/api/register", form);

      setSuccessMessage(
        "Kayıt başarılı. Giriş sayfasına yönlendiriliyorsunuz.",
      );

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error) {
      setErrors({
        api:
          error.response?.data?.error ||
          "Kayıt işlemi sırasında bir hata oluştu.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[70vh] w-full items-center justify-center">
      <div className="w-full max-w-md rounded-[32px] border border-orange-100 bg-white p-8 shadow-sm sm:p-10">
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-5 py-2">
            <ShieldCheck size={18} className="text-orange-600" />

            <span className="text-sm font-bold text-orange-600">
              Güvenli Kayıt
            </span>
          </div>

          <h1 className="text-4xl font-black tracking-tight text-slate-950">
            Kayıt Ol
          </h1>

          <p className="mt-5 text-base leading-7 text-slate-600">
            Yeni hesap oluşturun ve alışveriş deneyimine katılın.
          </p>
        </div>

        {successMessage && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-4 py-4 text-sm font-bold text-green-700">
            <CheckCircle2 size={18} />
            {successMessage}
          </div>
        )}

        {errors.api && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-bold text-red-600">
            {errors.api}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Ad Soyad</label>

            <div className="relative">
              <User
                size={20}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-orange-500"
              />

              <input
                type="text"
                placeholder="Ad Soyad"
                value={form.name}
                className={`w-full rounded-2xl border py-4 pl-4 pr-14 text-base font-medium text-slate-900 placeholder:text-slate-500 outline-none transition focus:bg-white ${
                  errors.name
                    ? "border-red-300 bg-red-50 focus:border-red-400"
                    : "border-orange-100 bg-orange-50 focus:border-orange-400"
                }`}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
              />
            </div>

            {errors.name && (
              <p className="text-sm font-semibold text-red-500">
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">
              Email Adresi
            </label>

            <div className="relative">
              <Mail
                size={20}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-orange-500"
              />

              <input
                type="email"
                placeholder="ornek@email.com"
                value={form.email}
                className={`w-full rounded-2xl border py-4 pl-4 pr-14 text-base font-medium text-slate-900 placeholder:text-slate-500 outline-none transition focus:bg-white ${
                  errors.email
                    ? "border-red-300 bg-red-50 focus:border-red-400"
                    : "border-orange-100 bg-orange-50 focus:border-orange-400"
                }`}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
              />
            </div>

            {errors.email && (
              <p className="text-sm font-semibold text-red-500">
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Şifre</label>

            <div className="relative">
              <Lock
                size={20}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-orange-500"
              />

              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                className={`w-full rounded-2xl border py-4 pl-4 pr-14 text-base font-medium text-slate-900 placeholder:text-slate-500 outline-none transition focus:bg-white ${
                  errors.password
                    ? "border-red-300 bg-red-50 focus:border-red-400"
                    : "border-orange-100 bg-orange-50 focus:border-orange-400"
                }`}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
              />
            </div>

            {errors.password && (
              <p className="text-sm font-semibold text-red-500">
                {errors.password}
              </p>
            )}
          </div>

          <button
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 py-4 text-lg font-black text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <UserPlus size={22} />

            {loading ? "Kayıt Oluşturuluyor..." : "Kayıt Ol"}
          </button>
        </form>
      </div>
    </main>
  );
}
