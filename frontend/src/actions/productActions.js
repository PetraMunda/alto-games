import axios from "axios";
import { PRODUCT_LIST_FAIL, PRODUCT_LIST_REQUEST, PRODUCT_LIST_SUCCESS } from "../constants/productConstants"

// define action
export const listProducts = () => async (dispatch) => {
    dispatch({
        type: PRODUCT_LIST_REQUEST
    });
    try {
      // getting data from backend
      const { data } = await axios.get('/api/products');
      dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data });
    } catch(error){
      dispatch({ type: PRODUCT_LIST_FAIL, payload: error.message });
    }
}