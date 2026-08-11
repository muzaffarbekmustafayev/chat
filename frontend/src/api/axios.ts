import axios from 'axios'
import toast from 'react-hot-toast'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
})

let store: any;
export const injectStore = (_store: any) => { store = _store }

let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error)
    else prom.resolve(token)
  })
  failedQueue = []
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config
    const code = error.response?.data?.error?.code

    if (error.response?.status === 401 && !originalRequest._retry && code === 'TOKEN_EXPIRED') {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return api(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const { data } = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          {},
          { withCredentials: true }
        )
        const token = data.data.token
        localStorage.setItem('accessToken', token)
        api.defaults.headers.common.Authorization = `Bearer ${token}`
        originalRequest.headers.Authorization = `Bearer ${token}`
        processQueue(null, token)
        return api(originalRequest)
      } catch (err) {
        processQueue(err, null)
        if (store) store.dispatch({ type: 'auth/logout' })
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    const msg = error.response?.data?.error?.message || 'Server xatosi'
    if (error.response?.status !== 401 || code !== 'NO_TOKEN') {
      toast.error(msg)
    }

    return Promise.reject(error)
  }
)
