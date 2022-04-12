import axios from 'axios'

export const setupAuthHeaders = (token) => {
    if (token) {
        return (axios.defaults.headers.common['Authorization'] = `Bearer ${token}`)
    }
    delete axios.defaults.headers.common['Authorization']
}
