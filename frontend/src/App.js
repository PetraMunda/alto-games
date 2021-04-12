import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Product from './components/Product';
import data from './data';


function App() {
  return (
  <BrowserRouter>
    <div className="grid-container">
            <header className="row">
                <div>
                    <a className="brand" href="/">Alto Games</a>
                </div>
                <div>
                    <a href="/demo">Demo game</a>
                    <a href="/cart">Cart</a>
                    <a href="/signin">Sign In</a>
                </div>
            </header>
            <main>
            <div>

              <div className="row center">{
                  data.products.map((product) => (
                    <Product key={product._id} product={product}></Product>
                ))}
              </div>
            </div>

            </main>
            <footer className="row center" >All Rights reserved by Petra Munda</footer>
        </div>
        </BrowserRouter>
  );
}

export default App;
