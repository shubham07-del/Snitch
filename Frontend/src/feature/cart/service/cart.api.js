import axios from "axios"
const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL || ""}/api/cart`,
    withCredentials:true
}) 

export async function addItem({productId, variantId}) {
    const response = await api.post(`/add/${productId}/${variantId}`,{quantity:1})
    return response.data
}

export async function getCart() {
    const response = await api.get("/")
    return response.data
}

export async function incrementCartItem({productId, variantId}) {
    const response = await api.patch(`/quantity/increment/${productId}/${variantId}`)
    return response.data
}

export async function decrementCartItem({productId, variantId}) {
    const response = await api.patch(`/quantity/decrement/${productId}/${variantId}`)
    return response.data
}

export async function createCartOrder(){
    const response = await api.post("/payment/create/order")
    return response.data
}


export async function verifyCartOrder({razorpay_order_id,razorpay_payment_id,razorpay_signature}) {
    const response = await api.post("/payment/verify",{
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    })
    return response.data
}


export async function removeCartItem({productId, variantId}) {
    const response = await api.delete(`/remove/${productId}/${variantId}`)
    return response.data
}

export async function buyNowOrder({productId, variantId}) {
    const response = await api.post(`/payment/buynow/${productId}/${variantId}`)
    return response.data
}