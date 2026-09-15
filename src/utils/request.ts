import axios, { type InternalAxiosRequestConfig, type AxiosResponse } from 'axios'
import qs from 'qs'
import { ApiCodeEnum } from '@/enums/api'
import { useUserStoreHook } from '@/stores/user'
import { usePermissionStoreHook } from '@/stores/permission'
import { AuthStorage, redirectToLogin } from '@/utils/auth'

declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    /** 标记当前请求是否已经属于失效重试请求，防止 401 死循环 */
    _isRetry?: boolean
  }
}

// 记录已重试的请求，防止无限循环
let isRefreshing = false // 是否正在刷新 token 的锁状态
let requestsQueue: Array<(token: string) => void> = [] // 挂起的等待队列

// HTTP 请求实例
const http = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
    'x-client-type': 'admin',
  },
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
})

// 请求拦截器
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = AuthStorage.getAccessToken()

    if (config.headers.Authorization === 'no-auth') {
      delete config.headers.Authorization
    } else if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error),
)

// 响应拦截器
http.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { responseType } = response.config

    // 二进制数据直接返回
    if (responseType === 'blob' || responseType === 'arraybuffer') {
      return response
    }

    const { code, data, msg } = response.data

    if (code === ApiCodeEnum.SUCCESS) {
      return data
    }

    ElMessage.error(msg || '系统出错')
    return Promise.reject(new Error(msg || '系统出错'))
  },

  async (error) => {
    const { config, response } = error

    console.log('error', error)
    console.log('config', config)
    if (!response) {
      ElMessage.error('网络连接失败')
      return Promise.reject(error)
    }

    const { code, msg } = response.data as ApiResponse

    // Token 过期：尝试刷新 token 后自动重试一次
    if (code === ApiCodeEnum.ACCESS_TOKEN_INVALID) {
      // 已重试过，直接跳登录
      if (config?._isRetry) {
        await redirectToLogin('登录已过期，请重新登录')
        return Promise.reject(new Error('Token Invalid'))
      }

      if (config) {
        config._isRetry = true
      }

      if (!isRefreshing) {
        isRefreshing = true

        try {
          const userStore = useUserStoreHook()
          await userStore.refreshTokenOnce()

          const token = AuthStorage.getAccessToken()

          // 释放排队队列：通知所有由于并发被拦截挂起的请求，带上全新 Token 再次起飞
          if (token) {
            requestsQueue.forEach((cb) => cb(token))
          }
          requestsQueue = [] // 清空等待队列

          if (token && config) {
            config.headers.set('Authorization', `Bearer ${token}`)
          }
          return http(config) // 执行当前抢占锁的请求的重试
        } catch (err) {
          // 刷新 Token 彻底失败，清空队列并清空标记，引导至登录页
          requestsQueue = []
          await redirectToLogin('登录已过期，请重新登录')
          return Promise.reject(new Error('Token refresh failed'))
        } finally {
          isRefreshing = false // 无论成功失败，重置刷新锁状态
        }
      } else {
        // 如果当前已经有其他请求在刷新 Token 了，把当前请求塞进 Promise 挂起排队
        return new Promise((resolve) => {
          requestsQueue.push((newToken: string) => {
            if (config) {
              config.headers.set('Authorization', `Bearer ${newToken}`)
              resolve(http(config)) // 当换到新 Token 时，自动触发重新请求并完成外层的 Promise 交付
            }
          })
        })
      }
    }

    // Refresh token 失效：无法续期，跳转登录
    if (code === ApiCodeEnum.REFRESH_TOKEN_INVALID) {
      await redirectToLogin('登录已过期，请重新登录', false)
      return Promise.reject(new Error('Token Invalid'))
    }

    // 权限不足：刷新权限快照后提示
    if (code === ApiCodeEnum.PERMISSION_DENIED) {
      const permissionStore = usePermissionStoreHook()
      await permissionStore.reloadPermissionSnapshotOnce()
      ElMessage.error(msg || '权限不足')
      return Promise.reject(new Error(msg || '权限不足'))
    }

    ElMessage.error(msg || '请求失败')
    return Promise.reject(new Error(msg || '请求失败'))
  },
)

export default http
