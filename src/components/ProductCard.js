"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Eye } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useSession } from "next-auth/react";

export default function ProductCard({ product }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const { data: session } = useSession();

  return (
    <div className="group flex h-full w-full flex-col overflow-hidden rounded-[28px] border border-orange-100 bg-white text-slate-900 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl">
      <Link href={`/products/${product._id}`} className="block">
        <div className="relative flex h-[260px] w-full items-center justify-center overflow-hidden bg-orange-50 p-6">
          <Image
            src={product.images?.[0]}
            width={600}
            height={450}
            alt={product.title}
            className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
          />

          <div className="absolute right-4 top-4 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white shadow">
            Yeni
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <Link href={`/products/${product._id}`}>
          <h2 className="min-h-[56px] text-center text-lg font-black leading-tight text-slate-950 transition hover:text-orange-600 line-clamp-2">
            {product.title}
          </h2>
        </Link>

        <p className="mt-4 text-center text-2xl font-black text-orange-600">
          ₺{Number(product.price).toLocaleString("tr-TR")}
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <Link
            href={`/products/${product._id}`}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 font-bold text-orange-700 transition hover:bg-orange-100"
          >
            <Eye size={18} />
            Detayları Gör
          </Link>

          {session?.user?.role !== "admin" && (
            <button
              onClick={() => addToCart(product)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-4 py-4 font-bold text-white shadow transition hover:bg-orange-600"
            >
              <ShoppingCart size={18} />
              Sepete Ekle
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
