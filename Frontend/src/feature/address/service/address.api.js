import axios from "axios"

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL || ""}/api/address`,
    withCredentials:true
})


export async function createAddress({fullname,phone,email,address,city,state,pincode,country}){
    const response = await api.post("/add",{fullname,phone,email,address,city,state,pincode,country})
    return response.data
}

export async function getAddress() {
    const response = await api.get("/")
    return response.data
}