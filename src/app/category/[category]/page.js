import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import ProductGrid from "@/components/ProductGrid";
import { PackageSearch } from "lucide-react";

async function getProducts(category) {
  await connectDB();

  const decodedCategory = decodeURIComponent(category).trim();

  const products = await Product.find({
    category: decodedCategory,
  }).sort({
    createdAt: -1,
  });

  return JSON.parse(JSON.stringify(products));
}

export default async function CategoryPage({ params }) {
  const { category } = await params;

  const decodedCategory = decodeURIComponent(category).trim();

  const products = await getProducts(category);

  return (
    <main className="w-full">
      <section className="mb-12 flex flex-col items-center rounded-[32px] border border-orange-100 bg-white px-6 py-12 text-center shadow-sm sm:px-8 lg:px-12">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-5 py-2">
          <PackageSearch size={18} className="text-orange-600" />

          <span className="text-sm font-bold text-orange-600">
            Kategori Sayfası
          </span>
        </div>

        <h1 className="max-w-4xl text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
          {decodedCategory}
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
          {decodedCategory} kategorisindeki ürünleri keşfedin ve size en uygun
          seçenekleri inceleyin.
        </p>
      </section>

      {products.length === 0 ? (
        <div className="rounded-[32px] border border-orange-100 bg-white p-12 text-center shadow-sm">
          <h2 className="text-3xl font-black text-slate-950">
            Ürün Bulunamadı
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            Bu kategoride henüz ürün bulunmuyor.
          </p>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </main>
  );
}
