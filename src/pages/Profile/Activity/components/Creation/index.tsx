import { useEffect } from 'react'
import { useHistory } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { InfiniteScroll } from 'antd-mobile'

import { getUserArticle } from '@/store/actions'
import ArticleItem from '@/components/ArticleItem'

import styles from './index.module.scss'
import { AppState } from '@/store'

// 该组件会接受到两个属性，分别是：
// channelId -> 频道的 id 值
// activeId -> 当前选中的频道 id 值
const Creation = () => {
  const history = useHistory()
  // dispatch
  const dispatch = useDispatch()
  // 是否下拉刷新中的状态
  // 获取 redux 中的状态
  const { userArticle } = useSelector((state: AppState) => state.profile)

  // 根据当前频道id获取文章数据
  const { page, per_page, total_count, results } = userArticle

  useEffect(() => {
    if (results.length !== 0) return
    dispatch(getUserArticle(1))
  }, [dispatch, results.length])

  const loadMore = async () => {
    await dispatch(getUserArticle(page + 1))
  }

  // 渲染文章列表
  const renderArticleList = () => {
    // 如果没有列表数据，直接返回 null，表示不渲染任何内容
    if (!results) return null

    // 有数据，再渲染列表
    return results.map(item => {
      const {
        art_id,
        /* aut_id,*/ aut_name,
        comm_count,
        cover: { type, images },
        pubdate,
        title
      } = item

      const articleItemProps = {
        type,
        title,
        aut_name,
        comm_count,
        pubdate,
        images,
        isLogin: false
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

  const hasMore = page * per_page < total_count

  return (
    <div className={styles.root}>
      {/* 文章列表 */}
      <div className="articles">
        {/* 渲染文章列表 */}
        {renderArticleList()}

        {/* channelId === activeId 阻止非当前 tab 加载数据 */}
        <InfiniteScroll hasMore={hasMore} loadMore={loadMore} />
      </div>
    </div>
  )
}

export default Creation
