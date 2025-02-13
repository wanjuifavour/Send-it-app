import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8085/api"

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
})

api.interceptors.request.use((config) => {
    const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1]

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
    const response = await api.post("/parcels/admin/create", parcelData)
    return response.data
}

export const getAllParcels = async () => {
    const response = await api.get("/admin/parcels")
    return response.data
}

export const updateParcelStatus = async (parcelId, status) => {
    const response = await api.put(`/admin/parcels/${parcelId}/status`, { status })
    return response.data
}

export const getLocations = async () => {
    const response = await api.get("/locations/get");
    return response.data;
};

export const getUsers = async () => {
    const response = await api.get("/users/getusers");
    return response.data.users;
};

export default api