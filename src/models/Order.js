import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    items: [
      {
        productId: String,
        title: String,
        price: Number,
        quantity: Number,
      },
    ],

    total: Number,

    orderCode: {
      type: String,
      unique: true,
    },

    customer: {
      userId: String,
      name: String,
      email: String,
      address: String,
      phone: String,
    },
    orderCode: {
      type: String,
      unique: true,
    },

    payment: {
      provider: String,
      paymentId: String,
      conversationId: String,
    },

    status: {
      type: String,
      default: "hazırlanıyor",
    },
  },
  { timestamps: true },
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
