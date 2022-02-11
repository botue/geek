import { ArticleComment, ArticleInfo, AddArticleComment } from '../data'

type ArticleState = {
  info: ArticleInfo
  comment: ArticleComment
}

const initialState = {
  // 文章详情
  info: {},
  // 评论列表数据
  comment: {
    total_count: 0,
    // 此处直接给 results 属性一个 数组默认值，这样，不管有没有评论数据，那么，results 都是一个数组
    results: [] as ArticleComment['results'],
  },
} as ArticleState

type ArticleAction =
  | {
      type: 'article/getArticleById'
      payload: ArticleInfo
    }
  | { type: 'article/getArticleComment'; payload: ArticleComment }
  | { type: 'article/getMoreArticleComments'; payload: ArticleComment }
  | {
      type: 'article/updateInfo'
      payload: { name: string; value: boolean | number }
    }
  | {
      type: 'article/sendComment'
      payload: AddArticleComment
    }
  | {
      type: 'article/updateCommentCount'
      payload: { commentId: string; total: number }
    }
  | {
      type: 'comment/updateInfo'
      payload: {
        name: string
        value: boolean
        target: string
        like_count: number
      }
    }

const article = (state = initialState, action: ArticleAction): ArticleState => {
  switch (action.type) {
    case 'article/getArticleById':
      return {
        ...state,
        info: action.payload,
      }

    case 'article/getArticleComment':
      return {
        ...state,
        comment: action.payload,
      }

    case 'article/getMoreArticleComments':
      console.log(action.payload)
      return {
        ...state,
        comment: {
          ...action.payload,
          results: [...state.comment.results, ...action.payload.results],
        },
      }

    // 统一处理 关注、收藏、点赞 三个状态
    case 'article/updateInfo':
      return {
        ...state,
        info: {
          ...state.info,
          [action.payload.name]: action.payload.value,
        },
      }

    case 'article/sendComment':
      return {
        ...state,
        info: {
          ...state.info,
          comm_count: state.info.comm_count + 1,
        },
        comment: {
          ...state.comment,
          total_count: state.comment.total_count + 1,
          // last_id:
          //   state.comment.total_count === 0 ? action.payload.com_id : null,
          results: [action.payload.new_obj, ...state.comment.results],
        },
      }

    case 'article/updateCommentCount':
      return {
        ...state,
        comment: {
          ...state.comment,
          results: state.comment.results.map(item => {
            // 将对应的评论项的回复条数，进行修改
            if (item.com_id === action.payload.commentId) {
              return {
                ...item,
                reply_count: action.payload.total,
              }
            }

            return item
          }),
        },
      }

    case 'comment/updateInfo':
      return {
        ...state,
        comment: {
          ...state.comment,
          results: state.comment.results.map(item => {
            if (item.com_id === action.payload.target) {
              return {
                ...item,
                [action.payload.name]: action.payload.value,
                like_count: item.like_count + action.payload.like_count,
              }
            }

            return item
          }),
        },
      }
    default:
      return state
  }
}

export { article }
