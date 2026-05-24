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

  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [errors, setErrors] = useState({});

  const formatPrice = (price) =>
    Number(price).toLocaleString("tr-TR", {
      maximumFractionDigits: 0,
    });

  const validateForm = () => {
    const newErrors = {};

    if (!form.email.trim()) {
      newErrors.email = "Lütfen email adresinizi giriniz.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Geçerli bir email adresi giriniz.";
    }

    if (!form.orderCode.trim()) {
      newErrors.orderCode = "Lütfen sipariş kodunuzu giriniz.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const inputClass = (field) =>
    `w-full rounded-2xl border py-4 pl-4 pr-14 text-base font-medium placeholder:text-slate-500 outline-none transition focus:bg-white ${
      errors[field]
        ? "border-red-300 bg-red-50 text-slate-900 focus:border-red-400"
        : "border-orange-100 bg-orange-50 text-slate-900 focus:border-orange-400"
    }`;

  const errorText = (field) =>
    errors[field] ? (
      <p className="text-sm font-semibold text-red-500">{errors[field]}</p>
    ) : null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setOrder(null);
    setErrors({});

    try {
      const res = await axios.post("/api/orders/track", {
        email: form.email.trim(),
        orderCode: form.orderCode.trim(),
      });

      setOrder(res.data);
    } catch (error) {
      setOrder(null);

      setErrors({
        api:
          error.response?.data?.error ||
          "Sipariş bulunamadı. Email veya sipariş kodunu kontrol ediniz.",
      });
    } finally {
      setLoading(false);
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

      {errors.api && (
        <div className="mx-auto mb-8 w-full max-w-2xl rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-600">
          {errors.api}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        noValidate
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
                className={inputClass("email")}
                value={form.email}
                onChange={(e) => {
                  setForm({
                    ...form,
                    email: e.target.value,
                  });

                  setErrors((prev) => ({
                    ...prev,
                    email: "",
                    api: "",
                  }));
                }}
              />
            </div>

            {errorText("email")}
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
                className={`${inputClass("orderCode")} uppercase`}
                value={form.orderCode}
                onChange={(e) => {
                  setForm({
                    ...form,
                    orderCode: e.target.value,
                  });

                  setErrors((prev) => ({
                    ...prev,
                    orderCode: "",
                    api: "",
                  }));
                }}
              />
            </div>

            {errorText("orderCode")}
          </div>

          <button
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-orange-500 px-6 py-4 text-lg font-black text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300"
          >
            {loading ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Sorgulanıyor...
              </>
            ) : (
              <>
                <Search size={22} />
                Siparişi Sorgula
              </>
            )}
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
                  ₺{formatPrice(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-orange-100 pt-6">
            <span className="text-lg font-bold text-slate-950">Toplam</span>

            <span className="text-3xl font-black text-orange-600">
              ₺{formatPrice(order.total)}
            </span>
          </div>
        </div>
      )}
    </main>
  );
}
