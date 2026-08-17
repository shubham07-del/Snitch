import { addItem, getCart, incrementCartItem, decrementCartItem, createCartOrder, verifyCartOrder, removeCartItem, buyNowOrder } from "../service/cart.api";
import { setItem, addItem as addItemToCart, incrementCartItemInState, decrementCartItemInState, removeCartItemFromState } from "../state/cart.slice";
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

    const handleCreateCartOrder = async()=>{
        const data = await createCartOrder()
        return data.order
    }

    const handleVerifyOrder = async ({razorpay_order_id,razorpay_payment_id,razorpay_signature})=>{
        const data = await verifyCartOrder({razorpay_order_id,razorpay_payment_id,razorpay_signature})
        return data.message
    }

    const handleRemoveCartItem = async ({productId, variantId})=>{{
        dispatch(removeCartItemFromState({productId, variantId}))
        const data = await removeCartItem({productId, variantId})
        return data
    }}

    const handleBuyNow = async ({productId, variantId})=>{
        const data = await buyNowOrder({productId, variantId})
        return data.order
    }

    return {
        handleAddItem,
        handleGetCart,
        handleIncrementCartItem,
        handleDecrementCartItem,
        handleCreateCartOrder,
        handleVerifyOrder,
        handleRemoveCartItem,
        handleBuyNow
    }
}