// Redux store
// define initial state and a reducer and create redux store
// returns a list of products in data.js in frontend

import { createStore, compose, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { cartReducer } from './reducers/cartReducers';
import { productDetailsReducer, productListReducer } from './reducers/productReducers';
import { userSigninReducer } from './reducers/userReducer';

const initialState = {
    userSignin: {
        userInfo: localStorage.getItem('userInfo')
          ? JSON.parse(localStorage.getItem('userInfo'))
          : null,
    },
    cart: {
        cartItems: localStorage.getItem('cartItems')
        ? JSON.parse(localStorage.getItem('cartItems'))
        // if it does not exist, use an empty array
        : [],
    }
};
const reducer = combineReducers({
    productList: productListReducer,
    productDetails: productDetailsReducer,
    cart: cartReducer,
    userSignin: userSigninReducer,
});


const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ||compose;

const store = createStore(
    reducer,
    initialState,
    composeEnhancer(applyMiddleware(thunk)));

export default store;