import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import { isAuth } from '../utils.js';

// define order router equal to express router to
// create API for post requests to /api/orders
const orderRouter = express.Router();

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

export default orderRouter;