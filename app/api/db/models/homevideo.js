import mongoose from "mongoose";

const HomeVideoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    img: {
      type: String,
      required: [true, "Image path is required"],
      trim: true,
    },
    cloudinary_id: {
      type: String,
      trim: true,
    },
    url: {
      type: String,
      required: [true, "Video URL is required"],
      trim: true,
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

export default mongoose.models.HomeVideo ||
  mongoose.model("HomeVideo", HomeVideoSchema);
