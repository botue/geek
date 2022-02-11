import type { Token } from '../types'
// const initialState: LoginState = {
//   token: '',
//   refresh_token: ''
// }

// 可以通过 as 来解决类型不匹配的问题，但是，一定要保证该代码将来不会报错
// const initialState: LoginState = {} as LoginState
const initialState = {} as Token

// 创建 action 的类型
// type ActionType = {
//   type: string
//   payload: Token
// }

export type LoginType = {
  type: 'login/setToken'
  payload: Token
}

const login = (state = initialState, action: LoginType) => {
  switch (action.type) {
    case 'login/setToken':
      return action.payload
    default:
      return state
  }
}

export { login }
