import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { detailsProduct } from '../actions/productActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

export default function ProductEditScree(props) {
    // get product id from the url
    const productId = props.match.params.id;
    // defining hooks for product fields
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState('');
    const [price, setPrice] = useState('');
    const [countInStock, setCountInStock] = useState('');
    const [age, setAge] = useState('');
    const [players, setPlayers] = useState('');
    const [time, setTime] = useState('');
    const [brand, setBrand] = useState('');
    const [description, setDescription] = useState('');
    
    const productDetails = useSelector(state => state.productDetails);
    const { loading, error, product } = productDetails;
    const dispatch = useDispatch();
    
    useEffect(() => {
        if(!product || (product._id !== productId)) {
           dispatch(detailsProduct(productId)); 
        } else {
            setName(product.name);
            setCategory(product.category);
            setImage(product.image);
            setPrice(product.price);
            setCountInStock(product.countInStock);
            setAge(product.age);
            setPlayers(product.players);
            setTime(product.time);
            setBrand(product.brand);
            setDescription(product.description);
        }
    // when there is a change in each of this variables, the function runs again
    }, [product, dispatch, productId,]);

    const submitHandler = (e) => {
        e.preventDefault();
        // TODO: dispatch update product
    }
    return (
        <div>
            <form className="form" onSubmit={submitHandler}>
                <div>
                    <h1>Edit Product: {productId}</h1>
                </div>
                {loading ? <LoadingBox></LoadingBox>
                :
                error ? <MessageBox></MessageBox>
                :
                <>
                    <div>
                        <label htmlFor="name"><b>Name</b></label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Enter name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}></input>
                    </div>
                    <div>
                        <label htmlFor="category"><b>Category</b></label>
                        <input
                            id="category"
                            type="text"
                            placeholder="Enter category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}></input>
                    </div>
                    <div>
                        <label htmlFor="image"><b>Image</b></label>
                        <input
                            id="image"
                            type="text"
                            placeholder="Enter image"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}></input>
                    </div>
                    <div>
                        <label htmlFor="price"><b>Price</b></label>
                        <input
                            id="price"
                            type="number"
                            placeholder="Enter price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}></input>
                    </div>
                    <div>
                        <label htmlFor="countInStock"><b>In stock</b></label>
                        <input
                            id="countInStock"
                            type="number"
                            placeholder="Enter number in stock"
                            value={countInStock}
                            onChange={(e) => setCountInStock(e.target.value)}></input>
                    </div>
                    <div>
                        <label htmlFor="age"><b>Age</b></label>
                        <input
                            id="age"
                            type="text"
                            placeholder="Enter age"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}></input>
                    </div>
                    <div>
                        <label htmlFor="players"><b>Players</b></label>
                        <input
                            id="players"
                            type="text"
                            placeholder="Enter number of players"
                            value={players}
                            onChange={(e) => setPlayers(e.target.value)}></input>
                    </div>
                    <div>
                        <label htmlFor="time"><b>Time</b></label>
                        <input
                            id="time"
                            type="text"
                            placeholder="Enter playing time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}></input>
                    </div>
                    <div>
                        <label htmlFor="brand"><b>Brand</b></label>
                        <input
                            id="brand"
                            type="text"
                            placeholder="Enter Brand"
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}></input>
                    </div>
                    <div>
                        <label htmlFor="description"><b>Description</b></label>
                        <textarea
                            id="description"
                            rows="3"
                            type="text"
                            placeholder="Enter description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}></textarea>
                    </div>
                    <div>
                        <label></label>
                        <button className="primary" type="submit">
                            Update
                        </button>
                    </div>

                </>
                }
            </form>
        </div>
    )
}
