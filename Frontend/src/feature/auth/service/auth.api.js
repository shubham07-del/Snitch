import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.MODE === "development" ? "http://localhost:3000" : "https://snitch-t6v0.onrender.com");

const api = axios.create({
    baseURL: `${API_BASE_URL}/api/auth`,
    withCredentials:true
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const register = async ({email, contact, password, fullname, isSeller})=>{
    const response = await api.post("/register", {email, contact, password, fullname, isSeller})
    if (response.data?.token) localStorage.setItem("token", response.data.token);
    return response.data;
}

export const login = async ({email, password}) => {
    const response = await api.post("/login", {email, password});
    if (response.data?.token) localStorage.setItem("token", response.data.token);
    return response.data;
}

export const getMe = async () => {
    const response = await api.get("/me");
    return response.data;
}


export const logout = async ()=>{
    const response = await api.get("/logout")
    localStorage.removeItem("token");
    return response.data
}

export const updateProfile = async ({fullname, contact, email}) => {
    const response = await api.put("/profile", {fullname, contact, email})
    return response.data
}