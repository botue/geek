import { PullToRefresh, InfiniteScroll } from 'antd-mobile'
import { useDispatch, useSelector } from 'react-redux'

import {
  getArticles,
  getMoreArticles,
  updateCommentMount,
} from '@/store/actions'

// import MoreAction from '../MoreAction'
import ArticleItem from '@/components/ArticleItem'

import styles from './index.module.scss'
import { useHistory, useLocation } from 'react-router'
import { AppState } from '@/store'
import { useEffect, useRef } from 'react'

type Props = {
  channelId: number
  activeId: number
  detailParams: {
    isMatch: boolean
    params: {
      [k in string]: string
    }
  }
}

// 该组件会接受到两个属性，分别是：
// channelId -> 频道的 id 值
// activeId -> 当前选中的频道 id 值
const ArticleList = ({ channelId, activeId, detailParams }: Props) => {
  const loaction = useLocation()
  const history = useHistory()
  // dispatch
  const dispatch = useDispatch()
  // 是否下拉刷新中的状态
  // 获取 redux 中的状态
  const { articles } = useSelector((state: AppState) => state.home)

  // 根据当前频道id获取文章数据
  const channelArticle = articles[channelId] ?? {}
  const { prevTime, list } = channelArticle
  const isUpdatedCommentMount = useRef(false)

  useEffect(() => {
    const update = async () => {
      // 如果是从详情页面过来的，需要更新评论数量
      if (
        channelId === activeId &&
        detailParams.isMatch &&
        !isUpdatedCommentMount.current
      ) {
        isUpdatedCommentMount.current = true
        await dispatch(updateCommentMount(channelId, detailParams.params.id))

        setTimeout(() => {
          isUpdatedCommentMount.current = false
        }, 0)
      }
    }
    update()
  }, [channelId, activeId, detailParams, dispatch])

  const loadMore = async () => {
    await dispatch(getMoreArticles(channelId, prevTime || +new Date() + ''))
  }

  // 下拉刷新文章列表
  const onRefresh = async () => {
    await dispatch(getArticles(channelId, +new Date() + ''))
  }

  // 渲染文章列表
  const renderArticleList = () => {
    // 如果没有列表数据，直接返回 null，表示不渲染任何内容
    if (!list) return null

    // 有数据，再渲染列表
    return list.map(item => {
      const {
        art_id,
        /* aut_id,*/ aut_name,
        comm_count,
        cover: { type, images },
        pubdate,
        title,
      } = item

      const articleItemProps = {
        type,
        title,
        aut_name,
        comm_count,
        pubdate,
        images,
        isLogin: false,
      }
      return (
        <div
          key={art_id}
          className="article-item"
          onClick={() => history.push(`/article/${art_id}`)}
        >
          {/* 文章列表中的每一项 */}
          <ArticleItem {...articleItemProps} />
        </div>
      )
    })
  }

  return (
    <div
      className={styles.root}
      style={{ display: activeId === channelId ? 'block' : 'none' }}
    >
      {/* 文章列表 */}
      <div className="articles">
        <PullToRefresh onRefresh={onRefresh}>
          {/* 渲染文章列表 */}
          {renderArticleList()}

          {/* channelId === activeId 阻止非当前 tab 加载数据 */}
          <InfiniteScroll
            hasMore={
              prevTime !== null &&
              channelId === activeId &&
              loaction.pathname === '/home/index'
            }
            loadMore={loadMore}
          />
        </PullToRefresh>
      </div>

      {/* 举报 */}
      {/* <MoreAction visible={false} /> */}
    </div>
  )
}

export default ArticleList
