import Link from "next/link";
import { Package, ShoppingBag, ArrowLeft, ShieldCheck } from "lucide-react";

export default function AdminPage() {
  return (
    <main className="w-full">
      <section className="mb-12 flex flex-col items-center rounded-[32px] border border-orange-100 bg-white px-6 py-12 text-center shadow-sm sm:px-8 lg:px-12">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-5 py-2">
          <ShieldCheck size={18} className="text-orange-600" />

          <span className="text-sm font-bold text-orange-600">
            Yönetim Paneli
          </span>
        </div>

        <h1 className="max-w-4xl text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
          Yönetici Kontrol Paneli
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
          Ürünleri yönetin, siparişleri takip edin ve mağazanızı kolayca kontrol
          edin.
        </p>
      </section>

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        <Link
          href="/admin/products"
          className="group rounded-[32px] border border-orange-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-orange-200 hover:shadow-xl"
        >
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50">
            <Package size={30} className="text-orange-600" />
          </div>

          <h2 className="text-2xl font-black text-slate-950">Ürün Yönetimi</h2>

          <p className="mt-4 leading-7 text-slate-600">
            Yeni ürün ekleyin, mevcut ürünleri güncelleyin ve stok durumlarını
            yönetin.
          </p>

          <div className="mt-6 font-bold text-orange-600 transition group-hover:translate-x-1">
            Yönetimi Aç →
          </div>
        </Link>

        <Link
          href="/admin/orders"
          className="group rounded-[32px] border border-orange-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-orange-200 hover:shadow-xl"
        >
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50">
            <ShoppingBag size={30} className="text-orange-600" />
          </div>

          <h2 className="text-2xl font-black text-slate-950">Siparişler</h2>

          <p className="mt-4 leading-7 text-slate-600">
            Gelen siparişleri görüntüleyin, sipariş durumlarını kontrol edin ve
            müşterileri yönetin.
          </p>

          <div className="mt-6 font-bold text-orange-600 transition group-hover:translate-x-1">
            Siparişleri Gör →
          </div>
        </Link>

        <Link
          href="/"
          className="group rounded-[32px] border border-orange-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-orange-200 hover:shadow-xl"
        >
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50">
            <ArrowLeft size={30} className="text-orange-600" />
          </div>

          <h2 className="text-2xl font-black text-slate-950">Siteye Dön</h2>

          <p className="mt-4 leading-7 text-slate-600">
            Ana mağazaya geri dönün ve kullanıcı deneyimini görüntüleyin.
          </p>

          <div className="mt-6 font-bold text-orange-600 transition group-hover:translate-x-1">
            Ana Sayfaya Git →
          </div>
        </Link>
      </div>
    </main>
  );
}
