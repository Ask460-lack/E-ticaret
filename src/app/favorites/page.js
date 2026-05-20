"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import ProductGrid from "@/components/ProductGrid";
import { Heart } from "lucide-react";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const res = await axios.get("/api/favorites");
      setFavorites(res.data);
    };

    fetchFavorites();
  }, []);

  return (
    <main className="w-full">
      <section className="mb-12 flex flex-col items-center rounded-[32px] border border-orange-100 bg-white px-6 py-12 text-center shadow-sm sm:px-8 lg:px-12">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-5 py-2">
          <Heart size={18} className="text-orange-600" />

          <span className="text-sm font-bold text-orange-600">Favorilerim</span>
        </div>

        <h1 className="text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
          Favorilerim
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
          Beğendiğiniz ürünleri burada görüntüleyebilirsiniz.
        </p>
      </section>

      {favorites.length === 0 ? (
        <div className="rounded-[32px] border border-orange-100 bg-white p-12 text-center shadow-sm">
          <h2 className="text-3xl font-black text-slate-950">
            Favori ürününüz yok
          </h2>

          <p className="mt-5 text-lg text-slate-600">
            Ürünleri favorilere eklediğinizde burada görünecek.
          </p>
        </div>
      ) : (
        <ProductGrid products={favorites} />
      )}
    </main>
  );
}
