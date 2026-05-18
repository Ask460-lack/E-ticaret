import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const products = await Product.find({}, { category: 1 });

    const categories = [
      ...new Set(products.map((p) => p.category?.trim()).filter(Boolean)),
    ];

    return NextResponse.json(categories, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Kategoriler getirilemedi" },
      { status: 500 },
    );
  }
}
