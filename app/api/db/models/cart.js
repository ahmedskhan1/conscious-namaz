import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: false,
  },
  city: {
    type: String,
    required: false,
  },
  coupon: {
    type: String,
    required: false,
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  items: [
    {
      programId: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1
      }
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on each save
cartSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Check if the model is already defined to prevent overwriting
const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);

export default Cart;
