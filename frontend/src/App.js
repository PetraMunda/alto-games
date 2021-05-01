import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Link, Route } from 'react-router-dom';
import { signout } from './actions/userActions';
import CartScreen from './screens/CartScreen';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import SigninScreen from './screens/SigninScreen';
import AboutScreen from './screens/AboutScreen';
import RegisterScreen from './screens/RegisterScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';


function App() {

  // get cart from redux store
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  // get signin from redux store
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const dispatch = useDispatch();
  const signoutHandler = () => {
    dispatch(signout());
  };

  return (
  <BrowserRouter>
    <div className="grid-container">
            <header className="row">
                <div>
                    <Link className="brand" to="/">Alto Games</Link>
                </div>
                <div>
                    <Link to="/about">About</Link>
                    <Link to="/demo">Demo game</Link>
                    <Link to="/cart">Cart
                      {cartItems.length > 0 && (
                        <span className="badge">{cartItems.length}</span>
                      )}
                    </Link>
                    
                    {
                      userInfo ? (
                        <div className="dropdown">
                        <Link to="#">{userInfo.name} <i className="fa fa-caret-down"></i>
                        </Link>
                        <ul className="dropdown-content">
                        <li>
                            <Link to="/orderhistory">Order History</Link>
                          </li>
                          <li>
                            <Link to="#signout" onClick={signoutHandler}>Sign Out</Link>
                          </li>
                        </ul>
                        </div>
                      ) :
                      (
                        <Link to="/signin">Sign In</Link>
                      )
                    }

                    
                </div>
            </header>
            <main>
              <Route path="/cart/:id?" component={CartScreen}></Route>
              <Route path="/product/:id" component={ProductScreen}></Route>
              <Route path="/about" component={AboutScreen} exact></Route>
              <Route path="/signin" component={SigninScreen}></Route>
              <Route path="/register" component={RegisterScreen}></Route>
              <Route path="/shipping" component={ShippingAddressScreen}></Route>
              <Route path="/payment" component={PaymentMethodScreen}></Route>
              <Route path="/placeorder" component={PlaceOrderScreen}></Route>
              <Route path="/order/:id" component={OrderScreen}></Route>
              <Route path="/orderhistory" component={OrderHistoryScreen}></Route>
              <Route path="/" component={HomeScreen} exact></Route>
            </main>
            <footer className="row center" >
            <p>Created by Petra Munda</p></footer>
        </div>
        </BrowserRouter>
  );
}

export default App;
