// src/app/products/loading.js

import SkeletonCard from "@/components/SkeletonCard";

export default function Loading() {
  return (
    <main className="w-full px-4 py-10">
      <div className="mb-14 flex flex-col items-center text-center">
        <div className="h-10 w-40 animate-pulse rounded-full bg-white/10" />
        <div className="mt-6 h-14 w-80 animate-pulse rounded-2xl bg-white/10" />
        <div className="mt-5 h-6 w-full max-w-xl animate-pulse rounded-full bg-white/10" />
      </div>

      <div className="mb-12 h-32 animate-pulse rounded-[32px] border border-white/10 bg-white/10" />

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </main>
  );
}
