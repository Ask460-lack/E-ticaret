"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { CreditCard, ShieldCheck, ShoppingBag, Lock } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const { cart, clearCart } = useCartStore();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
  });

  const [card, setCard] = useState({
    cardHolderName: "",
    cardNumber: "",
    expireMonth: "",
    expireYear: "",
    cvc: "",
  });

  const total = cart.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  const formatPrice = (price) => {
    return Number(price).toLocaleString("tr-TR", {
      maximumFractionDigits: 0,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    const emailToUse = session?.user?.email || form.email;

    if (cart.length === 0) {
      newErrors.cart = "Sepetiniz boş. Lütfen önce ürün ekleyiniz.";
    }

    if (!form.name.trim()) {
      newErrors.name = "Lütfen ad soyad giriniz.";
    }

    if (!emailToUse.trim()) {
      newErrors.email = "Lütfen email adresinizi giriniz.";
    } else if (!/\S+@\S+\.\S+/.test(emailToUse)) {
      newErrors.email = "Geçerli bir email adresi giriniz.";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Lütfen telefon numarası giriniz.";
    } else if (form.phone.replace(/\D/g, "").length < 10) {
      newErrors.phone = "Telefon numarası eksik görünüyor.";
    }

    if (!form.address.trim()) {
      newErrors.address = "Lütfen adres giriniz.";
    }

    if (!card.cardHolderName.trim()) {
      newErrors.cardHolderName = "Kart üzerindeki isim zorunludur.";
    }

    if (!card.cardNumber.trim()) {
      newErrors.cardNumber = "Kart numarası zorunludur.";
    } else if (card.cardNumber.replace(/\s/g, "").length < 16) {
      newErrors.cardNumber = "Kart numarası geçersiz.";
    }

    if (!card.expireMonth.trim()) {
      newErrors.expireMonth = "Ay bilgisi gerekli.";
    } else if (Number(card.expireMonth) < 1 || Number(card.expireMonth) > 12) {
      newErrors.expireMonth = "Geçerli bir ay giriniz.";
    }

    if (!card.expireYear.trim()) {
      newErrors.expireYear = "Yıl bilgisi gerekli.";
    } else if (card.expireYear.length < 4) {
      newErrors.expireYear = "Geçerli bir yıl giriniz.";
    }

    if (!card.cvc.trim()) {
      newErrors.cvc = "CVC gerekli.";
    } else if (card.cvc.length < 3) {
      newErrors.cvc = "CVC geçersiz.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const inputClass = (field) =>
    `w-full rounded-2xl border p-4 font-medium text-slate-900 placeholder:text-slate-500 outline-none transition focus:bg-white ${
      errors[field]
        ? "border-red-300 bg-red-50 focus:border-red-400"
        : "border-orange-100 bg-orange-50 focus:border-orange-400"
    }`;

  const errorText = (field) =>
    errors[field] ? (
      <p className="text-sm font-semibold text-red-500">{errors[field]}</p>
    ) : null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailToUse = session?.user?.email || form.email;

    if (!validateForm()) return;

    try {
      setLoading(true);

      const paymentData = {
        items: cart.map((item) => ({
          productId: item._id || item.productId,
          quantity: item.quantity,
        })),

        customer: {
          userId: session?.user?.id || "",
          name: form.name,
          email: emailToUse,
          address: form.address,
          phone: form.phone,
        },

        card,
      };

      const res = await axios.post("/api/payment", paymentData);

      clearCart();

      router.push(`/order-success/${res.data.order._id}`);
    } catch (error) {
      setErrors({
        api:
          error.response?.data?.error ||
          "Ödeme işlemi sırasında bir hata oluştu.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full">
      <section className="mb-12 flex flex-col items-center rounded-[32px] border border-orange-100 bg-white px-6 py-12 text-center shadow-sm sm:px-8 lg:px-12">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-5 py-2">
          <ShieldCheck size={18} className="text-orange-600" />

          <span className="text-sm font-bold text-orange-600">
            Güvenli Ödeme
          </span>
        </div>

        <h1 className="max-w-4xl text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
          Checkout
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
          Sipariş bilgilerinizi kontrol edin ve güvenli ödeme işlemini
          tamamlayın.
        </p>
      </section>

      {errors.api && (
        <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-600">
          {errors.api}
        </div>
      )}

      {errors.cart && (
        <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-600">
          {errors.cart}
        </div>
      )}

      <div className="grid gap-8 xl:grid-cols-[1fr_380px]">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-[32px] border border-orange-100 bg-white p-6 shadow-sm sm:p-8 lg:p-10"
        >
          <div className="space-y-10">
            <div>
              <div className="mb-6 flex items-center gap-3">
                <ShoppingBag className="text-orange-500" />

                <h2 className="text-2xl font-black text-slate-950">
                  Teslimat Bilgileri
                </h2>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <input
                    placeholder="Ad Soyad"
                    value={form.name}
                    onChange={(e) => {
                      setForm({
                        ...form,
                        name: e.target.value,
                      });

                      setErrors((prev) => ({
                        ...prev,
                        name: "",
                        api: "",
                      }));
                    }}
                    className={inputClass("name")}
                  />

                  {errorText("name")}
                </div>

                <div className="space-y-2">
                  <input
                    placeholder="Email"
                    value={session?.user?.email || form.email}
                    disabled={!!session?.user?.email}
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
                    className={`${inputClass("email")} disabled:bg-orange-100 disabled:text-slate-500`}
                  />

                  {errorText("email")}
                </div>

                <div className="space-y-2">
                  <input
                    placeholder="Telefon"
                    value={form.phone}
                    onChange={(e) => {
                      setForm({
                        ...form,
                        phone: e.target.value,
                      });

                      setErrors((prev) => ({
                        ...prev,
                        phone: "",
                        api: "",
                      }));
                    }}
                    className={inputClass("phone")}
                  />

                  {errorText("phone")}
                </div>

                <div className="space-y-2">
                  <input
                    placeholder="Adres"
                    value={form.address}
                    onChange={(e) => {
                      setForm({
                        ...form,
                        address: e.target.value,
                      });

                      setErrors((prev) => ({
                        ...prev,
                        address: "",
                        api: "",
                      }));
                    }}
                    className={inputClass("address")}
                  />

                  {errorText("address")}
                </div>
              </div>
            </div>

            <div>
              <div className="mb-6 flex items-center gap-3">
                <CreditCard className="text-orange-500" />

                <h2 className="text-2xl font-black text-slate-950">
                  Kart Bilgileri
                </h2>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <input
                    placeholder="Kart Üzerindeki İsim"
                    value={card.cardHolderName}
                    onChange={(e) => {
                      setCard({
                        ...card,
                        cardHolderName: e.target.value,
                      });

                      setErrors((prev) => ({
                        ...prev,
                        cardHolderName: "",
                        api: "",
                      }));
                    }}
                    className={inputClass("cardHolderName")}
                  />

                  {errorText("cardHolderName")}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <input
                    placeholder="Kart Numarası"
                    value={card.cardNumber}
                    onChange={(e) => {
                      setCard({
                        ...card,
                        cardNumber: e.target.value,
                      });

                      setErrors((prev) => ({
                        ...prev,
                        cardNumber: "",
                        api: "",
                      }));
                    }}
                    className={inputClass("cardNumber")}
                  />

                  {errorText("cardNumber")}
                </div>

                <div className="space-y-2">
                  <input
                    placeholder="Ay Örn: 12"
                    value={card.expireMonth}
                    onChange={(e) => {
                      setCard({
                        ...card,
                        expireMonth: e.target.value,
                      });

                      setErrors((prev) => ({
                        ...prev,
                        expireMonth: "",
                        api: "",
                      }));
                    }}
                    className={inputClass("expireMonth")}
                  />

                  {errorText("expireMonth")}
                </div>

                <div className="space-y-2">
                  <input
                    placeholder="Yıl Örn: 2030"
                    value={card.expireYear}
                    onChange={(e) => {
                      setCard({
                        ...card,
                        expireYear: e.target.value,
                      });

                      setErrors((prev) => ({
                        ...prev,
                        expireYear: "",
                        api: "",
                      }));
                    }}
                    className={inputClass("expireYear")}
                  />

                  {errorText("expireYear")}
                </div>

                <div className="space-y-2">
                  <input
                    placeholder="CVC"
                    value={card.cvc}
                    onChange={(e) => {
                      setCard({
                        ...card,
                        cvc: e.target.value,
                      });

                      setErrors((prev) => ({
                        ...prev,
                        cvc: "",
                        api: "",
                      }));
                    }}
                    className={inputClass("cvc")}
                  />

                  {errorText("cvc")}
                </div>
              </div>
            </div>

            <button
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-orange-500 px-6 py-5 text-lg font-black text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Lock size={22} />

              {loading ? "Ödeme İşleniyor..." : `₺${formatPrice(total)} Öde`}
            </button>
          </div>
        </form>

        <aside className="h-fit rounded-[32px] border border-orange-100 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-black text-slate-950">Sipariş Özeti</h2>

          <div className="mt-8 space-y-5">
            {cart.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-orange-100 bg-orange-50 p-4"
              >
                <div>
                  <p className="font-bold text-slate-950">{item.title}</p>

                  <p className="mt-1 text-sm text-slate-600">
                    Adet: {item.quantity}
                  </p>
                </div>

                <p className="shrink-0 font-black text-orange-600">
                  ₺{formatPrice(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-orange-100 pt-6">
            <span className="text-lg font-bold text-slate-950">Toplam</span>

            <span className="text-3xl font-black text-orange-600">
              ₺{formatPrice(total)}
            </span>
          </div>

          <div className="mt-8 rounded-3xl border border-orange-100 bg-orange-50 p-5 text-sm leading-7 text-slate-700">
            Test aşamasında iyzico sandbox kullanılır. Gerçek para çekilmez.
          </div>
        </aside>
      </div>
    </main>
  );
}
