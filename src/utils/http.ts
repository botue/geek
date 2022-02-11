import axios from 'axios'

// 导入工具
import { getToken, removeToken, setToken } from './token'
import { history } from './history'

// 通过 process.env.REACT_APP_URL 就可以读取到配置文件中，配置的接口路径了
// export const baseURL = process.env.REACT_APP_URL!
export const baseURL =
  process.env.NODE_ENV === 'development' ? '/api' : process.env.REACT_APP_URL

// 创建 axios 的实例
const http = axios.create({
  baseURL,
  timeout: 5000,
})

// 请求拦截器
http.interceptors.request.use(config => {
  // 统一添加请求头
  if (!config.url!.startsWith('/authorizations')) {
    // 非登录接口，再添加 token
    // getToken() ===> { token, refresh_token }
    const { token } = getToken()
    // 判断是否有 token 如果有，再添加请求头
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }

  return config
})

// 响应拦截器
http.interceptors.response.use(
  response => response,
  async error => {
    try {
      // 判断 token 是否失效
      if (error.response.status === 401) {
        // 换取最新的 token
        const { refresh_token } = getToken()

        // 判断本地存储中是否有 refresh_token
        if (!refresh_token) {
          // 跳转到登录页面
          return history.push('/login', {
            from: history.location.pathname,
          })
        }

        // 使用 axios 来发送请求
        const res = await axios.put(`${baseURL}/authorizations`, null, {
          headers: {
            Authorization: `Bearer ${refresh_token}`,
          },
        })

        // 拿到 token
        const { token } = res.data.data
        // 存储到本地缓存中
        setToken({ token, refresh_token })
        // 继续执行原来的请求
        return http(error.config)
      }
    } catch (e) {
      removeToken()
      history.push('/login', {
        from: history.location.pathname,
      })
      return Promise.reject(error)
    }
  }
)

export { http }
