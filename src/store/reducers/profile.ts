// 该类型就是 获取用户个人资料 时，接口返回的数据格式
type Profile = {
  id: string
  name: string
  photo: string
  art_count: number
  follow_count: number
  fans_count: number
  like_count: number
}

type UserInfo = {
  birthday: string
  gender: number
  intro: string | null
  mobile: string
  name: string
  photo: string
}

// 文章列表项
type Article = {
  art_id: string
  aut_id: string
  aut_name: string
  comm_count: number
  pubdate: string
  title: string
  cover: { type: number; images: string[] }
}
type UserArticle = {
  page: number
  per_page: number
  results: Article[]
  total_count: number
}

type Fans = {
  fans_count: number
  id: string
  mutual_follow: boolean
  name: string
  photo: string
}
type UserFans = Record<
  'followings' | 'followers',
  {
    page: number
    per_page: number
    results: Fans[]
    total_count: number
  }
>

type UserArticleList = Record<
  '/article/collections' | '/user/histories' | '/user/articles',
  {
    page: number
    per_page: number
    results: Article[]
    total_count: number
  }
>

type Notification1 = {
  comment_target: string
  content: string
  create_time: string
  id: string
  title: string
}
type Notification2 = Omit<Notification1, 'comment_target'>
type UserNotification1 = Record<
  'all' | 'comment' | 'thumbsup' | 'fans' | 'system',
  {
    page: number
    per_page: number
    total_count: number
    results: Notification1[] | Notification2[]
  }
>

type UserState = {
  profile: Profile
  userInfo: UserInfo
  userArticle: UserArticle
  userFigure: { fans_count: number; read_count: number }
  userFans: UserFans
  userArticleList: UserArticleList
  userNotification1: UserNotification1
}

const initialState = {
  profile: {},
  userInfo: {},
  userArticle: {
    results: [] as Article[]
  },
  userFigure: {},
  userFans: {
    followings: {
      results: [] as Fans[]
    },
    followers: {
      results: [] as Fans[]
    }
  },
  userArticleList: {
    '/article/collections': {
      results: [] as Article[]
    },
    '/user/histories': {
      results: [] as Article[]
    },
    '/user/articles': {
      results: [] as Article[]
    }
  },
  userNotification1: {
    all: {
      results: [] as Notification1[]
    },
    comment: {
      results: [] as Notification1[]
    },
    thumbsup: {
      results: [] as Notification1[]
    },
    fans: {
      results: [] as Notification2[]
    },
    system: {
      results: [] as Notification2[]
    }
  }
} as UserState

export type ProfileType =
  | {
      type: 'profile/getProfile'
      payload: Profile
    }
  | {
      type: 'profile/updateUser'
      payload: Record<'birthday' | 'intro' | 'name', string> & {
        gender: number
      }
    }
  | {
      type: 'profile/updatePhoto'
      payload: { photo: string }
    }
  | {
      type: 'profile/getUserInfo'
      payload: UserInfo
    }
  | {
      type: 'profile/getUserArticle'
      payload: UserArticle
    }
  | {
      type: 'profile/getUserFigure'
      payload: { fans_count: number; read_count: number }
    }
  | {
      type: 'profile/getUserFans'
      payload: {
        type: 'followings' | 'followers'
        data: UserFans['followings'] | UserFans['followers']
      }
    }
  | {
      type: 'profile/getUserArticleList'
      payload: {
        type: '/article/collections' | '/user/histories' | '/user/articles'
        // 此处三个属性的类型是一样的，所以，使用任意一个表示都可以
        data: UserArticleList['/article/collections']
      }
    }
  | {
      type: 'profile/getUserNotification'
      payload: {
        type: 'all' | 'comment' | 'thumbsup'
        // 此处三个属性的类型是一样的，所以，使用任意一个表示都可以
        data: UserNotification1['all']
      }
    }

const profile = (state = initialState, action: ProfileType): UserState => {
  switch (action.type) {
    case 'profile/getProfile':
      return {
        ...state,
        profile: action.payload
      }
    case 'profile/updateUser':
    case 'profile/updatePhoto':
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          ...action.payload
        }
      }

    case 'profile/getUserInfo':
      return {
        ...state,
        userInfo: action.payload
      }

    case 'profile/getUserArticle':
      return {
        ...state,
        userArticle: {
          ...action.payload,
          results: [...state.userArticle.results, ...action.payload.results]
        }
      }

    case 'profile/getUserFigure':
      return {
        ...state,
        userFigure: action.payload
      }

    case 'profile/getUserFans':
      const { type, data } = action.payload
      return {
        ...state,
        userFans: {
          ...state.userFans,
          [type]: {
            ...data,
            results: [...state.userFans[type].results, ...data.results]
          }
        }
      }
    case 'profile/getUserArticleList':
      const { type: userArtListType, data: userArtListData } = action.payload
      return {
        ...state,
        userArticleList: {
          ...state.userArticleList,
          [userArtListType]: {
            ...userArtListData,
            results: [
              ...state.userArticleList[userArtListType].results,
              ...userArtListData.results
            ]
          }
        }
      }

    case 'profile/getUserNotification':
      const { type: userNotiType, data: userNotiData } = action.payload
      return {
        ...state,
        userNotification1: {
          ...state.userNotification1,
          [userNotiType]: {
            ...userNotiData,
            results: [
              ...state.userNotification1[userNotiType].results,
              ...userNotiData.results
            ]
          }
        }
      }
    default:
      return state
  }
}

export { profile }
