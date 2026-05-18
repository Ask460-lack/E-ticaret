import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  const orders = await Order.find().sort({
    createdAt: -1,
  });

  return NextResponse.json(JSON.parse(JSON.stringify(orders)));
}

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    if (!body.items || body.items.length === 0) {
      return NextResponse.json({ error: "Sepet boş" }, { status: 400 });
    }

    if (
      !body.customer?.name ||
      !body.customer?.email ||
      !body.customer?.address ||
      !body.customer?.phone
    ) {
      return NextResponse.json(
        { error: "Müşteri bilgileri eksik" },
        { status: 400 },
      );
    }

    let total = 0;

    const secureItems = [];

    for (const item of body.items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
      }

      const quantity = Number(item.quantity);

      if (quantity < 1) {
        return NextResponse.json(
          { error: "Geçersiz ürün adedi" },
          { status: 400 },
        );
      }

      total += product.price * quantity;

      secureItems.push({
        productId: product._id.toString(),
        title: product.title,
        price: product.price,
        quantity,
      });
    }

    const orderCode =
      "ORD-" + Math.random().toString(36).substring(2, 8).toUpperCase();

    const order = await Order.create({
      items: secureItems,
      total,
      customer: body.customer,
      status: "hazırlanıyor",
      orderCode,
    });

    return NextResponse.json(JSON.parse(JSON.stringify(order)));
  } catch (error) {
    console.log("ORDER CREATE ERROR:", error);

    return NextResponse.json(
      { error: "Sipariş oluşturulamadı" },
      { status: 500 },
    );
  }
}
