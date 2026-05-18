"use client";

import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import { ShoppingCart, Trash2, Minus, Plus, CreditCard } from "lucide-react";

export default function CartPage() {
  const { cart, removeFromCart, increaseQty, decreaseQty } = useCartStore();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <main className="w-full">
      <section className="mb-12 flex flex-col items-center rounded-[32px] border border-orange-100 bg-white px-6 py-12 text-center shadow-sm sm:px-8 lg:px-12">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-5 py-2">
          <ShoppingCart size={18} className="text-orange-600" />

          <span className="text-sm font-bold text-orange-600">Sepetim</span>
        </div>

        <h1 className="max-w-4xl text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
          Sepetim
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
          Sepetindeki ürünleri kontrol et, adetleri güncelle ve ödeme adımına
          geç.
        </p>
      </section>

      {cart.length === 0 ? (
        <div className="rounded-[32px] border border-orange-100 bg-white p-12 text-center shadow-sm">
          <h2 className="text-3xl font-black text-slate-950">Sepet boş</h2>

          <p className="mt-4 text-lg leading-8 text-slate-600">
            Alışverişe başlamak için ürünleri inceleyebilirsin.
          </p>

          <Link
            href="/products"
            className="mt-8 inline-flex items-center justify-center rounded-2xl bg-orange-500 px-8 py-4 font-black text-white transition hover:bg-orange-600"
          >
            Ürünlere Git
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 xl:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            {cart.map((item) => (
              <div
                key={item._id}
                className="rounded-[28px] border border-orange-100 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-slate-950">
                      {item.title}
                    </h2>

                    <p className="mt-2 text-xl font-black text-orange-600">
                      ₺{Number(item.price).toLocaleString("tr-TR")}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3">
                      <button
                        onClick={() => decreaseQty(item._id)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm transition hover:bg-orange-100"
                      >
                        <Minus size={18} />
                      </button>

                      <span className="min-w-8 text-center text-lg font-black text-slate-950">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => increaseQty(item._id)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm transition hover:bg-orange-100"
                      >
                        <Plus size={18} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500 text-white transition hover:bg-red-600"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="h-fit rounded-[32px] border border-orange-100 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">
              Sipariş Özeti
            </h2>

            <div className="mt-6 space-y-4 border-b border-orange-100 pb-6">
              <div className="flex justify-between text-slate-600">
                <span>Ürün Sayısı</span>
                <span>{cart.length}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Ara Toplam</span>

                <span>₺{Number(total).toLocaleString("tr-TR")}</span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <span className="text-lg font-bold text-slate-950">Toplam</span>

              <span className="text-3xl font-black text-orange-600">
                ₺{Number(total).toLocaleString("tr-TR")}
              </span>
            </div>

            <Link
              href="/checkout"
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 py-4 font-black text-white transition hover:bg-orange-600"
            >
              <CreditCard size={20} />
              Checkout
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}
