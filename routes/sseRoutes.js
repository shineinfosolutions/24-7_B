import express from "express";
import orderModel from "../models/ordermodel.js";

const sseRouter = express.Router();

// Store active SSE connections
let sseClients = [];

// SSE endpoint for real-time order updates
sseRouter.get('/orders', async (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });

  // Add client to active connections
  const clientId = Date.now();
  const newClient = { id: clientId, res };
  sseClients.push(newClient);

  // Send initial data
  try {
    const orders = await orderModel.find().populate('customer_id').sort({ createdAt: -1 });
    res.write(`data: ${JSON.stringify({ type: 'initial', orders })}\n\n`);
  } catch (error) {
    res.write(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`);
  }

  // Clean up on client disconnect
  req.on('close', () => {
    sseClients = sseClients.filter(client => client.id !== clientId);
  });
});

// Function to broadcast order updates to all connected clients
export const broadcastOrderUpdate = async (orderData) => {
  if (sseClients.length > 0) {
    try {
      const orders = await orderModel.find().populate('customer_id').sort({ createdAt: -1 });
      const message = `data: ${JSON.stringify({ type: 'update', orders, newOrder: orderData })}\n\n`;
      
      sseClients.forEach(client => {
        try {
          client.res.write(message);
        } catch (error) {
          console.log('Error sending SSE message:', error);
        }
      });
    } catch (error) {
      console.log('Error broadcasting order update:', error);
    }
  }
};

export default sseRouter;