import { addItem, getCart, incrementCartItem, decrementCartItem, createCartOrder, verifyCartOrder, removeCartItem, buyNowOrder } from "../service/cart.api";
import { setItem, addItem as addItemToCart, incrementCartItemInState, decrementCartItemInState, removeCartItemFromState } from "../state/cart.slice";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

export const useCart = ()=>{
    const dispatch = useDispatch()

    const handleAddItem = async ({productId, variantId})=>{
        try {
            const data = await addItem({productId, variantId})
            toast.success("Added to cart");
            return data
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to add to cart");
            throw error;
        }
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
        try {
            const data = await createCartOrder()
            return data.order
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to create order");
            throw error;
        }
    }

    const handleVerifyOrder = async ({razorpay_order_id,razorpay_payment_id,razorpay_signature})=>{
        try {
            const data = await verifyCartOrder({razorpay_order_id,razorpay_payment_id,razorpay_signature})
            toast.success("Order verified successfully!");
            return data.message
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to verify order");
            throw error;
        }
    }

    const handleRemoveCartItem = async ({productId, variantId})=>{{
        dispatch(removeCartItemFromState({productId, variantId}))
        const data = await removeCartItem({productId, variantId})
        return data
    }}

    const handleBuyNow = async ({productId, variantId})=>{
        try {
            const data = await buyNowOrder({productId, variantId})
            return data.order
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to initiate buy now");
            throw error;
        }
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