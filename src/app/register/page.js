"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, ShieldCheck, UserPlus } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post("/api/register", form);

    alert("Kayıt başarılı");

    router.push("/login");
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
                className="w-full rounded-2xl border border-orange-100 bg-orange-50 py-4 pl-4 pr-14 text-base font-medium text-slate-900 placeholder:text-slate-500 outline-none transition focus:border-orange-400 focus:bg-white"
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
              />
            </div>
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
                className="w-full rounded-2xl border border-orange-100 bg-orange-50 py-4 pl-4 pr-14 text-base font-medium text-slate-900 placeholder:text-slate-500 outline-none transition focus:border-orange-400 focus:bg-white"
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
              />
            </div>
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
                className="w-full rounded-2xl border border-orange-100 bg-orange-50 py-4 pl-4 pr-14 text-base font-medium text-slate-900 placeholder:text-slate-500 outline-none transition focus:border-orange-400 focus:bg-white"
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 py-4 text-lg font-black text-white transition hover:bg-orange-600">
            <UserPlus size={22} />
            Kayıt Ol
          </button>
        </form>
      </div>
    </main>
  );
}
