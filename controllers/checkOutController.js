const Order = require('../modules/order');

const createOrder = async (req, res) => {
  try {
    const { user, products, subtotal, total, phoneNumber, streetAddress, state, zip, size, color, email, name,quantity,img } = req.body;

    const newOrder = new Order({
      user,
      products,
      subtotal,
      total,
      phoneNumber,
      streetAddress,
      state,
      zip,
      size,
      color,
      email,
      name,
      quantity,
      img
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('products');
    
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error retrieving orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Export the controller function
module.exports = { createOrder,getAllOrders };
