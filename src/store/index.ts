import { createStore, applyMiddleware, AnyAction } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk, { ThunkAction, ThunkDispatch } from 'redux-thunk'
import { getToken } from '@/utils'

import rootReducer from './reducers'

// import type { HomeType } from './reducers/home'
// import type { LoginType } from './reducers/login'
// import type { ProfileType } from './reducers/profile'

// type Actions = HomeType | LoginType | ProfileType
// type Actions = HomeType | LoginType | ProfileType

// 创建中间件
const middlewares = composeWithDevTools(applyMiddleware(thunk))

// 如果 redux 需要一些初始值，可以通过 createStore 的第二个参数来设置
// 注意：此处设置的状态是整个 redux 的状态
// redux 状态：{ login: {}, ... }

const initialState = {
  // 为 login 设置默认值，也就是 token 值
  login: getToken()
}

const store = createStore(rootReducer, initialState, middlewares)

// 获取整个 redux 应用中的状态类型
export type AppState = ReturnType<typeof store.getState>
// 获取 函数形式的action（redux-thunk）的类型
// Promise<void> 表示： 函数形式的 action 的返回值类型
// AppState 表示：整个 Redux 应用状态的类型
// unknown 表示：额外数据的类型，咱们的项目中用不到该参数
// any 表示：整个应用中 Action 的类型 - 将来应该修改为项目中用到的所有 action 的类型
export type AppThunkAction = ThunkAction<
  Promise<void>,
  AppState,
  unknown,
  // Actions
  AnyAction
>
export type AppThunkDispatch = ThunkDispatch<AppState, unknown, AnyAction>

export default store
