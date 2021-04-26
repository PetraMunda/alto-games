import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
    name: {type: String, required: true, unique: true},
    category: {type: String, required: true},
    image: {type: String, required: true},
    price: {type: Number, required: true},
    countInStock: {type: Number, required: true},
    age: {type: String, required: true},
    players: {type: String, required: true},
    time: {type: String, required: true},
    brand: {type: String, required: true},
    rating: {type: Number, required: true},
    numReviews: {type: Number, required: false},
    description: {type: String, required: true},
    }, 
    {
    timestamps: true,
    }
);

const Product = mongoose.model('Product', productSchema);
export default Product;