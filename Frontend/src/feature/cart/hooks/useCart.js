import { addItem, getCart, incrementCartItem, decrementCartItem } from "../service/cart.api";
import { setItem, addItem as addItemToCart, incrementCartItemInState, decrementCartItemInState } from "../state/cart.slice";
import { useDispatch } from "react-redux";


export const useCart = ()=>{
    const dispatch = useDispatch()

    const handleAddItem = async ({productId, variantId})=>{
        const data = await addItem({productId, variantId})
        return data
    }

    const handleGetCart = async ()=>{
        const data = await getCart()
        dispatch(setItem(data.cart))
        return data.cart
    }

    const handleIncrementCartItem = async ({productId, variantId})=>{
        dispatch(incrementCartItemInState({productId, variantId}))
        const data = await incrementCartItem({productId, variantId})
        return data
    }

    const handleDecrementCartItem = async ({productId, variantId})=>{
        dispatch(decrementCartItemInState({productId, variantId}))
        const data = await decrementCartItem({productId, variantId})
        return data
    }

    return {
        handleAddItem,
        handleGetCart,
        handleIncrementCartItem,
        handleDecrementCartItem
    }
}