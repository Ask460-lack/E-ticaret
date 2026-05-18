import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { createIyzicoAuthHeader } from "@/lib/iyzicoAuth";

function createOrderCode() {
  return "ORD-" + Math.random().toString(36).substring(2, 8).toUpperCase();
}

function formatPrice(value) {
  return Number(value).toFixed(2);
}

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { items, customer, card } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Sepet boş" }, { status: 400 });
    }

    if (
      !customer?.name ||
      !customer?.email ||
      !customer?.address ||
      !customer?.phone
    ) {
      return NextResponse.json(
        { error: "Müşteri bilgileri eksik" },
        { status: 400 },
      );
    }

    if (
      !card?.cardHolderName ||
      !card?.cardNumber ||
      !card?.expireMonth ||
      !card?.expireYear ||
      !card?.cvc
    ) {
      return NextResponse.json(
        { error: "Kart bilgileri eksik" },
        { status: 400 },
      );
    }

    let total = 0;
    const secureItems = [];

    for (const item of items) {
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

      const itemTotal = product.price * quantity;
      total += itemTotal;

      secureItems.push({
        productId: product._id.toString(),
        title: product.title,
        price: product.price,
        quantity,
      });
    }

    const orderCode = createOrderCode();

    const paymentBody = {
      locale: "tr",
      conversationId: orderCode,
      price: formatPrice(total),
      paidPrice: formatPrice(total),
      currency: "TRY",
      installment: 1,
      basketId: orderCode,
      paymentChannel: "WEB",
      paymentGroup: "PRODUCT",

      paymentCard: {
        cardHolderName: card.cardHolderName,
        cardNumber: card.cardNumber.replace(/\s/g, ""),
        expireMonth: card.expireMonth,
        expireYear: card.expireYear,
        cvc: card.cvc,
        registerCard: 0,
      },

      buyer: {
        id: customer.userId || "guest",
        name: customer.name,
        surname: customer.name,
        gsmNumber: customer.phone,
        email: customer.email,
        identityNumber: "11111111111",
        lastLoginDate: "2026-05-15 12:00:00",
        registrationDate: "2026-05-15 12:00:00",
        registrationAddress: customer.address,
        ip: "85.34.78.112",
        city: "Istanbul",
        country: "Turkey",
        zipCode: "34000",
      },

      shippingAddress: {
        contactName: customer.name,
        city: "Istanbul",
        country: "Turkey",
        address: customer.address,
        zipCode: "34000",
      },

      billingAddress: {
        contactName: customer.name,
        city: "Istanbul",
        country: "Turkey",
        address: customer.address,
        zipCode: "34000",
      },

      basketItems: secureItems.map((item) => ({
        id: item.productId,
        name: item.title,
        category1: "Ürün",
        itemType: "PHYSICAL",
        price: formatPrice(item.price * item.quantity),
      })),
    };

    const uriPath = "/payment/auth";
    const randomKey = Date.now().toString();

    const authorization = createIyzicoAuthHeader({
      apiKey: process.env.IYZICO_API_KEY,
      secretKey: process.env.IYZICO_SECRET_KEY,
      randomKey,
      uri: uriPath,
      body: paymentBody,
    });

    const paymentResult = {
      status: "success",
      paymentId: "MOCK-" + Date.now(),
      conversationId: orderCode,
    };

    const order = await Order.create({
      items: secureItems,
      total,
      orderCode,
      customer,
      status: "ödeme alındı",
      payment: {
        provider: "iyzico",
        paymentId: paymentResult.paymentId,
        conversationId: paymentResult.conversationId,
      },
    });

    return NextResponse.json({
      message: "Ödeme başarılı",
      order: JSON.parse(JSON.stringify(order)),
    });
  } catch (error) {
    console.log("PAYMENT ERROR:", error);

    return NextResponse.json(
      { error: "Ödeme işlemi başarısız" },
      { status: 500 },
    );
  }
}
