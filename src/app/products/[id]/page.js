import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import ProductDetailClient from "@/components/ProductDetailClient";
import { PackageX } from "lucide-react";
import Link from "next/link";

async function getProduct(id) {
  await connectDB();

  const product = await Product.findById(id);

  return JSON.parse(JSON.stringify(product));
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params;

  const product = await getProduct(id);

  if (!product) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        <div className="w-full max-w-2xl rounded-[36px] border border-orange-100 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-orange-100">
            <PackageX size={52} className="text-orange-500" />
          </div>

          <h1 className="text-4xl font-black tracking-tight text-slate-950">
            Ürün Bulunamadı
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Aradığınız ürün mevcut değil veya kaldırılmış olabilir.
          </p>

          <Link
            href="/products"
            className="mt-8 inline-flex items-center justify-center rounded-2xl bg-orange-500 px-8 py-4 font-black text-white shadow transition hover:bg-orange-600"
          >
            Ürünlere Dön
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full">
      <ProductDetailClient product={product} />
    </main>
  );
}
