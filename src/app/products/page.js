import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import ProductFilterClient from "@/components/ProductFilterClient";

async function getProducts() {
  await connectDB();

  const products = await Product.find().sort({
    createdAt: -1,
  });

  return JSON.parse(JSON.stringify(products));
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main className="w-full">
      <section className="mb-12 flex flex-col items-center rounded-[32px] border border-orange-100 bg-white px-6 py-12 text-center shadow-sm sm:px-8 lg:px-12">
        <div className="mb-5 inline-flex rounded-full border border-orange-200 bg-orange-50 px-5 py-2">
          <span className="text-sm font-bold text-orange-600">
            Premium Search
          </span>
        </div>

        <h1 className="max-w-4xl text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
          Tüm Ürünler
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
          Tüm ürünleri filtreleyin, arayın ve size en uygun seçenekleri kolayca
          keşfedin.
        </p>
      </section>

      <ProductFilterClient products={products} />
    </main>
  );
}
