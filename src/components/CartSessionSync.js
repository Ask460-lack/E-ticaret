"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/cartStore";

export default function CartSessionSync() {
  const { data: session, status } = useSession();

  const clearCart = useCartStore((state) => state.clearCart);

  const previousUserRef = useRef(null);

  useEffect(() => {
    if (status === "loading") return;

    const currentUser = session?.user?.email || "guest";

    if (previousUserRef.current === null) {
      previousUserRef.current = currentUser;
      return;
    }

    if (previousUserRef.current !== currentUser) {
      clearCart();
      previousUserRef.current = currentUser;
    }
  }, [session, status, clearCart]);

  return null;
}
