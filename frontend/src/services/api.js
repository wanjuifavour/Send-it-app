import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8085/api"

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    // withCredentials: true
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

export const getAllParcels = async (params = {}) => {
    const response = await api.get("/parcels/all", {
        params
    })
    return response.data
}

export const updateParcelStatus = async (parcelId, status) => {
    const response = await api.put(`/parcels/${parcelId}/status`, { status })
    return response.data
}

export const softDeleteParcel = async (parcelId) => {
    const response = await api.delete(`/parcels/${parcelId}`)
    return response.data
}

export const upsertParcel = async (parcelData) => {
    return api.post(`/parcels/upsert`, parcelData)
}

export const addLocation = async (locationData) => {
    try {
        const response = await api.post(`/locations/add`, locationData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to add location");
    }
};

export const getLocations = async () => {
    const response = await api.get("/locations/get");
    return response.data;
};

export const getUsers = async () => {
    const response = await api.get("/users/getusers");
    // console.log('API Response:', response.data)
    return response.data
};

export const deleteUser = async (userId) => {
    const response = await api.delete(`/users/${userId}`)
    return response.data
}

export const createPaymentIntent = async (parcelData) => {
    const response = await api.post("/pay/payment-intent", { parcelData });
    return response.data;
}

export default api