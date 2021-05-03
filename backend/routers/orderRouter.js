import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import { isAdmin, isAuth } from '../utils.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';

// define order router equal to express router to
const orderRouter = express.Router();

// api for displaying order list to admins
orderRouter.get('/', isAuth, isAdmin, expressAsyncHandler(async(req, res) => {
  // in populate  get from user only name4                                                                      
  const orders = await Order.find({}).populate('user', 'name');
  res.send(orders);
}))

// api for mine orders ( orders of the current user _id )
orderRouter.get('/mine', isAuth, expressAsyncHandler(async(req, res) => {
  const orders = await Order.find({user: req.user._id});
  res.send(orders);
  })
);

// create API for post requests to /api/orders
orderRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
     // check if order item contains item or not
    if (req.body.orderItems.length === 0) {
      res.status(400).send({ message: 'Cart is empty' });
    } else {
      const order = new Order({
        // for order model as a parameter we set order items equal to
        // the items that the user passed as a body of this request
        orderItems: req.body.orderItems,
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        itemsPrice: req.body.itemsPrice,
        shippingPrice: req.body.shippingPrice,
        taxPrice: req.body.taxPrice,
        totalPrice: req.body.totalPrice,
        user: req.user._id,
      });
      const createdOrder = await order.save();
      res
        .status(201)
        .send({ message: 'New Order Created', order: createdOrder });
    }
  })
);

// route for summary backup
orderRouter.get('/summary', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
    // create query with agregate function
    // capital Order access to the model
    const orders = await Order.aggregate([
      {
        $group: {
          _id: null, numOrders: { $sum: 1 },
          totalSales: { $sum: '$totalPrice' }
        },
      },
    ]);
    const users = await User.aggregate([
      {
        $group: {
          _id: null, numUsers: { $sum: 1 },
        },
      },
    ]);
    const dailyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          orders: { $sum: 1 },
          sales: { $sum: '$totalPrice' },
        },
      },
    ]);
    const productCategories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);
    res.send({ users, orders, dailyOrders, productCategories });
  })
);


// only authenticated user can see order details
orderRouter.get('/:id', isAuth,expressAsyncHandler(async(req, res) => {
  const order = await Order.findById(req.params.id) // --> req.params.id = :/id value from user
  if(order) {
    res.send(order);
  } else {
    res.status(404).send({message: 'Order not found'});
   }
  })
);

// api for paid order - only signed in users
orderRouter.put('/:id/pay', isAuth, expressAsyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if(order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
      };
      // after changing the order we have to save it
      const updatedOrder = await order.save();
      res.send({message: 'Order Paid', order: updatedOrder});
    } else {
      res.status(404).send({ message: 'Order not found' });
    }
  })
);

// creating a delete route for deleting orders
orderRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      const deleteOrder = await order.remove();
      res.send({ message: 'Order Deleted', order: deleteOrder });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

// api for order delivered - only signed in users
orderRouter.put('/:id/deliver', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if(order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    
      // after changing the order we have to save it
      const updatedOrder = await order.save();
      res.send({message: 'Order Delivered', order: updatedOrder});
    } else {
      res.status(404).send({ message: 'Order not found' });
    }
  })
);


// api for ordered item returned - only signed in users
orderRouter.put('/:id/return', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if(order) {
    order.isReturned = true;
    order.returnedAt = Date.now();
    
      // after changing the order we have to save it
      const updatedOrder = await order.save();
      res.send({message: 'Item Returned', order: updatedOrder});
    } else {
      res.status(404).send({ message: 'Order not found' });
    }
  })
);

export default orderRouter;