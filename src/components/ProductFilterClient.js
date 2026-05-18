"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";

export default function ProductFilterClient({ products }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);

  const categories = useMemo(() => {
    return [
      "all",
      ...new Set(
        products.map((product) => product.category?.trim()).filter(Boolean),
      ),
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const title = product.title?.toLowerCase() || "";
      const desc = product.description?.toLowerCase() || "";
      const searchValue = search.toLowerCase();

      const matchesSearch =
        title.includes(searchValue) || desc.includes(searchValue);

      const matchesCategory =
        category === "all" || product.category === category;

      const matchesMin = minPrice === "" || product.price >= Number(minPrice);

      const matchesMax = maxPrice === "" || product.price <= Number(maxPrice);

      const matchesStock = !inStockOnly || Number(product.stock) > 0;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesMin &&
        matchesMax &&
        matchesStock
      );
    });
  }, [products, search, category, minPrice, maxPrice, inStockOnly]);

  const resetFilters = () => {
    setSearch("");
    setCategory("all");
    setMinPrice("");
    setMaxPrice("");
    setInStockOnly(false);
  };

  return (
    <section className="w-full">
      <div className="mb-10 rounded-[32px] border border-orange-100 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
        <div className="mb-6 flex flex-col gap-3">
          <h2 className="text-2xl font-black text-slate-950">
            Ürünleri Filtrele
          </h2>

          <p className="text-sm leading-6 text-slate-600">
            Ürün adı, kategori, fiyat aralığı ve stok durumuna göre arama
            yapabilirsiniz.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ürün ara..."
            className="rounded-2xl border border-orange-100 bg-orange-50 p-4 font-medium text-slate-900 placeholder:text-slate-500 outline-none transition focus:border-orange-400 focus:bg-white md:col-span-2"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-2xl border border-orange-100 bg-orange-50 p-4 font-medium text-slate-900 outline-none transition focus:border-orange-400 focus:bg-white"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "all" ? "Tüm Kategoriler" : cat}
              </option>
            ))}
          </select>

          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min fiyat"
            className="rounded-2xl border border-orange-100 bg-orange-50 p-4 font-medium text-slate-900 placeholder:text-slate-500 outline-none transition focus:border-orange-400 focus:bg-white"
          />

          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max fiyat"
            className="rounded-2xl border border-orange-100 bg-orange-50 p-4 font-medium text-slate-900 placeholder:text-slate-500 outline-none transition focus:border-orange-400 focus:bg-white"
          />

          <label className="flex items-center gap-3 rounded-2xl border border-orange-100 bg-orange-50 px-5 py-4 text-slate-700 md:col-span-2">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="h-5 w-5 accent-orange-500"
            />

            <span className="font-semibold">Sadece stokta olan ürünler</span>
          </label>

          <button
            onClick={resetFilters}
            className="rounded-2xl border border-orange-200 bg-white px-5 py-4 font-bold text-orange-700 transition hover:bg-orange-50"
          >
            Filtreleri Temizle
          </button>

          <div className="flex items-center justify-start rounded-2xl bg-orange-100 px-5 py-4 text-sm font-bold text-orange-700 md:col-span-2 xl:justify-end">
            {filteredProducts.length} ürün bulundu
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="rounded-[32px] border border-orange-100 bg-white p-12 text-center shadow-sm">
          <h2 className="text-3xl font-black text-slate-950">
            Ürün bulunamadı
          </h2>

          <p className="mt-4 text-lg leading-8 text-slate-600">
            Arama veya filtre seçeneklerini değiştirerek tekrar deneyin.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 justify-items-center gap-8 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="flex w-full max-w-[340px] justify-center"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
