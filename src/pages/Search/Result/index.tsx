import { useHistory, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { NavBar } from 'antd-mobile'
import { getSearchResult } from '@/store/actions'

import ArticleItem from '@/components/ArticleItem'

import styles from './index.module.scss'
import { useEffect } from 'react'
import { AppState } from '@/store'

const Result = () => {
  const history = useHistory()
  const location = useLocation()
  const dispatch = useDispatch()

  const { searchResult } = useSelector<AppState, AppState['search']>(
    state => state.search
  )
  const params = new URLSearchParams(location.search)
  const q = params.get('q') ?? ''

  useEffect(() => {
    dispatch(getSearchResult(q))
  }, [dispatch, q])

  const onToAritcleDetail = (art_id: string) => {
    history.push(`/article/${art_id}`)
  }

  const { results } = searchResult

  return (
    <div className={styles.root}>
      <NavBar
        onBack={() =>
          history.replace('/search', {
            isFromResult: true
          })
        }
      >
        搜索结果
      </NavBar>
      <div className="article-list">
        {results?.map((item, index) => {
          const {
            aut_name,
            comm_count,
            pubdate,
            title,
            art_id,
            cover: { type, images }
          } = item

          const articleItemProps = {
            type,
            title,
            aut_name,
            comm_count,
            pubdate,
            images
          }

          return (
            <div key={index} onClick={() => onToAritcleDetail(art_id)}>
              <ArticleItem {...articleItemProps} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Result
