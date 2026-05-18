import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await Order.find({
    "customer.userId": session.user.id,
  }).sort({
    createdAt: -1,
  });

  return NextResponse.json(JSON.parse(JSON.stringify(orders)));
}
