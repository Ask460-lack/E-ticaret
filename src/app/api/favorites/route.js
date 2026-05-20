import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Product from "@/models/Product";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  await connectDB();

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return Response.json({ error: "Yetkisiz işlem" }, { status: 401 });
  }

  const user = await User.findOne({ email: session.user.email }).populate(
    "favorites",
  );

  return Response.json(user?.favorites || []);
}

export async function POST(req) {
  await connectDB();

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return Response.json({ error: "Yetkisiz işlem" }, { status: 401 });
  }

  const { productId } = await req.json();

  const product = await Product.findById(productId);

  if (!product) {
    return Response.json({ error: "Ürün bulunamadı" }, { status: 404 });
  }

  const user = await User.findOne({ email: session.user.email });

  const alreadyFavorite = user.favorites.some(
    (id) => id.toString() === productId,
  );

  if (alreadyFavorite) {
    user.favorites = user.favorites.filter((id) => id.toString() !== productId);
  } else {
    user.favorites.push(productId);
  }

  await user.save();

  return Response.json({
    success: true,
    isFavorite: !alreadyFavorite,
  });
}
