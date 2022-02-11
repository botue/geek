import { AppState } from '@/store'
import { getUserFans } from '@/store/actions'
import { List, Button, InfiniteScroll } from 'antd-mobile'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import styles from './index.module.scss'

const Followed = ({ type }: { type: 'followings' | 'followers' }) => {
  const dispatch = useDispatch()
  const { userFans } = useSelector((state: AppState) => state.profile)

  const { page, results, total_count } = userFans[type]

  useEffect(() => {
    if (results.length > 0) return
    dispatch(getUserFans(type, 1))
  }, [dispatch, type, results.length])

  const loadMore = async () => {
    await dispatch(getUserFans(type, 1))
  }

  const hasMore = page * 10 < total_count

  return (
    <List className={styles.root}>
      {results.map(item => (
        <List.Item key={item.id}>
          <div className="fans-item">
            <img src={item.photo} alt="" />
            <div className="user-info">
              <span>{item.name}</span>
              <span className="count">粉丝数：{item.fans_count} 人</span>
            </div>
            <Button className="follow-btn">
              {item.mutual_follow ? '取消关注' : '关注'}
            </Button>
          </div>
        </List.Item>
      ))}

      <InfiniteScroll hasMore={hasMore} loadMore={loadMore} />
    </List>
  )
}

export default Followed
