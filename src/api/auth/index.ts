import request from '@/utils/request'
import type { LoginRequest, LoginResponse, RefreshTokenResponse } from './types'

const AuthAPI = {
  /** 登录接口 */
  login(data: LoginRequest) {
    return request<any, LoginResponse>({
      url: '/backend/login',
      method: 'post',
      data: {
        username: data.username,
        password: data.password,
      },
    })
  },

  /** 刷新 token 接口 */
  refreshToken(refreshToken: string) {
    return request<any, RefreshTokenResponse>({
      url: '/backend/refreshToken',
      method: 'post',
      headers: {
        Authorization: 'no-auth', // 刷新自身不携带已过期的 Authorization Header
      },
      data: {
        refreshToken,
      },
    })
  },

  /** 退出登录接口 */
  logout() {
    return Promise.resolve()
  },

  /** 获取验证码接口 */
  getCaptcha() {
    return Promise.resolve({ captchaId: '', captchaBase64: '' })
  },
}

export default AuthAPI

// 重导出类型
export * from './types'
