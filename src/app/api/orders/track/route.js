import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    if (!body.email || !body.orderCode) {
      return NextResponse.json(
        { error: "Email ve sipariş kodu gerekli" },
        { status: 400 },
      );
    }

    const order = await Order.findOne({
      orderCode: body.orderCode.trim().toUpperCase(),
      "customer.email": body.email.trim(),
    });

    if (!order) {
      return NextResponse.json(
        { error: "Sipariş bulunamadı" },
        { status: 404 },
      );
    }

    return NextResponse.json(JSON.parse(JSON.stringify(order)));
  } catch (error) {
    console.log("ORDER TRACK ERROR:", error);

    return NextResponse.json(
      { error: "Sipariş sorgulanamadı" },
      { status: 500 },
    );
  }
}
