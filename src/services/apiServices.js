import axios from "axios"
import { getData } from "../utils/LocalStorage";
import { API_URL, API_KEY } from '@env';
const apiClient = axios.create({
    // baseURL: 'http://192.168.1.6:8000/api',
    baseURL: `${API_URL}`,
    headers: {
        'Content-Type': 'application/json'
    }
})

apiClient.interceptors.request.use(async (config) => {
    const accessToken = await getData('accessToken')
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
}, error => Promise.reject(error))

// BUSINESS

export const fetchBusinesses = async () => {
    try {
        const response = await apiClient.get(`/businesses`)
        // console.log('response data: ', response.data)
        return response.data;
    } catch (error) {
        console.log('apiServices/fetchBusiness : ', error)
        throw new Error('Failed to fetch businesses.')
    }
}


export const insertBusiness = async (payload) => {
    // console.log({ filetype: typeof (payload.image) })
    try {
        const response = await apiClient.post(`/businesses`, payload, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        console.log('response data: ', response.data)
        return response.data;
    } catch (error) {
        console.log('apiServices/insertBusiness : ', error.response.data.message)
        throw new Error('Failed to insert business.')
    }
}

export const updateBusiness = async (payload, id) => {
    // console.log({ url: `/updateBusinesses/${id}` })
    try {
        const response = await apiClient.put(`/updateBusinesses/${id}`, payload, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        console.log('response data: ', response)
        return response.data;
    } catch (error) {
        console.log({ call: error })
        console.log('apiServices/update : ', error.response?.data?.message)
        throw new Error('Failed to update business.')
    }
}


export const insertMenu = async (payload) => {
    // console.log({ filetype: typeof (payload.image) })
    try {
        const response = await apiClient.post(`/menu`, payload, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        console.log('response data: ', response.data)
        return response.data;
    } catch (error) {
        console.log('apiServices/insertMenu : ', error.response.data.message)
        throw new Error('Failed to insert menu.')
    }
}

// export const editBusiness = async (payload, id) => {
//     try {
//         const response = await apiClient.post(`/updateBusinesses/${id}`, payload, {
//             headers: {
//                 'Content-Type': 'multipart/form-data',
//             }
//         })
//         console.log('response data: ', response)
//         return response.data;
//     } catch (error) {
//         console.log({ call: error })
//         console.log('apiServices/update : ', error.response?.data?.message)
//         throw new Error('Failed to update business.')
//     }
// }

export const deleteBusiness = async (id) => {
    try {
        const response = await apiClient.delete(`/businesses/${id}`)
        // console.log('response data: ', response.data)
        return response.data;
    } catch (error) {
        console.log('apiServices/deleteBusiness : ', error)
        throw new Error('Failed to delete businesses.')
    }
}

// category

export const fetchCategory = async () => {
    try {
        const response = await apiClient.get(`/category`)
        // console.log('response data: ', response.data)
        return response.data;
    } catch (error) {
        console.log('apiServices/fetchCategory : ', error)
        throw new Error('Failed to fetch category.')
    }
}

// feedback

export const fetchFeedbacks = async (id) => {
    try {
        const response = await apiClient.get(`/feedback/${id}`)
        // console.log('feedbacks: ', response.data)
        return response.data;
    } catch (error) {
        console.log('apiServices/fetchFeedbacks : ', error)
        throw new Error('Failed to fetch feedbacks.')
    }
}

export const submitFeedback = async (payload) => {
    try {
        const response = await apiClient.post(`/feedback/${payload.id}`, payload)
        console.log('response data: ', response.data)
        return response.data;
    } catch (error) {
        console.log('apiServices/submitFeedback : ', error.response.data.message)
        throw new Error('Failed to submit feedback.')
    }
}

// Favorite

export const insertFavorite = async (payload) => {
    try {
        const response = await apiClient.post(`/favorites`, payload)
        console.log('response data: ', response.data)
        return response.data;
    } catch (error) {
        console.log('apiServices/insertFavorite : ', error.response.data.message)
        throw new Error('Failed to insert favorite.')
    }
}

export const fetchFavorites = async () => {
    try {
        const response = await apiClient.get(`/favorites`)
        console.log('favoritesssssss: ', response.data)
        return response.data;
    } catch (error) {
        console.log('apiServices/fetchFavorites : ', error)
        throw new Error('Failed to fetch favorites.')
    }
}

export const removeFavorite = async (id) => {
    try {
        const response = await apiClient.delete(`/favorites/${id}`)
        // console.log('response data: ', response.data)
        return response.data;
    } catch (error) {
        console.log('apiServices/removeFavorite : ', error)
        throw new Error('Failed to remove favorite.')
    }
}

// users


// feedback

export const fetchUsers = async (id) => {
    try {
        const response = await apiClient.get(`/users`)
        // console.log('users: ', response.data)
        return response.data;
    } catch (error) {
        console.log('apiServices/fetchusers : ', error)
        throw new Error('Failed to fetch users.')
    }
}

export const updateUser = async (payload) => {
    try {
        const response = await apiClient.put(`/users/${payload.id}`, payload)
        // console.log('users: ', response.data)
        return response.data;
    } catch (error) {
        // console.log('apiServices/updateUser : ', error)
        console.log('apiServices/updateUser : ', error.response?.data?.message)
        throw new Error('Failed to update users.')
    }
}

export const changePassword = async (payload) => {
    try {
        const response = await apiClient.put(`/changePassword`, payload)
        // console.log('users: ', response.data)
        return response.data;
    } catch (error) {
        // console.log('apiServices/updateUser : ', error)
        console.log('apiServices/changePassword : ', error.response?.data?.message)
        throw new Error('Failed to change password.')
    }
}

