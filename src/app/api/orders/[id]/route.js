import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";

export async function PATCH(req, context) {
  try {
    const admin = await requireAdmin();

    if (!admin) {
      return NextResponse.json({ error: "Yetkisiz işlem" }, { status: 403 });
    }

    await connectDB();

    const { id } = await context.params;
    const body = await req.json();

    const allowedStatuses = ["hazırlanıyor", "kargoda", "teslim edildi"];

    if (!allowedStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: "Geçersiz sipariş durumu" },
        { status: 400 },
      );
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status: body.status },
      { new: true },
    );

    if (!updatedOrder) {
      return NextResponse.json(
        { error: "Sipariş bulunamadı" },
        { status: 404 },
      );
    }

    return NextResponse.json(JSON.parse(JSON.stringify(updatedOrder)));
  } catch (error) {
    console.log("ORDER UPDATE ERROR:", error);

    return NextResponse.json(
      { error: "Sipariş güncellenemedi" },
      { status: 500 },
    );
  }
}
