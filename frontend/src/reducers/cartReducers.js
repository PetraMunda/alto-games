import { CART_ADD_ITEM } from "../constants/cartConstants";

export const cartReducer = (state = { cartItems:[] }, action) => {
    switch(action.type) {
        case CART_ADD_ITEM:
            const item = action.payload;
            // compares the current that is gonna be added product id with the id of items in the cart item
            const existItem = state.cartItems.find(x => x.product === item.product); 
            if(existItem){
               return {
                   ...state,
                   // only update item that already exists
                   cartItems: state.cartItems.map( x =>
                    x.product === existItem.product? item: x
                    ),
               };
            } else{
                // adding new item on the end of cart items
                return { ...state, cartItems: [...state.cartItems, item]};
            }
        default:
            return state;
    }
}