import Axios from 'axios';
import { PayPalButton } from 'react-paypal-button-v2';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { deliverOrder, detailsOrder, payOrder, returnOrder } from '../actions/orderActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { ORDER_DELIVER_RESET, ORDER_PAY_RESET, ORDER_RETURN_RESET } from '../constants/orderConstants';


export default function OrderScreen(props) {
    const orderId = props.match.params.id;
    const [sdkReady, setSdkReady] = useState(false);
    const orderDetails = useSelector((state) => state.orderDetails);
    const { order, loading, error } = orderDetails;
    // get info from user for deliver and return item handlers
    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo } = userSignin;
    
    const orderPay = useSelector((state) => state.orderPay);
    const {
      loading: loadingPay,
      error: errorPay,
      success: successPay,
    } = orderPay;

    const orderReturn = useSelector((state) => state.orderReturn);
    const {
      loading: loadingReturn,
      error: errorReturn,
      success: successReturn,
    } = orderReturn;

    const orderDeliver = useSelector((state) => state.orderDeliver);
    const {
      loading: loadingDeliver,
      error: errorDeliver,
      success: successDeliver,
    } = orderDeliver;
    const dispatch = useDispatch();
    
    useEffect(() => {
      const addPayPalScript = async () => {
      const { data } = await Axios.get('/api/config/paypal');
      // create an script element and set the source to paypal sdk
      const script = document.createElement('script');
          script.type = 'text/javascript';
          script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
          script.async = true;
          script.onload = () => {
            setSdkReady(true);
          };
          // running this code the upper script will be added as last
          // child in the html document
    document.body.appendChild(script);
      };

        // PayPal logic
        if (!order || successPay || successDeliver || successReturn || (order && order._id !== orderId )) {
          // before dispatch details order we need to reset order pay
          dispatch({ type: ORDER_PAY_RESET });
          dispatch({ type: ORDER_DELIVER_RESET });
          dispatch({ type: ORDER_RETURN_RESET });

          dispatch(detailsOrder(orderId));
          } else {
            if ( !order.isPaid ) {
              if ( !window.paypal ) {
                addPayPalScript();
              } else {
                setSdkReady(true);
              }
            }
          }
        }, [dispatch, order, orderId, sdkReady, successPay, successDeliver, successReturn]);
      

    const successPaymentHandler = (paymentResult) => {
        // TODO: dispatch pay order
        dispatch(payOrder(order, paymentResult));
    };

    // function for deliver handler
    const deliverHandler = () => {
      dispatch(deliverOrder(order._id));
    };

    // function for return handler
    const returnHandler = () => {
      dispatch(returnOrder(order._id));
    }

    return loading ? (
      <LoadingBox></LoadingBox>
    ) : error ? (
      <MessageBox variant="danger">{error}</MessageBox>
    ) : (
      <div>
        <h1>Order {order._id}</h1>
        <div className="row top">
          <div className="col-2">
            <ul>
              <li>
                <div className="cart cart-body">
                  <h2>Shipping</h2>
                  <p>
                    <strong>Name:</strong> {order.shippingAddress.fullName} <br />
                    <strong>Address: </strong> {order.shippingAddress.address},
                    {order.shippingAddress.city},{' '}
                    {order.shippingAddress.postalCode},
                    {order.shippingAddress.country}
                  </p>
                  {order.isDelivered ? (
                    <MessageBox variant="success">
                      Delivered at {order.deliveredAt}
                    </MessageBox>
                  ) : (
                    <MessageBox variant="danger">Not Delivered</MessageBox>
                  )}
                </div>
              </li>
              <li>
                <div className="cart cart-body">
                  <h2>Payment</h2>
                  <p>
                    <strong>Method:</strong> {order.paymentMethod}
                  </p>
                  {order.isPaid ? (
                    <MessageBox variant="success">
                      Paid at {order.paidAt}
                    </MessageBox>
                  ) : (
                    <MessageBox variant="danger">Not Paid</MessageBox>
                  )}
                </div>
              </li>
              
              <li>
                <div className="cart cart-body">
                  <h2>Item returned</h2>
                  
                  {order.isReturned ? (
                    <MessageBox variant="success">
                      Returned {order.returnedAt}
                    </MessageBox>
                  ) : (
                    <MessageBox variant="danger">Not Returned</MessageBox>
                  )}
                </div>
              </li>

              <li>
                <div className="cart cart-body">
                  <h2>Order Items</h2>
                  <ul>
                    {order.orderItems.map((item) => (
                      <li key={item.product}>
                        <div className="row">
                          <div>
                            <img
                              src={item.image}
                              alt={item.name}
                              className="small"
                            ></img>
                          </div>
                          <div className="min-30">
                            <Link to={`/product/${item.product}`}>
                              {item.name}
                            </Link>
                          </div>
  
                          <div>
                            {item.qty} x ${item.price} = ${item.qty * item.price}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            </ul>
          </div>
          <div className="col-1">
            <div className="cart cart-body">
              <ul>
                <li>
                  <h2>Order Summary</h2>
                </li>
                <li>
                  <div className="row">
                    <div>Items</div>
                    <div>${order.itemsPrice.toFixed(2)}</div>
                  </div>
                </li>
                <li>
                  <div className="row">
                    <div>Shipping</div>
                    <div>${order.shippingPrice.toFixed(2)}</div>
                  </div>
                </li>
                <li>
                  <div className="row">
                    <div>Tax</div>
                    <div>${order.taxPrice.toFixed(2)}</div>
                  </div>
                </li>
                <li>
                  <div className="row">
                    <div>
                      <strong> Order Total</strong>
                    </div>
                    <div>
                      <strong>${order.totalPrice.toFixed(2)}</strong>
                    </div>
                  </div>
                </li>

                {!order.isPaid && (
                <li>
                  {!sdkReady ? (
                    <LoadingBox></LoadingBox>
                  ) : (
                    <>
                      {errorPay && (
                        <MessageBox variant="danger">{errorPay}</MessageBox>
                      )}
                      {loadingPay && <LoadingBox></LoadingBox>}

                      <PayPalButton
                        amount={order.totalPrice}
                        onSuccess={successPaymentHandler}
                      ></PayPalButton>
                    </>
                  )}
                    </li>
                  )}

               
                   {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                    <li>
                      {loadingDeliver && <LoadingBox></LoadingBox>}
                      {errorDeliver && (
                        <MessageBox variant="danger">{errorDeliver}</MessageBox>
                      )}
                      <button
                        type="button"
                        className="primary block"
                        onClick={deliverHandler}
                      >
                        Deliver Order
                      </button>
                    </li>
                  )}

                  
                    {userInfo.isAdmin && order.isPaid &&
                    order.isDelivered && !order.isReturned && (
                      <li>
                        {loadingReturn && <LoadingBox></LoadingBox>}
                        {errorReturn && (
                        <MessageBox variant="danger">{errorReturn}</MessageBox>
                      )}
                          <button type="button"
                            className="primary block"
                            onClick={returnHandler}

                          >Return</button>
                      </li>
                    )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
  