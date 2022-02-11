import { http } from '@/utils'
import {
  AddArticleCommentResp,
  ArticleCommentResponse,
  ArticleResponse,
} from '../data'
import { AppThunkAction } from '../index'

// 根据文章id获取文章详情
const getArticleById = (id: string): AppThunkAction => {
  return async dispatch => {
    const res = await http.get<ArticleResponse>(`/articles/${id}`)

    dispatch({ type: 'article/getArticleById', payload: res.data.data })
  }
}

// 获取文章评论
const getArticleComment = (type: string, id: string): AppThunkAction => {
  return async dispatch => {
    const res = await http.get<ArticleCommentResponse>('/comments', {
      params: {
        type,
        source: id,
      },
    })

    dispatch({ type: 'article/getArticleComment', payload: res.data.data })
  }
}

// 获取更多文章评论数据
const getMoreArticleComments = (
  type: string,
  id: string,
  offset: string
): AppThunkAction => {
  return async dispatch => {
    const res = await http.get<ArticleCommentResponse>('/comments', {
      params: {
        type,
        source: id,
        offset,
      },
    })

    dispatch({ type: 'article/getMoreArticleComments', payload: res.data.data })
  }
}

// 关注 or 取消关注作者
const followArticleAuthor = (
  aut_id: string,
  is_followed: boolean
): AppThunkAction => {
  return async dispatch => {
    // 判断当前是否关注
    if (is_followed) {
      // 取消关注
      await http.delete(`/user/followings/${aut_id}`)
    } else {
      // 关注
      await http.post('/user/followings', {
        target: aut_id,
      })
    }

    dispatch({
      type: 'article/updateInfo',
      payload: {
        // name 表示要修改状态中的哪个属性
        name: 'is_followed',
        // value 表示要修改成哪个值
        value: !is_followed,
      },
    })
  }
}

// 收藏 or 取消收藏文章
const collectArticle = (
  art_id: string,
  is_collected: boolean
): AppThunkAction => {
  return async dispatch => {
    // 判断当前是否收藏
    if (is_collected) {
      // 取消收藏
      http.delete(`/article/collections/${art_id}`)
    } else {
      // 收藏
      http.post('/article/collections', {
        target: art_id,
      })
    }

    dispatch({
      type: 'article/updateInfo',
      payload: {
        // name 表示要修改状态中的哪个属性
        name: 'is_collected',
        // value 表示要修改成哪个值
        value: !is_collected,
      },
    })
  }
}

// 点赞 or 取消点赞文章
const likeArticle = (art_id: string, attitude: number): AppThunkAction => {
  return async dispatch => {
    // 判断当前是否点赞
    // 如果是 1 表示已点赞
    if (attitude === 1) {
      // 取消点赞
      await http.delete(`/article/likings/${art_id}`)
    } else {
      // 点赞
      await http.post('/article/likings', {
        target: art_id,
      })
    }

    dispatch({
      type: 'article/updateInfo',
      payload: {
        // name 表示要修改状态中的哪个属性
        name: 'attitude',
        // value 表示要修改成哪个值
        value: attitude === 1 ? 0 : 1,
      },
    })
  }
}

// 对文章发表评论
const sendComment = (target: string, content: string): AppThunkAction => {
  return async dispatch => {
    // 注意：接口文章不对，应该根据实际返回的数据来处理
    const res = await http.post<AddArticleCommentResp>('/comments', {
      target,
      content,
    })

    dispatch({ type: 'article/sendComment', payload: res.data.data })
  }
}

// 更新评论的数量
const updateCommentCount = (
  commentId: string,
  total: number
): AppThunkAction => {
  return async dispatch => {
    dispatch({
      type: 'article/updateCommentCount',
      payload: {
        commentId,
        total,
      },
    })
  }
}

// 点赞 or 取消点赞评论
const likeComment = (art_id: string, is_liking: boolean): AppThunkAction => {
  return async dispatch => {
    if (is_liking) {
      // 取消点赞
      await http.delete(`/comment/likings/${art_id}`)
    } else {
      // 点赞
      await http.post('/comment/likings', {
        target: art_id,
      })
    }

    dispatch({
      type: 'comment/updateInfo',
      payload: {
        // name 表示要修改状态中的哪个属性
        name: 'is_liking',
        // value 表示要修改成哪个值
        value: !is_liking,
        // 评论 id
        target: art_id,
        // 数量
        like_count: is_liking ? -1 : 1,
      },
    })
  }
}

export {
  getArticleById,
  getArticleComment,
  getMoreArticleComments,
  followArticleAuthor,
  collectArticle,
  likeArticle,
  sendComment,
  updateCommentCount,
  likeComment,
}
