"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import {
  PackageCheck,
  Truck,
  CheckCircle2,
  ShoppingBag,
  Search,
  Filter,
} from "lucide-react";

export default function AdminOrdersPage() {
  const { data: session, status } = useSession();

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchOrders = async () => {
    const res = await axios.get("/api/orders");
    setOrders(res.data);
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "admin") {
      fetchOrders();
    }
  }, [status, session]);

  const updateStatus = async (id, newStatus) => {
    await axios.patch(`/api/orders/${id}`, {
      status: newStatus,
    });

    fetchOrders();
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const customerName = order.customer?.name?.toLowerCase() || "";
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        searchValue === "" || customerName.includes(searchValue);

      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  if (status === "loading") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="rounded-3xl border border-orange-100 bg-white px-10 py-6 text-2xl font-black text-slate-950 shadow-sm">
          Yükleniyor...
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="rounded-3xl border border-orange-100 bg-white px-10 py-6 text-3xl font-black text-slate-950 shadow-sm">
          Lütfen giriş yapın.
        </div>
      </div>
    );
  }

  if (session?.user?.role !== "admin") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="rounded-3xl border border-orange-100 bg-white px-10 py-6 text-3xl font-black text-slate-950 shadow-sm">
          Yetkisiz erişim
        </div>
      </div>
    );
  }

  return (
    <main className="w-full">
      <section className="mb-12 flex flex-col items-center rounded-[32px] border border-orange-100 bg-white px-6 py-12 text-center shadow-sm sm:px-8 lg:px-12">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-5 py-2">
          <ShoppingBag size={18} className="text-orange-600" />

          <span className="text-sm font-bold text-orange-600">
            Sipariş Yönetimi
          </span>
        </div>

        <h1 className="max-w-4xl text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
          Siparişler
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
          Gelen siparişleri yönetin, durumlarını filtreleyin ve müşteri adına
          göre hızlıca arama yapın.
        </p>
      </section>

      <section className="mb-10 rounded-[32px] border border-orange-100 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
        <div className="grid gap-4 lg:grid-cols-[1fr_260px_180px]">
          <div className="relative">
            <Search
              size={20}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-orange-500"
            />

            <input
              type="text"
              value={search}
              placeholder="Müşteri adı veya soyadı ile ara..."
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-orange-100 bg-orange-50 py-4 pl-4 pr-14 font-medium text-slate-900 placeholder:text-slate-500 outline-none transition focus:border-orange-400 focus:bg-white"
            />
          </div>

          <div className="relative">
            <Filter
              size={20}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-orange-500"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full appearance-none rounded-2xl border border-orange-100 bg-orange-50 py-4 pl-4 pr-14 font-semibold text-slate-900 outline-none transition focus:border-orange-400 focus:bg-white"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="hazırlanıyor">Hazırlanıyor</option>
              <option value="kargoda">Kargoda</option>
              <option value="teslim edildi">Teslim Edildi</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setStatusFilter("all");
            }}
            className="rounded-2xl border border-orange-200 bg-white px-5 py-4 font-black text-orange-700 transition hover:bg-orange-50"
          >
            Temizle
          </button>
        </div>

        <div className="mt-5 rounded-2xl bg-orange-50 px-5 py-4 text-sm font-bold text-orange-700">
          {filteredOrders.length} sipariş bulundu
        </div>
      </section>

      {orders.length === 0 ? (
        <div className="rounded-[32px] border border-orange-100 bg-white p-12 text-center shadow-sm">
          <h2 className="text-3xl font-black text-slate-950">
            Henüz sipariş yok
          </h2>

          <p className="mt-5 text-lg text-slate-600">
            Yeni siparişler burada görüntülenecek.
          </p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="rounded-[32px] border border-orange-100 bg-white p-12 text-center shadow-sm">
          <h2 className="text-3xl font-black text-slate-950">
            Sonuç bulunamadı
          </h2>

          <p className="mt-5 text-lg text-slate-600">
            Arama veya filtre seçeneklerini değiştirerek tekrar deneyin.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="rounded-[32px] border border-orange-100 bg-white p-8 shadow-sm"
            >
              <div className="flex flex-col gap-10 xl:flex-row xl:items-start xl:justify-between">
                <div className="flex-1">
                  <div className="rounded-3xl border border-orange-100 bg-orange-50 p-6">
                    <h2 className="text-2xl font-black text-slate-950">
                      {order.customer?.name}
                    </h2>

                    <div className="mt-5 space-y-3 text-slate-600">
                      <p>{order.customer?.email}</p>
                      <p>{order.customer?.phone}</p>
                      <p>{order.customer?.address}</p>
                    </div>
                  </div>

                  <div className="mt-8 rounded-3xl border border-orange-100 bg-white p-6">
                    <h3 className="mb-6 text-xl font-black text-slate-950">
                      Sipariş Ürünleri
                    </h3>

                    <div className="space-y-4">
                      {order.items?.map((item, index) => (
                        <div
                          key={index}
                          className="flex flex-col gap-3 rounded-2xl border border-orange-100 bg-orange-50 p-5 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div>
                            <p className="font-bold text-slate-950">
                              {item.title}
                            </p>

                            <p className="mt-1 text-sm text-slate-600">
                              Adet: {item.quantity}
                            </p>
                          </div>

                          <span className="shrink-0 text-lg font-black text-orange-600">
                            ₺
                            {Number(product.price).toLocaleString("tr-TR", {
                              maximumFractionDigits: 0,
                            })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="w-full rounded-3xl border border-orange-100 bg-orange-50 p-8 xl:max-w-sm">
                  <div className="mb-8">
                    <p className="text-sm font-bold uppercase tracking-widest text-slate-500">
                      Sipariş Toplamı
                    </p>

                    <h3 className="mt-4 text-4xl font-black text-orange-600">
                      ₺{Number(order.total).toLocaleString("tr-TR")}
                    </h3>
                  </div>

                  <div className="mb-6 flex items-center gap-4">
                    {order.status === "hazırlanıyor" && (
                      <PackageCheck className="text-orange-500" />
                    )}

                    {order.status === "kargoda" && (
                      <Truck className="text-orange-500" />
                    )}

                    {order.status === "teslim edildi" && (
                      <CheckCircle2 className="text-green-500" />
                    )}

                    <span className="font-bold capitalize text-slate-950">
                      {order.status}
                    </span>
                  </div>

                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className="w-full rounded-2xl border border-orange-100 bg-white px-4 py-4 font-semibold text-slate-900 outline-none transition focus:border-orange-400"
                  >
                    <option value="hazırlanıyor">Hazırlanıyor</option>
                    <option value="kargoda">Kargoda</option>
                    <option value="teslim edildi">Teslim Edildi</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
