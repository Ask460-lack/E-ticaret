import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Link from "next/link";
import { CheckCircle2, PackageSearch, Mail, ShieldCheck } from "lucide-react";

async function getOrder(id) {
  await connectDB();

  const order = await Order.findById(id);

  return JSON.parse(JSON.stringify(order));
}

export default async function OrderSuccessPage({ params }) {
  const { id } = await params;

  const order = await getOrder(id);

  if (!order) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        <div className="w-full max-w-2xl rounded-[32px] border border-orange-100 bg-white p-12 text-center shadow-sm">
          <h1 className="text-4xl font-black text-slate-950">
            Sipariş Bulunamadı
          </h1>

          <p className="mt-5 text-lg text-slate-600">
            Böyle bir sipariş kaydı bulunamadı.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-[75vh] items-center justify-center">
      <div className="w-full max-w-3xl rounded-[40px] border border-orange-100 bg-white p-8 shadow-sm sm:p-10 lg:p-12">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 size={52} className="text-green-600" />
          </div>

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-5 py-2">
            <ShieldCheck size={18} className="text-orange-600" />

            <span className="text-sm font-bold text-orange-600">
              Sipariş Başarılı
            </span>
          </div>

          <h1 className="text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
            Siparişiniz Alındı
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
            Siparişiniz başarıyla oluşturuldu. Sipariş durumunuzu takip etmek
            için aşağıdaki sipariş kodunu saklayın.
          </p>
        </div>

        <div className="mt-10 rounded-[32px] border border-orange-100 bg-orange-50 p-8 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-slate-500">
            Sipariş Kodu
          </p>

          <p className="mt-5 break-all text-3xl font-black tracking-[0.18em] text-orange-600 sm:text-4xl">
            {order.orderCode}
          </p>
        </div>

        <div className="mt-8 flex items-center gap-4 rounded-3xl border border-orange-100 bg-white p-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50">
            <Mail size={26} className="text-orange-600" />
          </div>

          <div>
            <p className="text-sm font-bold text-slate-500">Sipariş Emaili</p>

            <p className="mt-1 text-lg font-bold text-slate-950">
              {order.customer?.email}
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/track-order"
            className="flex flex-1 items-center justify-center gap-3 rounded-2xl bg-orange-500 px-6 py-5 text-lg font-black text-white transition hover:bg-orange-600"
          >
            <PackageSearch size={22} />
            Sipariş Takip Et
          </Link>

          <Link
            href="/"
            className="flex flex-1 items-center justify-center rounded-2xl border border-orange-200 bg-orange-50 px-6 py-5 text-lg font-bold text-orange-700 transition hover:bg-orange-100"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </main>
  );
}
