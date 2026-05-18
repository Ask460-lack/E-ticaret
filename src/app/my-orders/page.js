"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { ShoppingBag, PackageCheck, Truck, CheckCircle2 } from "lucide-react";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await axios.get("/api/my-orders");
    setOrders(res.data);
  };

  return (
    <main className="w-full">
      <section className="mb-12 flex flex-col items-center rounded-[32px] border border-orange-100 bg-white px-6 py-12 text-center shadow-sm sm:px-8 lg:px-12">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-5 py-2">
          <ShoppingBag size={18} className="text-orange-600" />

          <span className="text-sm font-bold text-orange-600">
            Sipariş Takibi
          </span>
        </div>

        <h1 className="max-w-4xl text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
          Siparişlerim
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
          Verdiğiniz siparişleri, ürün detaylarını ve güncel durumlarını buradan
          takip edebilirsiniz.
        </p>
      </section>

      {orders.length === 0 ? (
        <div className="rounded-[32px] border border-orange-100 bg-white p-12 text-center shadow-sm">
          <h2 className="text-3xl font-black text-slate-950">
            Henüz siparişiniz yok
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            Sipariş verdiğinizde durumunu buradan takip edebilirsiniz.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-[32px] border border-orange-100 bg-white p-8 shadow-sm"
            >
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

                    <span className="text-xl font-black capitalize text-slate-950">
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl border border-orange-100 bg-orange-50 px-5 py-4">
                  <p className="text-sm text-slate-500">Toplam Tutar</p>

                  <p className="mt-1 text-3xl font-black text-orange-600">
                    ₺{Number(order.total).toLocaleString("tr-TR")}
                  </p>
                </div>
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
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
