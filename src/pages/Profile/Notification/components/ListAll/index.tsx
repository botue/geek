import { List, InfiniteScroll } from 'antd-mobile'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import styles from './index.module.scss'
import { getUserNotification } from '@/store/actions'

import NotiItem from '../NotiItem'
import noComment from '@/assets/none.png'
import { AppState } from '@/store'

const ListAll = ({
  type
}: {
  type: 'all' | 'comment' | 'thumbsup' | 'fans' | 'system'
}) => {
  const dispatch = useDispatch()
  const { userNotification1 } = useSelector((state: AppState) => state.profile)
  const { page, results, total_count } = userNotification1[type]

  useEffect(() => {
    if (results.length > 0) return
    dispatch(getUserNotification(type, 1))
  }, [dispatch, type, results.length])

  const loadMore = async () => {
    await dispatch(getUserNotification(type, page + 1))
  }

  const hasMore = page * 10 < total_count

  return (
    <List className={styles.root}>
      {results.map(item => (
        <List.Item key={item.id}>
          <NotiItem type={type} {...item} />
        </List.Item>
      ))}

      <InfiniteScroll hasMore={hasMore} loadMore={loadMore}>
        <div className="no-data">
          <img src={noComment} alt="" />
          <p className="no-comment">暂无数据</p>
        </div>
      </InfiniteScroll>
    </List>
  )
}

export default ListAll
