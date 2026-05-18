"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });

  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
      general: "",
    };

    if (!form.email.trim()) {
      newErrors.email = "Lütfen email adresinizi giriniz.";
    }

    if (!form.password.trim()) {
      newErrors.password = "Lütfen şifrenizi giriniz.";
    }

    setErrors(newErrors);

    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (res?.ok) {
      router.push("/");
    } else {
      setErrors((prev) => ({
        ...prev,
        general: "Email veya şifre hatalı. Lütfen tekrar deneyiniz.",
      }));
    }
  };

  return (
    <main className="flex min-h-[70vh] w-full items-center justify-center">
      <div className="w-full max-w-md rounded-[32px] border border-orange-100 bg-white p-8 shadow-sm sm:p-10">
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-5 py-2">
            <ShieldCheck size={18} className="text-orange-600" />

            <span className="text-sm font-bold text-orange-600">
              Güvenli Giriş
            </span>
          </div>

          <h1 className="text-4xl font-black tracking-tight text-slate-950">
            Giriş Yap
          </h1>

          <p className="mt-5 text-base leading-7 text-slate-600">
            Hesabınıza giriş yaparak alışveriş deneyiminize devam edin.
          </p>
        </div>

        {errors.general && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
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
                className={`w-full rounded-2xl border bg-orange-50 py-4 pl-4 pr-14 text-base font-medium text-slate-900 placeholder:text-slate-500 outline-none transition focus:bg-white ${
                  errors.email
                    ? "border-red-300 focus:border-red-400"
                    : "border-orange-100 focus:border-orange-400"
                }`}
                onChange={(e) => {
                  setForm({
                    ...form,
                    email: e.target.value,
                  });

                  setErrors((prev) => ({
                    ...prev,
                    email: "",
                    general: "",
                  }));
                }}
              />
            </div>

            {errors.email && (
              <p className="text-sm font-semibold text-red-600">
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
                className={`w-full rounded-2xl border bg-orange-50 py-4 pl-4 pr-14 text-base font-medium text-slate-900 placeholder:text-slate-500 outline-none transition focus:bg-white ${
                  errors.password
                    ? "border-red-300 focus:border-red-400"
                    : "border-orange-100 focus:border-orange-400"
                }`}
                onChange={(e) => {
                  setForm({
                    ...form,
                    password: e.target.value,
                  });

                  setErrors((prev) => ({
                    ...prev,
                    password: "",
                    general: "",
                  }));
                }}
              />
            </div>

            {errors.password && (
              <p className="text-sm font-semibold text-red-600">
                {errors.password}
              </p>
            )}
          </div>

          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 py-4 text-lg font-black text-white transition hover:bg-orange-600">
            <ShieldCheck size={20} />
            Giriş Yap
          </button>
        </form>

        <Link
          href="/forgot-password"
          className="mt-6 block text-center text-sm font-bold text-orange-600 transition hover:text-orange-700"
        >
          Şifremi unuttum
        </Link>
      </div>
    </main>
  );
}
