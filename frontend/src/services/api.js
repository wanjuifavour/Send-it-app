import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8085/api"

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export const login = async (email, password) => {
    const response = await api.post("/users/login", { email, password })
    return response.data
}

export const register = async (username, email, password) => {
    const response = await api.post("/users/signup", { username, email, password })
    return response.data
}

export const getParcels = async () => {
    const response = await api.get("/parcels")
    return response.data
}

export const createParcel = async (parcelData) => {
    const response = await api.post("/parcels", parcelData)
    return response.data
}

export default api