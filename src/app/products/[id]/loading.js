// src/app/products/[id]/loading.js

export default function Loading() {
  return (
    <main className="mx-auto grid w-full max-w-7xl grid-cols-1 items-start gap-12 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
      <div className="animate-pulse rounded-[36px] border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur-2xl">
        <div className="h-[500px] rounded-[28px] bg-white/20" />
      </div>

      <div className="animate-pulse rounded-[36px] border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-2xl">
        <div className="h-10 w-40 rounded-full bg-white/20" />
        <div className="mt-8 h-14 w-full rounded-2xl bg-white/20" />
        <div className="mt-5 h-14 w-2/3 rounded-2xl bg-white/15" />
        <div className="mt-8 h-40 rounded-3xl bg-white/10" />
        <div className="mt-8 h-14 rounded-2xl bg-white/20" />
      </div>
    </main>
  );
}
