"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, LogOut, Menu, X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const cart = useCartStore((state) => state.cart);
  const [open, setOpen] = useState(false);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-orange-100 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-20 w-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="shrink-0 text-xl font-black tracking-tight text-orange-600 sm:text-2xl"
        >
          E-Ticaret Bizim İşimiz
        </Link>

        <nav className="hidden items-center gap-2 xl:flex">
          <Link
            href="/"
            className="rounded-xl px-4 py-2 font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-600"
          >
            Ana Sayfa
          </Link>

          <Link
            href="/products"
            className="rounded-xl px-4 py-2 font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-600"
          >
            Ürünler
          </Link>

          <Link
            href="/track-order"
            className="rounded-xl px-4 py-2 font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-600"
          >
            Sipariş Takip
          </Link>

          {session && (
            <Link
              href="/my-orders"
              className="rounded-xl px-4 py-2 font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-600"
            >
              Siparişlerim
            </Link>
          )}
          {session && session?.user?.role !== "admin" && (
            <Link
              href="/favorites"
              className="rounded-xl px-4 py-2 font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-600"
            >
              Favorilerim
            </Link>
          )}

          {session?.user?.role === "admin" && (
            <Link
              href="/admin"
              className="rounded-xl bg-orange-500 px-5 py-2 font-bold text-white hover:bg-orange-600"
            >
              Admin
            </Link>
          )}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <Link
            href="/cart"
            className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-100 bg-orange-50 text-orange-600 hover:bg-orange-100"
          >
            <ShoppingCart size={22} />

            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-orange-500 px-1 text-xs font-black text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {session ? (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-2 rounded-2xl border border-orange-200 bg-orange-50 px-5 py-3 font-bold text-orange-700 hover:bg-orange-100"
            >
              <LogOut size={18} />
              Çıkış
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-2xl border border-orange-200 bg-orange-50 px-5 py-3 font-bold text-orange-700 hover:bg-orange-100"
              >
                Giriş
              </Link>

              <Link
                href="/register"
                className="rounded-2xl bg-orange-500 px-5 py-3 font-bold text-white hover:bg-orange-600"
              >
                Kayıt Ol
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-100 bg-orange-50 text-orange-600 xl:hidden"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-orange-100 bg-white xl:hidden">
          <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-3 px-4 py-5 sm:px-6">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="rounded-2xl px-4 py-3 font-semibold text-slate-700 hover:bg-orange-50"
            >
              Ana Sayfa
            </Link>

            <Link
              href="/products"
              onClick={() => setOpen(false)}
              className="rounded-2xl px-4 py-3 font-semibold text-slate-700 hover:bg-orange-50"
            >
              Ürünler
            </Link>

            <Link
              href="/track-order"
              onClick={() => setOpen(false)}
              className="rounded-2xl px-4 py-3 font-semibold text-slate-700 hover:bg-orange-50"
            >
              Sipariş Takip
            </Link>

            {session && (
              <Link
                href="/my-orders"
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 font-semibold text-slate-700 hover:bg-orange-50"
              >
                Siparişlerim
              </Link>
            )}
            {session && session?.user?.role !== "admin" && (
              <Link
                href="/favorites"
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 font-semibold text-slate-700 hover:bg-orange-50"
              >
                Favorilerim
              </Link>
            )}

            {session?.user?.role === "admin" && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="rounded-2xl bg-orange-500 px-4 py-3 text-center font-bold text-white"
              >
                Admin
              </Link>
            )}

            <Link
              href="/cart"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 font-bold text-orange-700"
            >
              <ShoppingCart size={20} />
              Sepet {cartCount > 0 && `(${cartCount})`}
            </Link>

            {session ? (
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 font-bold text-orange-700"
              >
                Çıkış
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-center font-bold text-orange-700"
                >
                  Giriş
                </Link>

                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="rounded-2xl bg-orange-500 px-4 py-3 text-center font-bold text-white"
                >
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
