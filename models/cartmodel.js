import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  items: [{
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'items', required: true },
    quantity: { type: Number, default: 1 },
    variation: { type: mongoose.Schema.Types.ObjectId, ref: 'variations' },
    addons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'addon' }]
  }]
}, {
  timestamps: true
});

const cartModel = mongoose.model('cart', cartSchema);
export default cartModel;