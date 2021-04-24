import { CART_ADD_ITEM, CART_REMOVE_ITEM } from "../constants/cartConstants";

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
            // filtering out the product which id is equal to action.payload
            // payload is set to product that we will delite
            case CART_REMOVE_ITEM:
                return {...state,
                    cartItems: state.cartItems.filter( x => x.product !== action.payload)};
        default:
            return state;
    }
}