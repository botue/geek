import type { AppThunkAction } from '../index'
import { http, setToken } from '@/utils'

import { Token } from '../types'

// 存储token到redux中

// 解决方式一：
// const loginSetToken = (payload: Token): { type: 'login/setToken'; payload: Token } => ({ type: 'login/setToken', payload })

// 解决方式二：将 reducer 中写好的 action 类型导入，然后使用

// 解决方式三：
// let type = ''
// const type = 'login/setToken'
// const loginSetToken = (payload: Token) =>
//   ({ type: 'login/setToken', payload } as const)
const loginSetToken = (payload: Token) => ({
  type: 'login/setToken' as const,
  payload
})

// 获取验证码
const sendCode = (mobile: string) => {
  return async () => {
    try {
      await http.get(`/sms/codes/${mobile}`)
    } catch (e) {}
  }
}

// 登录逻辑
type LoginState = { mobile: string; code: string }
const login = (values: LoginState): AppThunkAction => {
  return async dispatch => {
    type LoginRes = {
      message: string
      data: {
        token: string
        refresh_token: string
      }
    }

    const res = await http.post<LoginRes>('/authorizations', values)

    // res.data.message
    // res.data.data.token

    if (res.data.message.toLowerCase() === 'ok') {
      const tokens = res.data.data

      // 存储 token
      setToken(tokens)
      // 将 token 数据存储到 redux 中

      // 修改了 dispatch 的类型后，原来分发 action 代码会报错：
      // 错误原因：
      //  属性“type”的类型不兼容。
      //  不能将类型“string”分配给类型“"home/getMoreArticles"”。
      // 分析错误原因：因此此处是将 loginSetToken() 的返回值传递给了 dispatch
      //  所以，实际上 loginSetToken() 的返回值类型为 string，
      //       而 "home/getMoreArticles" 类型是所有 Actions 中的某一个 aciton 的 type 类型
      //       也就是将 string 类型的值 赋值给了 "home/getMoreArticles" 类型，这样，将一个范围更大的类型赋值给了范围更小的类型
      //       导致类型错误，所以就会报错！
      // 解决问题：只需要让 loginSetToken() 方法的返回值类型中，action 不再是 string，而变成字面量类型即可
      dispatch(loginSetToken(tokens))
      // dispatch<{ type: 'login/setToken'; payload: Token }>({ type: 'login/setToken', payload: tokens })
      // dispatch({ type: 'login/setToken', payload: tokens })
    }
  }
}

export { sendCode, login }
