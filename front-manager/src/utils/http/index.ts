import axios, { InternalAxiosRequestConfig, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import EmojiText from '../emojo'
import { ref } from 'vue'
import { router } from '@/router'
import { getMessage } from './msg'

const axiosInstance = axios.create({
  timeout: 15000, // 请求超时时间(毫秒)
  baseURL: import.meta.env.VITE_API_URL, // API地址
  withCredentials: true, // 异步请求携带cookie
  transformRequest: [(data) => JSON.stringify(data)], // 请求数据转换为 JSON 字符串
  validateStatus: (status) => status >= 200 && status < 300, // 只接受 2xx 的状态码
  headers: {
    get: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
    post: { 'Content-Type': 'application/json;charset=utf-8' }
  },
  transformResponse: [
    (data) => {
      // 响应数据转换
      try {
        return typeof data === 'string' && data.startsWith('{') ? JSON.parse(data) : data
      } catch {
        return data // 解析失败时返回原数据
      }
    }
  ]
})

// 请求拦截器
axiosInstance.interceptors.request.use(
  (request) => {
    const userStore = useUserStore()
    const { token } = userStore.info

    if (token) {
      request.headers.set({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    }

    // 打印请求信息
    console.log('=======================================')
    console.log('请求 URL:', request.url)
    console.log('请求方法:', request.method)
    // console.log('请求体request:', request.data)

    return request
  },
  (error) => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
axiosInstance.interceptors.response.use(
  // 第一个函数处理成功的响应
  (response: AxiosResponse) => response,  // 直接返回响应数据
  
  // 第二个函数处理错误情况
  (error) => {
    // 获取错误状态码和信息
    const status = error.response?.status
    const errorMessage = error.response?.data?.message

    // 处理 401 认证错误
    if (status === 401) {
      const userStore = useUserStore()
      userStore.logOut()
      router.push('/login')
      ElMessage.error(errorMessage || getMessage(401))
      return Promise.reject(error)
    }

    // 处理其他错误
    if (axios.isCancel(error)) {
      console.log('repeated request: ' + error.message)
    } else {
      ElMessage.error(
        errorMessage
          ? `${errorMessage} ${EmojiText[500]}`
          : `请求超时或服务器异常！${EmojiText[500]}`
      )
    }
    
    return Promise.reject(error)
  }
)

// 请求
async function request<T = any>(config: AxiosRequestConfig): Promise<T> {
  // 将 POST | PUT 请求的参数放入 data 中，并清空 params
  if (config.method === 'POST' || config.method === 'PUT') {
    config.data = config.params
    config.params = {}
  }
  try {
    const res = await axiosInstance.request<T>({ ...config })
    return res.data
  } catch (e) {
    if (axios.isAxiosError(e)) {
      // 可以在这里处理 Axios 错误
    }
    return Promise.reject(e)
  }
}

// API 方法集合
const api = {
  get<T>(config: AxiosRequestConfig): Promise<T> {
    return request({ ...config, method: 'GET' }) // GET 请求
  },
  post<T>(config: AxiosRequestConfig): Promise<T> {
    return request({ ...config, method: 'POST' }) // POST 请求
  },
  put<T>(config: AxiosRequestConfig): Promise<T> {
    return request({ ...config, method: 'PUT' }) // PUT 请求
  },
  del<T>(config: AxiosRequestConfig): Promise<T> {
    return request({ ...config, method: 'DELETE' }) // DELETE 请求
  }
}

export default api
