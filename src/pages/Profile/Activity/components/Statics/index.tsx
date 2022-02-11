import Icon from '@/components/Icon'
import { AppState } from '@/store'
import { getUserFigure } from '@/store/actions'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './index.module.scss'

const Statics = () => {
  const dispatch = useDispatch()
  const { userFigure } = useSelector((state: AppState) => state.profile)

  useEffect(() => {
    dispatch(getUserFigure())
  }, [dispatch])

  return (
    <div className={styles.root}>
      <div className="statics-list">
        <div className="card">
          <p>
            <span>粉丝数</span>
            <Icon className="right-arrow" type="iconbtn_right" />
          </p>
          <p>
            <span>{userFigure.fans_count}</span>
            <span>人</span>
          </p>
        </div>
        <div className="card">
          <p>
            <span>阅读数</span>
          </p>
          <p>
            <span>{userFigure.read_count}</span>
            <span>次</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Statics
