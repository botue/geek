import React, { useState, useRef, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { Popup, Toast, NavBar, InfiniteScroll } from 'antd-mobile'

import dayjs from 'dayjs'
import DOMPurify from 'dompurify'
import hljs from 'highlight.js'
import 'highlight.js/styles/vs2015.css'
import ContentLoader from 'react-content-loader'

import Icon from '@/components/Icon'
import Sticky from '@/components/Sticky'
import NoneComment from '@/components/NoneComment'
import CommentItem from './components/CommentItem'
import CommentInput from './components/CommentInput'
import CommentFooter from './components/CommentFooter'

import Reply from './components/Reply'
import Share from './components/Share'

import styles from './index.module.scss'
import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
// throttle 节流函数
import throttle from 'lodash/throttle'

import {
  getArticleById,
  getArticleComment,
  getMoreArticleComments,
  followArticleAuthor,
  collectArticle,
  likeArticle,
  sendComment,
  updateCommentCount,
  likeComment,
} from '@/store/actions'
import { AppState } from '@/store'
import { ArtComment } from '@/store/data'
import { AxiosError } from 'axios'

// 创建枚举，来表示评论类型
enum CommentType {
  Article = 'a',
  Comment = 'c',
}

const Article = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  // 文章评论抽屉的展示或隐藏
  const [commentOpen, setCommentOpen] = useState(false)
  const [replyOpen, setReplyOpen] = useState<{
    visible: boolean
    data: ArtComment
  }>({
    // 表示是否展示抽屉
    visible: false,
    // 表示给抽屉传递的额外数据
    data: {} as ArtComment,
  })
  const [shareOpen, setShareOpen] = useState(false)
  const [isArticleLoading, setIsArticleLoading] = useState(true)

  const [showNavAuthor, setShowNavAuthor] = useState(false)
  const authorRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const commentRef = useRef<HTMLDivElement>(null)
  // 是否展示评论内容
  const isShowComment = useRef(false)

  // 控制加载更多评论
  const loadStateRef = useRef(false)

  // 从 redux 中获取到文章详情
  const { info, comment } = useSelector<AppState, AppState['article']>(
    state => state.article
  )

  // list 列表
  const { id } = useParams<{ id: string }>()

  // 获取文章详情
  useEffect(() => {
    const loadData = async () => {
      // 发送请求，获取获取文章详情
      await dispatch(getArticleById(id))
      // 文章详情加载完成后，将 加载中状态设置为 false
      setIsArticleLoading(false)
    }
    loadData()
  }, [dispatch, id])

  // 获取评论数据
  useEffect(() => {
    dispatch(getArticleComment(CommentType.Article, id))
    // dispatch(getArticleComment('a', id))
  }, [dispatch, id])

  // 处理文章内容中的代码高亮
  useEffect(() => {
    if (isArticleLoading) return

    const dgHtml = document.querySelector('.dg-html')!
    const codes = dgHtml.querySelectorAll('pre code')

    hljs.configure({
      // 忽略警告
      ignoreUnescapedHTML: true,
    })

    if (codes.length > 0) {
      codes.forEach(block => {
        const element = block as HTMLElement
        hljs.highlightElement(element)
      })
      return
    }

    const pre = dgHtml.querySelectorAll('pre')
    if (pre.length > 0) {
      pre.forEach(block => {
        hljs.highlightElement(block)
      })
    }
  }, [isArticleLoading])

  // 导航栏中展示作者信息
  useEffect(() => {
    // 如果文章加载中，此时，页面中没有文章详情的 DOM 结构
    // 所以，如果加载中，直接 return 即可
    if (isArticleLoading) return

    const wrapperDOM = wrapperRef.current!

    // 创建一个节流函数
    const handleScroll = throttle(() => {
      const { bottom } = authorRef.current!.getBoundingClientRect()
      // 44 是 NavBar 的高度，因为 NavBar 会挡住页面内容，所以，此处得减去它的高度
      if (bottom - 44 <= 0) {
        setShowNavAuthor(true)
      } else {
        setShowNavAuthor(false)
      }
    }, 200)

    wrapperDOM.addEventListener('scroll', handleScroll)
    return () => wrapperDOM.removeEventListener('scroll', handleScroll)
  }, [isArticleLoading])

  const onCloseReplyWithUpdate = (commentId: string, total: number) => {
    // 修改redux中的评论列表数据
    dispatch(updateCommentCount(commentId, total))
    onCloseReply()
  }
  const onCloseReply = () => {
    setReplyOpen({
      ...replyOpen,
      visible: false,
    })
  }
  const onCloseComment = () => {
    setCommentOpen(false)
  }

  // 加载更多评论数据
  const loadMoreComments = async () => {
    // last_id
    const { last_id } = comment

    if (loadStateRef.current) return
    loadStateRef.current = true
    await dispatch(getMoreArticleComments(CommentType.Article, id, last_id!))
    loadStateRef.current = false
  }

  // 关注 or 取消关注 -- 作者
  const onFollow = async () => {
    try {
      await dispatch(followArticleAuthor(info.aut_id, info.is_followed))
      Toast.show(info.is_followed ? '取消关注' : '已关注')
    } catch (e) {
      const error = e as AxiosError<{ message: string }>
      Toast.show({
        content: error.response?.data?.message,
        duration: 1000,
      })
    }
  }

  // 收藏 or 取消收藏 -- 文章
  const onCollected = async () => {
    await dispatch(collectArticle(info.art_id, info.is_collected))
    Toast.show(info.is_collected ? '取消收藏' : '已收藏')
  }

  // 点赞 或 取消点赞 -- 文章
  const onLike = async () => {
    await dispatch(likeArticle(info.art_id, info.attitude))
    Toast.show(info.attitude ? '取消点赞' : '已点赞')
  }

  // 展示 or 隐藏评论内容
  const onShowComment = () => {
    const wrapperDOM = wrapperRef.current!
    const commentDOM = commentRef.current!
    const { top } = commentDOM.getBoundingClientRect()

    if (!isShowComment.current) {
      // 跳转到评论位置
      wrapperDOM.scrollTo(0, top - 44 + wrapperDOM.scrollTop)
      isShowComment.current = true
    } else {
      // 跳转到页面顶部
      wrapperDOM.scrollTo(0, 0)
      isShowComment.current = false
    }
  }

  // 打开文章评论的抽屉
  const onComment = () => setCommentOpen(true)

  // 对文章发表评论
  const onInsertComment = async (content: string) => {
    await dispatch(sendComment(info.art_id, content))
    // 关闭评论抽屉
    onCloseComment()
  }

  // 打开评论的回复抽屉
  const onOpenReply = (data: ArtComment) => {
    setReplyOpen({
      visible: true,
      data,
    })
  }

  // 对评论点赞
  const onThumbsUp = async (id: string, is_liking: boolean) => {
    await dispatch(likeComment(id, is_liking))
  }

  // 文章
  const {
    art_id,
    attitude,
    // aut_id,
    aut_name,
    aut_photo,
    comm_count: articleCommCount,
    content,
    is_collected,
    is_followed,
    like_count,
    pubdate,
    read_count,
    title,
  } = info

  // 文章评论
  const { results, end_id, last_id } = comment
  const comm_count = Math.max(articleCommCount, results.length)
  // 是否有更多评论
  const hasMoreComment = end_id !== last_id

  const date = dayjs(pubdate).format('YYYY-MM-DD')

  const renderArticle = () => {
    if (isArticleLoading) {
      // loading
      return (
        <ContentLoader
          speed={2}
          width={375}
          height={230}
          viewBox="0 0 375 230"
          backgroundColor="#f3f3f3"
          foregroundColor="#ecebeb"
        >
          {/* https://skeletonreact.com/ */}
          <rect x="16" y="8" rx="3" ry="3" width="340" height="10" />
          <rect x="16" y="26" rx="0" ry="0" width="70" height="6" />
          <rect x="96" y="26" rx="0" ry="0" width="50" height="6" />
          <rect x="156" y="26" rx="0" ry="0" width="50" height="6" />
          <circle cx="33" cy="69" r="17" />
          <rect x="60" y="65" rx="0" ry="0" width="45" height="6" />
          <rect x="304" y="65" rx="0" ry="0" width="52" height="6" />
          <rect x="16" y="114" rx="0" ry="0" width="340" height="15" />
          <rect x="263" y="208" rx="0" ry="0" width="94" height="19" />
          <rect x="16" y="141" rx="0" ry="0" width="340" height="15" />
          <rect x="16" y="166" rx="0" ry="0" width="340" height="15" />
        </ContentLoader>
      )
    }

    // 文章详情
    return (
      <div className="wrapper" ref={wrapperRef}>
        <div className="article-wrapper">
          <div className="header">
            <h1 className="title">{title}</h1>

            <div className="info">
              <span>{date}</span>
              <span>{read_count} 阅读</span>
              <span>{comm_count} 评论</span>
            </div>

            <div className="author" ref={authorRef}>
              <img src={aut_photo} alt="" />
              <span className="name">{aut_name}</span>
              <span
                className={classNames('follow', is_followed ? 'followed' : '')}
                onClick={onFollow}
              >
                {is_followed ? '已关注' : '关注'}
              </span>
            </div>
          </div>

          <div className="content">
            <div
              className="content-html dg-html"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(content),
              }}
            />
            <div className="date">发布文章时间：{date}</div>
          </div>
        </div>

        <div className="comment" ref={commentRef}>
          <Sticky root={wrapperRef.current!} height={51} offset={44}>
            <div className="comment-header">
              <span>全部评论（{comm_count}）</span>
              <span>{like_count} 点赞</span>
            </div>
          </Sticky>
          {comm_count === 0 ? (
            <NoneComment />
          ) : (
            <div className="comment-list">
              {results.map(item => {
                return (
                  <CommentItem
                    key={item.com_id}
                    {...item}
                    onOpenReply={() => onOpenReply(item)}
                    onThumbsUp={() => onThumbsUp(item.com_id, item.is_liking)}
                  />
                )
              })}

              {/* 加载更多评论数据 */}
              <InfiniteScroll
                hasMore={hasMoreComment}
                loadMore={loadMoreComments}
              />
            </div>
          )}
        </div>
      </div>
    )
  }

  // 渲染评论抽屉
  const renderCommentDrawer = () => {
    return (
      <Popup
        className="comment-popup"
        position="bottom"
        visible={commentOpen}
        onMaskClick={onCloseComment}
      >
        <div className="comment-popup-wrapper">
          {commentOpen && (
            <CommentInput
              onClose={onCloseComment}
              onComment={onInsertComment}
            />
          )}
        </div>
      </Popup>
    )
  }

  // 渲染回复抽屉
  const renderReplyDrawer = () => {
    return (
      <Popup
        className="reply-popup"
        position="right"
        visible={replyOpen.visible}
        onMaskClick={onCloseReply}
        forceRender
      >
        <div className="reply-popup-wrapper">
          {replyOpen.visible && (
            <Reply
              // data 就是你要回复的评论数据
              data={replyOpen.data}
              art_id={art_id}
              onClose={onCloseReplyWithUpdate}
              onReplyThumbsUp={onThumbsUp}
            />
          )}
        </div>
      </Popup>
    )
  }

  // 渲染更多操作抽屉
  const renderMoreDrawer = () => {
    return (
      <Popup
        position="bottom"
        visible={shareOpen}
        onMaskClick={() => setShareOpen(false)}
      >
        <Share onClose={() => setShareOpen(false)} />
      </Popup>
    )
  }

  return (
    <div className={styles.root}>
      <div className="root-wrapper">
        <NavBar
          onBack={() => history.go(-1)}
          right={
            <span onClick={() => setShareOpen(true)}>
              <Icon type="icongengduo" />
            </span>
          }
        >
          {showNavAuthor && (
            <div className="nav-author">
              <img src={aut_photo} alt="" />
              <span className="name">{aut_name}</span>
              <span
                onClick={onFollow}
                className={classNames('follow', is_followed ? 'followed' : '')}
              >
                {is_followed ? '已关注' : '关注'}
              </span>
            </div>
          )}
        </NavBar>
        {/* 文章详情和评论 */}
        {renderArticle()}

        {/* 底部评论栏 */}
        <CommentFooter
          comm_count={comm_count}
          placeholder={comm_count === 0 ? '抢沙发' : '去评论'}
          attitude={attitude}
          is_collected={is_collected}
          onShare={() => setShareOpen(true)}
          onComment={onComment}
          onLike={onLike}
          onCollected={onCollected}
          onShowComment={onShowComment}
        />
      </div>

      {/* 评论 */}
      {renderCommentDrawer()}
      {/* 回复 */}
      {renderReplyDrawer()}
      {/* 更多 */}
      {renderMoreDrawer()}
    </div>
  )
}

export default Article
