import mongoose from "mongoose";

const BannerSettingsSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, "Banner description is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      default: 1999,
    },
    originalPrice: {
      type: Number,
      required: [true, "Original price is required"],
      default: 2999,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.BannerSettings ||
  mongoose.model("BannerSettings", BannerSettingsSchema); 