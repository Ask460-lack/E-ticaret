// src/components/SkeletonCard.js

export default function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-[32px] border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-2xl">
      <div className="h-64 rounded-2xl bg-white/20" />

      <div className="mt-6 h-5 w-3/4 rounded-full bg-white/20" />
      <div className="mt-3 h-5 w-1/2 rounded-full bg-white/15" />
      <div className="mt-6 h-12 rounded-2xl bg-white/20" />
    </div>
  );
}
