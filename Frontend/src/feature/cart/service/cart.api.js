import axios from "axios"
const api = axios.create({
    baseURL:"http://localhost:3000/api/cart",
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