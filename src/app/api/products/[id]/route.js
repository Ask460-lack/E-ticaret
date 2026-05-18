import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
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

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        title: body.title,
        description: body.description,
        price: Number(body.price),
        images: body.images,
        category: body.category.trim(),
        stock: Number(body.stock),
      },
      { new: true },
    );

    return NextResponse.json(JSON.parse(JSON.stringify(updatedProduct)));
  } catch (error) {
    return NextResponse.json({ error: "Ürün güncellenemedi" }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  try {
    const admin = await requireAdmin();

    if (!admin) {
      return NextResponse.json({ error: "Yetkisiz işlem" }, { status: 403 });
    }

    await connectDB();

    const { id } = await context.params;

    await Product.findByIdAndDelete(id);

    return NextResponse.json({
      message: "Ürün silindi",
    });
  } catch (error) {
    return NextResponse.json({ error: "Ürün silinemedi" }, { status: 500 });
  }
}
