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

// new api to apply product edit changes
productRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async(req, res) => {
  const productId = req.params.id;
  // get data from database
  const product = await Product.findById(productId);
    if(product) {
      product.name = req.body.name;
      product.category = req.body.category;
      product.image = req.body.image;
      product.price = req.body.price;
      product.countInStock = req.body.countInStock;
      product.age = req.body.age;
      product.players = req.body.players;
      product.time = req.body.time;
      product.brand = req.body.brand;
      product.description = req.body.description;

      const updatedProduct = await product.save();
      res.send({message: 'Product Updated', product: updatedProduct});
    } else {
      res.status(404).send({message: 'Product not found'});
    }
  })
);

// router for deleting products
productRouter.delete('/:id', isAuth, isAdmin, expressAsyncHandler(async(req, res) => {
  const product = await Product.findById(req.params.id);
  if(product) {
    const deleteProduct = await product.remove();
    res.send({message: 'Product Deleted!', product: deleteProduct});
  } else {
    res.status(404).send({ message: 'Product not found' });
    }
  })
);


export default productRouter;