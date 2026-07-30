import axios from "axios"

const api = axios.create({
    baseURL:"/api/products",
    withCredentials:true
})

export async function createProduct({productName, description, priceAmount, priceCurrency, image}){
    const response = await api.post("/", {productName, description, priceAmount, priceCurrency, image})
    return response.data
}

export async function getSellerProduct() {
    const response = await api.get("/seller")
    return response.data
}