import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.MODE === "development" ? "http://localhost:3000" : "https://snitch-t6v0.onrender.com");

const api = axios.create({
    baseURL: `${API_BASE_URL}/api/products`,
    withCredentials:true
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export async function createProduct(formData){
    const response = await api.post("/", formData)
    return response.data
}

export async function getSellerProduct() {
    const response = await api.get("/seller")
    return response.data
}

export async function getAllProducts() {
    const response = await api.get("/")
    return response.data
}


export async function getProductDetails(productId){
    const response = await api.get(`/${productId}`)
    return response.data
}

export async function addProductVariant(productId, newProductVariant) {
    const formData = new FormData()

    newProductVariant.images.forEach((image) => {
        formData.append("images",image)
    });

    formData.append("stock",newProductVariant.stock)
    if (newProductVariant.priceAmount) {
        formData.append("priceAmount",newProductVariant.priceAmount)
        formData.append("priceCurrency",newProductVariant.priceCurrency)
    }
    formData.append("attributes",JSON.stringify(newProductVariant.attributes))
    
    const response = await api.post(`/product/${productId}/variants`,formData)
    return response.data
    
}