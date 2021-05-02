import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteOrder, listOrders } from '../actions/orderActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { ORDER_DELETE_RESET } from '../constants/orderConstants';

export default function OrderListScreen(props) {
    const orderList = useSelector((state) => state.orderList);
    const { loading, error, orders } = orderList;
    // after deleting an order we need to refresh the order list
    // we need to run dispatch(listOrders()); again
    // so we need to get success delete from redux store and put as a dependency
    // inside the dependency list in use effect
    const orderDelete = useSelector((state) => state.orderDelete);
    const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = orderDelete;
    
    const dispatch = useDispatch();
    
    useEffect(() => {
       // reset the delete order to delete a second order, bcs. after
       // deleting the first one the success is already true
       dispatch({type: ORDER_DELETE_RESET});
       dispatch(listOrders());
    }, [dispatch, successDelete]);

    const deleteHandler = (order) => {
        // TODO: delete handler
        if(window.confirm('Are you sure to delete?')) {
          dispatch(deleteOrder(order._id));
        }
    };

    return (
    <div>
            <div>
            <h1>Orders</h1>
            {loadingDelete && <LoadingBox></LoadingBox>}
            {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}

            {
            loading ? <LoadingBox></LoadingBox>:
            error ? <MessageBox variant="danger">{error}</MessageBox>
            : 
            (
                <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>ORDERING DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user.name}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.totalPrice.toFixed(2)} €</td>
                <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'No'}</td>
                <td>
                  {order.isDelivered
                    ? order.deliveredAt.substring(0, 10)
                    : 'No'}
                </td>
                <td>
                  <button
                    type="button"
                    className="small"
                    onClick={() => {
                      props.history.push(`/order/${order._id}`);
                    }}
                  >
                    Details
                  </button>
                  <button
                    type="button"
                    className="small"
                    onClick={() => deleteHandler(order)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
        </div>
    </div>
    )
}
