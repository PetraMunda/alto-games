import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../actions/cartActions';
//import { productDetailsReducer } from '../reducers/productReducers';

export default function CartScreen(props) {
    const productId = props.match.params.id;
    const qty = props.location.search
    ? Number(props.location.search.split('=')[1])
    : 1;

    const dispatch = useDispatch();
    useEffect(() => {
        if(productId) {
            dispatch(addToCart(productId, qty));
        }
    }, [dispatch, productId, qty]);

    return (
        <div>
            <h1>Cart screen</h1>
            <p>
                ADD TO CART : ProductId: {productId} Qty: {qty}
            </p>
        </div>
    );
}
