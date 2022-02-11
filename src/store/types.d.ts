/**
 * 登录时拿到的 Token 的类型
 */
export type Token = {
  token: string
  refresh_token: string
}

/**
 * Channel 列表项的类型
 */
export type Channel = {
  id: number
  name: string
}
