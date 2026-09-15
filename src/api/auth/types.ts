/**
 * 认证相关类型定义
 */

/**
 * 登录请求参数
 */
export interface LoginRequest {
  /** 用户名 */
  username: string
  /** 密码 */
  password: string
  /** 验证码缓存key */
  captchaId?: string
  /** 验证码 */
  captchaCode?: string
  /** 记住我 */
  rememberMe?: boolean
  /** 租户ID */
  tenantId?: number
}

/**
 * 用户信息
 */
export interface UserInfo {
  id: number
  username: string
  nickname: string
  role: string
}

/**
 * 登录响应
 */
export interface LoginResponse {
  /** 访问令牌 */
  accessToken: string
  /** 访问令牌 (兼容) */
  token?: string
  /** 刷新令牌 (refreshToken) */
  refreshToken: string
  /** 过期时间(单位:秒) */
  expiresIn: number
  /** 用户信息 */
  user: UserInfo
}

/**
 * 刷新 Token 请求参数
 */
export interface RefreshTokenRequest {
  /** 刷新 token */
  refreshToken: string
}

/**
 * 刷新 Token 响应
 */
export interface RefreshTokenResponse {
  /** 新的访问 token */
  accessToken: string
  /** 新的访问 token (兼容字段) */
  token?: string
  /** 有效期（秒） */
  expiresIn: number
  /** 新的刷新 token */
  refreshToken: string
}
