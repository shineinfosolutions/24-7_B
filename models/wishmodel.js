import mongoose from "mongoose";

const wishSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'items',
    required: true
  }]
}, { timestamps: true });

const wishmodel = mongoose.model('wishlist', wishSchema);

export default wishmodel;
