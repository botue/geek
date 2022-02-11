import { Token } from '@/store/types'

const TOKEN_KEY = 'geek-h5_pip__'

// 获取 token
// 此处，将获取到的 token 字符串，先转化为 JSON 格式的对象，再返回
const getToken = () =>
  JSON.parse(localStorage.getItem(TOKEN_KEY) || '{}') as Token

// 设置 token
const setToken = (data: Token) =>
  localStorage.setItem(TOKEN_KEY, JSON.stringify(data))

// 移除 token
const removeToken = () => localStorage.removeItem(TOKEN_KEY)

// 判断是否登录（授权）
const isAuth = () => !!getToken().token

export { getToken, setToken, removeToken, isAuth }
