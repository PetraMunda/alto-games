import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import data from '../data.js';
import Product from '../models/productModel.js';
import { isAdmin, isAuth } from '../utils.js';

const productRouter = express.Router();

productRouter.get('/',
  expressAsyncHandler(async (req, res) => {
  // get list of product, empty find function returns all products
  const products = await Product.find({});
  res.send(products);
  })
);

productRouter.get(
    '/seed',
    expressAsyncHandler(async (req, res) => {
      // await Product.remove({});
      const createdProducts = await Product.insertMany(data.products);
      res.send({ createdProducts });
    })
  );


// have to be last otherwise /seed will be threated as ID 
productRouter.get('/:id', expressAsyncHandler(async (req, res) => {
  // find id returns promise, by using await it is converted
  // to real data and set to product
  const product =  await Product.findById(req.params.id);
  // in this case we need a condition
  if(product){
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product not found'});
  }
})
);

// creating new product router
productRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = new Product({
      name: 'sample name ' + Date.now(),
      category: 'simple category',
      image: '/images/p1.jpg',
      price: 0,
      countInStock: 0,
      age: 'age',
      players: 'some number',
      time: 'some time',
      brand: 'sample brand',
      rating: 0,
      numReviews: 0,
      description: 'sample description',

    });
    const createdProduct = await product.save();
    // saving and passing the created product to frontend 
    res.send({ message: 'Product Created', product: createdProduct});
  })
);

export default productRouter;