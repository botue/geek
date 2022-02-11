import type { AppThunkAction } from '../index'
import { http } from '@/utils'

// 我的页面 - 获取个人信息
const getProfile = (): AppThunkAction => {
  return async dispatch => {
    try {
      const res = await http.get('/user')
      const { data, message } = res.data

      if (message.toLowerCase() === 'ok') {
        // 存储 redux 中
        dispatch({ type: 'profile/getProfile', payload: data })
      }
    } catch (e) {}
  }
}

// 个人资料 - 修改个人信息
type UpdateUserParams = {
  gender?: number
  name?: string
  intro?: string
  birthday?: string
}
const updateUser = (data: UpdateUserParams): AppThunkAction => {
  return async dispatch => {
    console.log(data)
    await http.patch('/user/profile', data)
    dispatch({ type: 'profile/updateUser', payload: data })
  }
}

const updateUserPhoto = (data: FormData): AppThunkAction => {
  return async dispatch => {
    const res = await http.patch('/user/photo', data)
    dispatch({
      type: 'profile/updatePhoto',
      payload: { photo: res.data.data.photo },
    })
  }
}

const getUserInfo = (): AppThunkAction => {
  return async dispatch => {
    const res = await http.get('/user/profile')
    dispatch({ type: 'profile/getUserInfo', payload: res.data.data })
  }
}

// 获取用户的作品
const getUserArticle = (page: number = 1): AppThunkAction => {
  return async dispatch => {
    const res = await http.get('/user/articles', {
      params: {
        page,
        per_page: 10,
      },
    })

    dispatch({ type: 'profile/getUserArticle', payload: res.data.data })
  }
}

const getUserFigure = (): AppThunkAction => {
  return async dispatch => {
    const res = await http.get('/user/figure')

    dispatch({ type: 'profile/getUserFigure', payload: res.data.data })
  }
}

// 获取关注 或 关注者
const getUserFans = (
  type: 'followings' | 'followers',
  page: number
): AppThunkAction => {
  return async dispatch => {
    const res = await http.get(`/user/${type}`, {
      params: {
        page,
        per_page: 10,
      },
    })
    dispatch({
      type: 'profile/getUserFans',
      payload: {
        type,
        data: res.data.data,
      },
    })
  }
}

// 我的收藏、阅读历史、我的作品
const getUserArticleList = (path: string, page: number): AppThunkAction => {
  return async dispatch => {
    const res = await http.get(path, {
      params: {
        page,
        per_page: 10,
      },
    })

    dispatch({
      type: 'profile/getUserArticleList',
      payload: {
        type: path,
        data: res.data.data,
      },
    })
  }
}

const typeRecord: {
  [key: string]: string
} = {
  all: '',
  system: '1',
  comment: '2',
  fans: '3',
  thumbsup: '4',
}
// 消息通知 - 全部、评论、点赞
const getUserNotification = (type: string, page: number): AppThunkAction => {
  return async dispatch => {
    const res = await http.get('/user/notify', {
      params: {
        type: typeRecord[type],
        page,
        per_page: 10,
      },
    })

    dispatch({
      type: 'profile/getUserNotification',
      payload: {
        type,
        data: res.data.data,
      },
    })
  }
}

export {
  getProfile,
  getUserInfo,
  updateUser,
  updateUserPhoto,
  getUserArticle,
  getUserFigure,
  getUserFans,
  getUserArticleList,
  getUserNotification,
}
