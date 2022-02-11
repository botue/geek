import { useEffect, useState } from 'react'
import { Popup, NavBar, Toast } from 'antd-mobile'

import CommentItem from '../CommentItem'
import CommentFooter from '../CommentFooter'
import CommentInput from '../CommentInput'
import NoneComment from '@/components/NoneComment'

import styles from './index.module.scss'
import {
  AddCommentReplyResp,
  ArtComment,
  ArticleComment,
  ArticleCommentResponse
} from '@/store/data'
import { followArticleAuthor } from '@/store/actions'
import { http } from '@/utils'
import { useDispatch } from 'react-redux'
import { AxiosError } from 'axios'

type Props = {
  // data 表示：要回复的评论
  data: ArtComment
  // art_id 表示：文章id
  art_id: string
  onClose: (commentId: string, total: number) => void
  onReplyThumbsUp: (id: string, is_liking: boolean) => void
}

const Reply = ({ data, art_id, onClose, onReplyThumbsUp }: Props) => {
  const [originComment, setOriginComment] = useState(data)
  const { com_id, aut_name, is_liking, like_count, aut_id, is_followed } =
    originComment
  const [commentOpen, setCommentOpen] = useState({
    visible: false,
    id: com_id
  })
  const [comment, setComment] = useState({} as ArticleComment)
  const dispatch = useDispatch()

  useEffect(() => {
    const loadDdata = async () => {
      const res = await http.get<ArticleCommentResponse>('/comments', {
        params: {
          type: 'c',
          source: com_id
        }
      })
      // console.log(res)
      setComment(res.data.data)
    }
    loadDdata()
  }, [com_id])

  // 展示评论窗口
  const onComment = () => {
    setCommentOpen({
      visible: true,
      id: com_id
    })
  }

  // 关闭评论窗口
  const onCloseComment = () => {
    setCommentOpen({
      ...commentOpen,
      visible: false
    })
  }

  // 对评论进行回复
  const onSendComment = async (content: string) => {
    // console.log('onSendComment', content, data.com_id, art_id)
    const res = await http.post<AddCommentReplyResp>('/comments', {
      target: com_id,
      content,
      art_id
    })

    setComment({
      ...comment,
      total_count: comment.total_count + 1,
      results: [res.data.data.new_obj, ...comment.results]
    })

    // 关闭回复（带有文本框的抽屉）窗口
    onCloseComment()
  }

  // 对回复点赞
  const onThumbsUp = async (id: string, is_liking: boolean) => {
    if (is_liking) {
      // 取消点赞
      await http.delete(`/comment/likings/${id}`)
    } else {
      // 点赞
      await http.post('/comment/likings', {
        target: id
      })
    }

    const like_count = is_liking ? -1 : 1

    setComment({
      ...comment,
      results: comment.results.map(item => {
        if (item.com_id === id) {
          return {
            ...item,
            is_liking: !is_liking,
            like_count: item.like_count + like_count
          }
        }
        return item
      })
    })
  }

  const onOriginThumbsUp = () => {
    onReplyThumbsUp(com_id, is_liking)

    const likeCount = is_liking ? -1 : 1
    // 修改数据
    setOriginComment({
      ...originComment,
      is_liking: !is_liking,
      like_count: like_count + likeCount
    })
  }

  const onFollow = async () => {
    try {
      await dispatch(followArticleAuthor(aut_id, is_followed))
      Toast.show(is_followed ? '取消关注' : '已关注')
      setOriginComment({
        ...originComment,
        is_followed: !is_followed
      })
    } catch (e) {
      const error = e as AxiosError<{ message: string }>
      Toast.show({
        content: error.response?.data?.message,
        duration: 1000
      })
    }
  }

  // 关闭对评论进行回复的抽屉
  // 此时，需要将当前评论的总数量传递给父组件
  const onBackToArticle = () => {
    onClose(originComment.com_id, comment.total_count)
  }

  const { results, total_count } = comment

  return (
    <div className={styles.root}>
      <div className="reply-wrapper">
        <NavBar className="transparent-navbar" onBack={onBackToArticle}>
          {total_count}条回复
        </NavBar>

        {/* 要回复的评论 */}
        <div className="origin-comment">
          <CommentItem
            type="origin"
            {...originComment}
            onFollow={onFollow}
            onThumbsUp={onOriginThumbsUp}
          />
        </div>

        <div className="reply-list">
          <div className="reply-header">全部回复</div>
          {results?.length > 0 ? (
            results.map(item => (
              <CommentItem
                type="reply"
                key={item.com_id}
                {...item}
                onThumbsUp={() => onThumbsUp(item.com_id, item.is_liking)}
              />
            ))
          ) : (
            <NoneComment />
          )}
        </div>

        <CommentFooter
          placeholder="去评论"
          type="reply"
          onComment={onComment}
          attitude={is_liking ? 1 : 0}
          onLike={onOriginThumbsUp}
        />
      </div>

      {/* 回复文本框对应的抽屉 */}
      <Popup
        className="drawer"
        position="bottom"
        visible={commentOpen.visible}
        onMaskClick={onCloseComment}
        // onOpenChange={onCloseComment}
      >
        <div className="drawer-sidebar-wrapper">
          {commentOpen.visible && (
            <CommentInput
              name={aut_name}
              onClose={onCloseComment}
              onComment={onSendComment}
            />
          )}
        </div>
      </Popup>
    </div>
  )
}

export default Reply
