import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    default: 'percentage',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  instagramId: {
    type: String,
    required: false,
  },
  bankDetails: {
    accountNumber: {
      type: String,
      required: false,
    },
    ifscCode: {
      type: String,
      required: false,
    }
  }
});

// Check if the model is already defined to prevent overwriting
const Coupon = mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);

export default Coupon;
