import axios from "axios"

const api = axios.create({
    baseURL:"/api/auth",
    withCredentials:true
})

export const register = async ({email, contact, password, fullname, isSeller})=>{
    const response = await api.post("/register", {email, contact, password, fullname, isSeller})
    return response.data;
}

export const login = async ({email, password}) => {
    const response = await api.post("/login", {email, password});
    return response.data;
}

export const getMe = async () => {
    const response = await api.get("/me");
    return response.data;
}