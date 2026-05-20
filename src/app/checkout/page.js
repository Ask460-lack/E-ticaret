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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Sepetiniz boş");
      return;
    }

    const emailToUse = session?.user?.email || form.email;

    if (!form.name || !emailToUse || !form.address || !form.phone) {
      alert("Lütfen müşteri bilgilerini doldurun");
      return;
    }

    if (
      !card.cardHolderName ||
      !card.cardNumber ||
      !card.expireMonth ||
      !card.expireYear ||
      !card.cvc
    ) {
      alert("Lütfen kart bilgilerini doldurun");
      return;
    }

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

      alert("Ödeme başarılı");

      router.push(`/order-success/${res.data.order._id}`);
    } catch (error) {
      alert(error.response?.data?.error || "Ödeme işlemi başarısız");
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

      <div className="grid gap-8 xl:grid-cols-[1fr_380px]">
        <form
          onSubmit={handleSubmit}
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
                <input
                  placeholder="Ad Soyad"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  className="rounded-2xl border border-orange-100 bg-orange-50 p-4 font-medium text-slate-900 placeholder:text-slate-500 outline-none transition focus:border-orange-400 focus:bg-white"
                />

                <input
                  placeholder="Email"
                  value={session?.user?.email || form.email}
                  disabled={!!session?.user?.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                  className="rounded-2xl border border-orange-100 bg-orange-50 p-4 font-medium text-slate-900 placeholder:text-slate-500 outline-none transition focus:border-orange-400 focus:bg-white disabled:bg-orange-100"
                />

                <input
                  placeholder="Telefon"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phone: e.target.value,
                    })
                  }
                  className="rounded-2xl border border-orange-100 bg-orange-50 p-4 font-medium text-slate-900 placeholder:text-slate-500 outline-none transition focus:border-orange-400 focus:bg-white"
                />

                <input
                  placeholder="Adres"
                  value={form.address}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      address: e.target.value,
                    })
                  }
                  className="rounded-2xl border border-orange-100 bg-orange-50 p-4 font-medium text-slate-900 placeholder:text-slate-500 outline-none transition focus:border-orange-400 focus:bg-white"
                />
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
                <input
                  placeholder="Kart Üzerindeki İsim"
                  value={card.cardHolderName}
                  onChange={(e) =>
                    setCard({
                      ...card,
                      cardHolderName: e.target.value,
                    })
                  }
                  className="rounded-2xl border border-orange-100 bg-orange-50 p-4 font-medium text-slate-900 placeholder:text-slate-500 outline-none transition focus:border-orange-400 focus:bg-white md:col-span-2"
                />

                <input
                  placeholder="Kart Numarası"
                  value={card.cardNumber}
                  onChange={(e) =>
                    setCard({
                      ...card,
                      cardNumber: e.target.value,
                    })
                  }
                  className="rounded-2xl border border-orange-100 bg-orange-50 p-4 font-medium text-slate-900 placeholder:text-slate-500 outline-none transition focus:border-orange-400 focus:bg-white md:col-span-2"
                />

                <input
                  placeholder="Ay Örn: 12"
                  value={card.expireMonth}
                  onChange={(e) =>
                    setCard({
                      ...card,
                      expireMonth: e.target.value,
                    })
                  }
                  className="rounded-2xl border border-orange-100 bg-orange-50 p-4 font-medium text-slate-900 placeholder:text-slate-500 outline-none transition focus:border-orange-400 focus:bg-white"
                />

                <input
                  placeholder="Yıl Örn: 2030"
                  value={card.expireYear}
                  onChange={(e) =>
                    setCard({
                      ...card,
                      expireYear: e.target.value,
                    })
                  }
                  className="rounded-2xl border border-orange-100 bg-orange-50 p-4 font-medium text-slate-900 placeholder:text-slate-500 outline-none transition focus:border-orange-400 focus:bg-white"
                />

                <input
                  placeholder="CVC"
                  value={card.cvc}
                  onChange={(e) =>
                    setCard({
                      ...card,
                      cvc: e.target.value,
                    })
                  }
                  className="rounded-2xl border border-orange-100 bg-orange-50 p-4 font-medium text-slate-900 placeholder:text-slate-500 outline-none transition focus:border-orange-400 focus:bg-white"
                />
              </div>
            </div>

            <button
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-orange-500 px-6 py-5 text-lg font-black text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Lock size={22} />

              {loading
                ? "Ödeme İşleniyor..."
                : `₺${Number(total).toLocaleString("tr-TR")} Öde`}
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
                  ₺{(item.price * item.quantity).toLocaleString("tr-TR")}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-orange-100 pt-6">
            <span className="text-lg font-bold text-slate-950">Toplam</span>

            <span className="text-3xl font-black text-orange-600">
              ₺
              {Number(product.price).toLocaleString("tr-TR", {
                maximumFractionDigits: 0,
              })}
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
