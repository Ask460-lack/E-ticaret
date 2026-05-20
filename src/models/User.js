import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: String,
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    email: {
      type: String,
      unique: true,
    },

    password: String,

    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true },
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
