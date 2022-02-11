import { useEffect } from 'react'
import { useHistory, useLocation } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { InfiniteScroll, NavBar } from 'antd-mobile'

import { getUserArticleList } from '@/store/actions'
import ArticleItem from '@/components/ArticleItem'

import styles from './index.module.scss'
import { AppState } from '@/store'

type Path = '/article/collections' | '/user/histories' | '/user/articles'
const dataRecord: {
  [key: string]: { title: string; path: Path }
} = {
  '1': { title: '我的收藏', path: '/article/collections' },
  '2': { title: '阅读历史', path: '/user/histories' },
  '3': { title: '我的作品', path: '/user/articles' }
}

const Articles = () => {
  const location = useLocation()

  const search = new URLSearchParams(location.search)
  const type = search.get('type')!
  const history = useHistory()
  // dispatch
  const dispatch = useDispatch()
  // 是否下拉刷新中的状态
  // 获取 redux 中的状态
  const { userArticleList } = useSelector((state: AppState) => state.profile)

  const { title, path } = dataRecord[type]

  // 根据当前频道id获取文章数据
  const { page, per_page, total_count, results } = userArticleList[path]

  useEffect(() => {
    if (results.length !== 0) return
    dispatch(getUserArticleList(path, 1))
  }, [dispatch, results.length, path])

  const loadMore = async () => {
    await dispatch(getUserArticleList(path, page + 1))
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
      <NavBar onBack={() => history.go(-1)}>{title}</NavBar>
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

export default Articles
