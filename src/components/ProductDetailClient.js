"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { useSession } from "next-auth/react";
import { ShoppingCart, PackageCheck, Heart, CheckCircle2 } from "lucide-react";
import axios from "axios";

export default function ProductDetailClient({ product }) {
  const [activeImage, setActiveImage] = useState(product.images?.[0]);

  const addToCart = useCartStore((state) => state.addToCart);
  const { data: session } = useSession();
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteMessage, setFavoriteMessage] = useState("");

  useEffect(() => {
    const checkFavorite = async () => {
      if (!session?.user) return;

      const res = await axios.get("/api/favorites");

      const exists = res.data.some((item) => item._id === product._id);

      setIsFavorite(exists);
    };

    checkFavorite();
  }, [session, product._id]);

  const handleFavorite = async () => {
    if (!session?.user) {
      setFavoriteMessage("Favorilere eklemek için giriş yapmalısınız.");

      setTimeout(() => {
        setFavoriteMessage("");
      }, 2000);

      return;
    }

    const res = await axios.post("/api/favorites", {
      productId: product._id,
    });

    setIsFavorite(res.data.isFavorite);

    setFavoriteMessage(
      res.data.isFavorite
        ? "Ürün favorilere eklendi."
        : "Ürün favorilerden çıkarıldı.",
    );

    setTimeout(() => {
      setFavoriteMessage("");
    }, 2000);
  };

  return (
    <main className="w-full">
      <section className="grid w-full grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="w-full">
          <div className="rounded-[32px] border border-orange-100 bg-white p-4 shadow-sm">
            <Image
              src={activeImage}
              width={700}
              height={700}
              alt={product.title}
              className="h-[340px] w-full rounded-[24px] bg-orange-50 object-contain p-6 sm:h-[430px] lg:h-[500px]"
            />
          </div>

          <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
            {product.images?.map((img, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(img)}
                className={`shrink-0 overflow-hidden rounded-2xl border p-1 transition ${
                  activeImage === img
                    ? "border-orange-500 bg-orange-100"
                    : "border-orange-100 bg-white hover:border-orange-300"
                }`}
              >
                <Image
                  src={img}
                  width={100}
                  height={100}
                  alt="Ürün görseli"
                  className="h-24 w-24 rounded-xl bg-orange-50 object-contain p-2"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="w-full rounded-[32px] border border-orange-100 bg-white p-6 text-slate-900 shadow-sm sm:p-8 lg:p-10">
          <p className="inline-flex rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-bold uppercase tracking-widest text-orange-600">
            {product.category}
          </p>

          <h1 className="mt-6 text-3xl font-black leading-tight text-slate-950 sm:text-4xl lg:text-5xl">
            {product.title}
          </h1>

          <p className="mt-8 text-4xl font-black text-orange-600">
            ₺
            {Number(product.price).toLocaleString("tr-TR", {
              maximumFractionDigits: 0,
            })}
          </p>

          <div className="mt-8 rounded-3xl border border-orange-100 bg-orange-50 p-5">
            <h2 className="mb-3 text-lg font-black text-slate-950">
              Ürün Açıklaması
            </h2>

            <p className="leading-8 text-slate-700">
              {product.description || "Bu ürün için henüz açıklama eklenmedi."}
            </p>
          </div>

          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-orange-100 bg-white px-5 py-4 text-slate-700">
            <PackageCheck size={22} className="text-orange-500" />

            <span className="font-semibold">
              Stok Durumu:{" "}
              <strong className="text-slate-950">{product.stock}</strong>
            </span>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {session?.user?.role !== "admin" && (
              <button
                onClick={() => addToCart(product)}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-orange-500 px-8 py-4 text-lg font-black text-white shadow transition hover:bg-orange-600"
              >
                <ShoppingCart size={22} />
                Sepete Ekle
              </button>
            )}

            {session?.user?.role !== "admin" && (
              <button
                onClick={handleFavorite}
                className={`flex w-full items-center justify-center gap-3 rounded-2xl border px-8 py-4 text-lg font-black transition ${
                  isFavorite
                    ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                    : "border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100"
                }`}
              >
                <Heart size={22} fill={isFavorite ? "currentColor" : "none"} />
                {isFavorite ? "Favorilerden Çıkar" : "Favorilere Ekle"}
              </button>
            )}
          </div>

          {favoriteMessage && (
            <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-bold text-green-700">
              <CheckCircle2 size={18} />
              {favoriteMessage}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
