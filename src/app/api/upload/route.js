import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";

export async function POST(req) {
  try {
    const admin = await requireAdmin();

    if (!admin) {
      return NextResponse.json({ error: "Yetkisiz işlem" }, { status: 403 });
    }

    const formData = await req.formData();
    const files = formData.getAll("files");

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 });
    }

    const uploadedImages = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "ecommerce-products",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            },
          )
          .end(buffer);
      });

      uploadedImages.push(result.secure_url);
    }

    return NextResponse.json({
      images: uploadedImages,
    });
  } catch (error) {
    console.log("UPLOAD ERROR:", error);

    return NextResponse.json({ error: "Görsel yüklenemedi" }, { status: 500 });
  }
}
