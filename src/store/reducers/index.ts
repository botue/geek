import { combineReducers } from 'redux'

// 导入 login reducer
import { login } from './login'
// 导入 profile reducer
import { profile } from './profile'
// 导入 home reducer
import { home } from './home'
// 导入 search reducer
import { search } from './search'
// 导入 article reducer
import { article } from './article'

const rootReducer = combineReducers({
  login,
  profile,
  home,
  search,
  article
})

export default rootReducer
