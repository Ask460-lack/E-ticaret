import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET() {
  try {
    await connectDB();

    const products = await Product.find().sort({
      createdAt: -1,
    });

    return NextResponse.json(JSON.parse(JSON.stringify(products)));
  } catch (error) {
    return NextResponse.json(
      { error: "Ürünler getirilemedi" },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    const admin = await requireAdmin();

    if (!admin) {
      return NextResponse.json({ error: "Yetkisiz işlem" }, { status: 403 });
    }

    await connectDB();

    const body = await req.json();

    if (
      !body.title ||
      !body.description ||
      !body.price ||
      !body.images?.length ||
      !body.category ||
      body.stock === undefined
    ) {
      return NextResponse.json(
        { error: "Ürün bilgileri eksik" },
        { status: 400 },
      );
    }

    if (Number(body.price) <= 0 || Number(body.stock) < 0) {
      return NextResponse.json(
        { error: "Fiyat veya stok geçersiz" },
        { status: 400 },
      );
    }

    const product = await Product.create({
      title: body.title,
      description: body.description,
      price: Number(body.price),
      images: body.images,
      category: body.category.trim(),
      stock: Number(body.stock),
    });

    return NextResponse.json(JSON.parse(JSON.stringify(product)));
  } catch (error) {
    console.log("PRODUCT CREATE ERROR:", error);

    return NextResponse.json({ error: "Ürün oluşturulamadı" }, { status: 500 });
  }
}
