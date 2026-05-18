import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { ArrowRight, ShieldCheck, Truck, BadgeCheck } from "lucide-react";

async function getProducts() {
  await connectDB();

  const products = await Product.find().sort({
    createdAt: -1,
  });

  return JSON.parse(JSON.stringify(products));
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <main className="w-full">
      <section className="relative overflow-hidden rounded-[40px] border border-orange-100 bg-white px-6 py-16 shadow-sm sm:px-10 lg:px-16 lg:py-24">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange-100 blur-3xl" />

        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-orange-200/60 blur-3xl" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-5 py-2">
            <ShieldCheck size={18} className="text-orange-600" />

            <span className="text-sm font-bold text-orange-600">
              Premium Collection
            </span>
          </div>

          <h1 className="max-w-5xl text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-7xl">
            Modern ve Güvenilir
            <span className="block text-orange-600">E-Ticaret Deneyimi</span>
          </h1>

          <p className="mt-8 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
            En yeni ürünleri keşfedin, güvenli ödeme sistemiyle alışveriş yapın
            ve premium kullanıcı deneyiminin tadını çıkarın.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/products"
              className="flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-8 py-5 text-lg font-black text-white transition hover:bg-orange-600"
            >
              Ürünleri İncele
              <ArrowRight size={22} />
            </Link>

            <Link
              href="/track-order"
              className="rounded-2xl border border-orange-200 bg-orange-50 px-8 py-5 text-lg font-bold text-orange-700 transition hover:bg-orange-100"
            >
              Sipariş Takip
            </Link>
          </div>

          <div className="mt-16 grid w-full max-w-5xl gap-5 md:grid-cols-3">
            <div className="rounded-3xl border border-orange-100 bg-orange-50 p-6 text-left">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white">
                <ShieldCheck className="text-orange-600" />
              </div>

              <h3 className="text-xl font-black text-slate-950">
                Güvenli Ödeme
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Güçlü ödeme altyapısıyla güvenli alışveriş deneyimi.
              </p>
            </div>

            <div className="rounded-3xl border border-orange-100 bg-orange-50 p-6 text-left">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white">
                <Truck className="text-orange-600" />
              </div>

              <h3 className="text-xl font-black text-slate-950">
                Hızlı Teslimat
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Siparişlerinizi hızlı ve güvenli şekilde ulaştırıyoruz.
              </p>
            </div>

            <div className="rounded-3xl border border-orange-100 bg-orange-50 p-6 text-left">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white">
                <BadgeCheck className="text-orange-600" />
              </div>

              <h3 className="text-xl font-black text-slate-950">
                Premium Kalite
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Özenle seçilmiş kaliteli ürünlerle modern alışveriş deneyimi.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="mb-4 inline-flex rounded-full border border-orange-200 bg-orange-50 px-5 py-2">
            <span className="text-sm font-bold text-orange-600">
              Featured Products
            </span>
          </div>

          <h2 className="text-4xl font-black tracking-tight text-slate-950">
            Öne Çıkan Ürünler
          </h2>

          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
            En popüler ürünleri inceleyin ve alışverişe başlayın.
          </p>
        </div>

        <ProductGrid products={products} />
      </section>
    </main>
  );
}
