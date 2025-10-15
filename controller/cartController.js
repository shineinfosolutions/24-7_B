// import cartModel from "../models/cartmodel.js";

// export const addToCart = async (req, res) => {
//   try {
//     const { userId, itemId, quantity = 1, variation, addons } = req.body;
    
//     let cart = await cartModel.findOne({ user: userId });
    
//     if (!cart) {
//       cart = await cartModel.create({
//         user: userId,
//         items: [{ item: itemId, quantity, variation, addons }]
//       });
//     } else {
//       const existingItem = cart.items.find(item => item.item.toString() === itemId);
//       if (existingItem) {
//         existingItem.quantity += quantity;
//       } else {
//         cart.items.push({ item: itemId, quantity, variation, addons });
//       }
//       await cart.save();
//     }
    
//     res.json({ success: true, message: "Item added to cart", cart });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };

// export const getCart = async (req, res) => {
//   try {
//     const { userId } = req.body;
//     const cart = await cartModel.findOne({ user: userId }).populate('items.item');
    
//     if (!cart) {
//       return res.json({ success: true, items: [] });
//     }
    
//     res.json({ success: true, items: cart.items });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };

// export const removeFromCart = async (req, res) => {
//   try {
//     const { userId, itemId } = req.body;
//     const cart = await cartModel.findOne({ user: userId });
    
//     if (!cart) {
//       return res.json({ success: false, message: "Cart not found" });
//     }
    
//     cart.items = cart.items.filter(item => item.item.toString() !== itemId);
//     await cart.save();
    
//     res.json({ success: true, message: "Item removed from cart" });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };

// export const updateCartQuantity = async (req, res) => {
//   try {
//     const { userId, itemId, quantity } = req.body;
//     const cart = await cartModel.findOne({ user: userId });
    
//     if (!cart) {
//       return res.json({ success: false, message: "Cart not found" });
//     }
    
//     const item = cart.items.find(item => item.item.toString() === itemId);
//     if (item) {
//       item.quantity = quantity;
//       await cart.save();
//     }
    
//     res.json({ success: true, message: "Cart updated" });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };