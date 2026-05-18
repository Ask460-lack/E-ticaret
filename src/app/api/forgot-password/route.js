import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { transporter } from "@/lib/mail";
import { NextResponse } from "next/server";

function createTempPassword() {
  return Math.random().toString(36).slice(-8) + "A1!";
}

export async function POST(req) {
  try {
    await connectDB();

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email gerekli" }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "Bu email ile kullanıcı bulunamadı" },
        { status: 404 },
      );
    }

    const newPassword = createTempPassword();
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    await transporter.sendMail({
      from: `"E-Ticaret" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Yeni Şifreniz",
      html: `
        <h2>Yeni Şifreniz</h2>
        <p>Geçici yeni şifreniz:</p>
        <h3>${newPassword}</h3>
        <p>Giriş yaptıktan sonra şifrenizi değiştirmeniz önerilir.</p>
      `,
    });

    return NextResponse.json({
      message: "Yeni şifre mail adresinize gönderildi",
    });
  } catch (error) {
    console.log("FORGOT PASSWORD ERROR MESSAGE:", error.message);
    console.log("FORGOT PASSWORD ERROR:", error);

    return NextResponse.json(
      { error: error.message || "Şifre sıfırlama işlemi başarısız" },
      { status: 500 },
    );
  }
}
