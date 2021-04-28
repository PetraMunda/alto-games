import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { savePaymentMethod } from '../actions/cartActions';
import CheckouSteps from '../components/CheckoutSteps';

export default function PaymentMethodScreen(props) {
    // if not entered shipping information redirect user to ShippingAddressScreen
    const cart = useSelector((state) => state.cart);
    const { shippingAddress } = cart;
    if(!shippingAddress.address) {
        props.history.push('/shipping');    }
    //react hook for payment method
    const [paymentMethod, setPaymentMethod] = useState('PayPal'); 
    const dispatch = useDispatch();
    // implement submit handler
    const submitHandler = (e) => {
        // we do not refresh teh page when the user click on continue
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod));
        props.history.push('/placeorder');
    }

    return (
        <div>
            <CheckouSteps step1 step2 step3></CheckouSteps>
            <form className="form" onSubmit={submitHandler}>
                <div>
                    <h1>Payment Method</h1>
                </div>
                <div>
                    <div>
                        <input
                            type="radio"
                            id="paypal"
                            value="PayPal"
                            name="paymentMethod"
                            required
                            checked
                            onChange={(e) => setPaymentMethod(e.target.value) }
                            ></input>
                            <label htmlFor="paypal">PayPal</label>
                    </div>
                </div>
                <div>
                    <div>
                        <input
                            type="radio"
                            id="stripe"
                            value="Stripe"
                            name="paymentMethod"
                            required
                            onChange={(e) => setPaymentMethod(e.target.value) }
                            ></input>
                            <label htmlFor="stripe">Stripe</label>
                    </div>
                </div>
                <div>
                    <button className="primary" type="submit">Continue</button>
                </div>
            </form>
        </div>
    )
}
