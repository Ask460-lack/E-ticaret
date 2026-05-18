import ProductCard from "./ProductCard";

export default function ProductGrid({ products }) {
  return (
    <section className="w-full">
      <div className="mx-auto w-full">
        <div className="grid grid-cols-1 justify-items-center gap-8 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="flex w-full max-w-[340px] justify-center"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
