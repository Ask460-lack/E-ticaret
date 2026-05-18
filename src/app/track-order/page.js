"use client";

import { useState } from "react";
import axios from "axios";
import {
  Search,
  Mail,
  ShieldCheck,
  PackageSearch,
  PackageCheck,
  Truck,
  CheckCircle2,
} from "lucide-react";

export default function TrackOrderPage() {
  const [form, setForm] = useState({
    email: "",
    orderCode: "",
  });

  const [order, setOrder] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/orders/track", form);

      setOrder(res.data);
    } catch (error) {
      setOrder(null);

      alert(error.response?.data?.error || "Sipariş bulunamadı");
    }
  };

  return (
    <main className="w-full">
      <section className="mb-12 flex flex-col items-center rounded-[32px] border border-orange-100 bg-white px-6 py-12 text-center shadow-sm sm:px-8 lg:px-12">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-5 py-2">
          <PackageSearch size={18} className="text-orange-600" />

          <span className="text-sm font-bold text-orange-600">
            Sipariş Takibi
          </span>
        </div>

        <h1 className="max-w-4xl text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
          Sipariş Takip
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
          Sipariş kodunuz ve email adresiniz ile sipariş durumunuzu kolayca
          sorgulayabilirsiniz.
        </p>
      </section>

      <form
        onSubmit={handleSubmit}
        className="mx-auto w-full max-w-2xl rounded-[32px] border border-orange-100 bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="space-y-6">
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
                value={form.email}
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
            <label className="text-sm font-bold text-slate-700">
              Sipariş Kodu
            </label>

            <div className="relative">
              <ShieldCheck
                size={20}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-orange-500"
              />

              <input
                placeholder="ORD-ABC123"
                className="w-full rounded-2xl border border-orange-100 bg-orange-50 py-4 pl-4 pr-14 text-base font-medium uppercase text-slate-900 placeholder:text-slate-500 outline-none transition focus:border-orange-400 focus:bg-white"
                value={form.orderCode}
                onChange={(e) =>
                  setForm({
                    ...form,
                    orderCode: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <button className="flex w-full items-center justify-center gap-3 rounded-2xl bg-orange-500 px-6 py-4 text-lg font-black text-white transition hover:bg-orange-600">
            <Search size={22} />
            Siparişi Sorgula
          </button>
        </div>
      </form>

      {order && (
        <div className="mx-auto mt-10 w-full max-w-4xl rounded-[32px] border border-orange-100 bg-white p-8 shadow-sm">
          <div className="mb-8 flex flex-col gap-5 border-b border-orange-100 pb-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-slate-500">
                Sipariş Durumu
              </p>

              <div className="mt-3 flex items-center gap-3">
                {order.status === "hazırlanıyor" && (
                  <PackageCheck className="text-orange-500" />
                )}

                {order.status === "kargoda" && (
                  <Truck className="text-orange-500" />
                )}

                {order.status === "teslim edildi" && (
                  <CheckCircle2 className="text-green-500" />
                )}

                <span className="text-2xl font-black capitalize text-slate-950">
                  {order.status}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-orange-100 bg-orange-50 px-5 py-4">
              <p className="text-sm text-slate-500">Sipariş Kodu</p>

              <p className="mt-2 text-xl font-black tracking-wider text-orange-600">
                {order.orderCode}
              </p>
            </div>
          </div>

          <div className="mb-8 rounded-3xl border border-orange-100 bg-orange-50 p-5">
            <p className="text-sm font-bold text-slate-500">Sipariş Emaili</p>

            <p className="mt-2 text-lg font-bold text-slate-950">
              {order.customer?.email}
            </p>
          </div>

          <div className="space-y-5">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex flex-col gap-3 rounded-2xl border border-orange-100 bg-orange-50 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h3 className="font-bold text-slate-950">{item.title}</h3>

                  <p className="mt-2 text-sm text-slate-600">
                    Adet: {item.quantity}
                  </p>
                </div>

                <p className="text-lg font-black text-orange-600">
                  ₺{(item.price * item.quantity).toLocaleString("tr-TR")}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-orange-100 pt-6">
            <span className="text-lg font-bold text-slate-950">Toplam</span>

            <span className="text-3xl font-black text-orange-600">
              ₺{Number(order.total).toLocaleString("tr-TR")}
            </span>
          </div>
        </div>
      )}
    </main>
  );
}
