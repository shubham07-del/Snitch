import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.MODE === "development" ? "http://localhost:3000" : "https://snitch-t6v0.onrender.com");

const api = axios.create({
    baseURL: `${API_BASE_URL}/api/address`,
    withCredentials:true
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export async function createAddress({fullname,phone,email,address,city,state,pincode,country}){
    const response = await api.post("/add",{fullname,phone,email,address,city,state,pincode,country})
    return response.data
}

export async function getAddress() {
    const response = await api.get("/")
    return response.data
}

export async function getAllAddresses() {
    const response = await api.get("/all")
    return response.data
}

export async function updateAddress(id, data) {
    const response = await api.put(`/${id}`, data)
    return response.data
}

export async function deleteAddress(id) {
    const response = await api.delete(`/${id}`)
    return response.data
}