import React from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Link, Route } from 'react-router-dom';
import CartScreen from './screens/CartScreen';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import SigninScreen from './screens/SigninScreen';
import AboutScreen from './screens/AboutScreen';




function App() {

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

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
                    <Link to="/signin">Sign In</Link>
                </div>
            </header>
            <main>
              <Route path="/cart/:id?" component={CartScreen}></Route>
              <Route path="/product/:id" component={ProductScreen}></Route>
              <Route path="/" component={HomeScreen} exact></Route>
              <Route path="/about" component={AboutScreen} exact></Route>
              <Route path="/signin" component={SigninScreen}></Route>
            </main>
            <footer className="row center" >
            <p>Created by Petra Munda</p></footer>
        </div>
        </BrowserRouter>
  );
}

export default App;
