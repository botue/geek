import { Link } from 'react-router-dom'
import { useEffect } from 'react'
// react-redux 不使用 hooks 时的用法
// connect 是一个高阶组件
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { getProfile } from '@/store/actions'
import type { AppState, AppThunkDispatch } from '@/store'

import Icon from '@/components/Icon'
import styles from './index.module.scss'

type Props = {
  profile?: AppState['profile']['profile']
  onGetProfile?: () => Promise<void>
}

const Profile = ({ profile, onGetProfile }: Props) => {
  const history = useHistory()

  useEffect(() => {
    onGetProfile?.()
  }, [onGetProfile])

  const { photo, name, like_count, follow_count, fans_count, art_count } =
    profile!

  return (
    <div className={styles.root}>
      <div className="profile">
        {/* 个人信息 */}
        <div className="user-info">
          <div className="avatar">
            <img
              src={photo || 'http://toutiao.itheima.net/images/user_head.jpg'}
              alt=""
            />
          </div>
          <div className="user-name text-overflow">{name}</div>
          <Link to="/profile/edit">
            个人信息 <Icon type="iconbtn_right" />
          </Link>
        </div>

        {/* 今日阅读 */}
        <div className="read-info">
          <Icon type="iconbtn_readingtime" />
          今日阅读
          <span>10</span>
          分钟
        </div>

        {/* 动态 - 对应的这一行 */}
        <div className="count-list">
          <div
            className="count-item"
            onClick={() => history.push('/profile/activity')}
          >
            <p>{art_count}</p>
            <p>动态</p>
          </div>
          <div
            className="count-item"
            onClick={() => history.push('/profile/fans?type=followings')}
          >
            <p>{follow_count}</p>
            <p>关注</p>
          </div>
          <div
            className="count-item"
            onClick={() => history.push('/profile/fans?type=followers')}
          >
            <p>{fans_count}</p>
            <p>粉丝</p>
          </div>
          <div className="count-item">
            <p>{like_count}</p>
            <p>被赞</p>
          </div>
        </div>

        {/* 消息通知 - 对应的这一行 */}
        <div className="user-links">
          <div
            className="link-item"
            onClick={() => history.push('/profile/notification')}
          >
            <Icon type="iconbtn_mymessages" />
            <div>消息通知</div>
          </div>
          <div
            className="link-item"
            onClick={() => history.push('/profile/article?type=1')}
          >
            <Icon type="iconbtn_mycollect" />
            <div>收藏</div>
          </div>
          <div
            className="link-item"
            onClick={() => history.push('/profile/article?type=2')}
          >
            <Icon type="iconbtn_history1" />
            <div>浏览历史</div>
          </div>
          <div
            className="link-item"
            onClick={() => history.push('/profile/article?type=3')}
          >
            <Icon type="iconbtn_myworks" />
            <div>我的作品</div>
          </div>
        </div>
      </div>

      {/* 更多服务 */}
      <div className="more-service">
        <h3>更多服务</h3>
        <div className="service-list">
          <div
            className="service-item"
            onClick={() => history.push('/profile/feedback')}
          >
            <Icon type="iconbtn_feedback" />
            <div>用户反馈</div>
          </div>
          <div className="service-item" onClick={() => history.push('/chat')}>
            <Icon type="iconbtn_xiaozhitongxue" />
            <div>小智同学</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// redux 为 组件 提供 状态
const mapStateToProps = (state: AppState) => {
  return {
    profile: state.profile.profile,
  }
}

// redux 为 组件 提供修改状态的函数
const mapDispatchTopProps = (dispatch: AppThunkDispatch) => {
  return {
    onGetProfile: () => dispatch(getProfile()),
  }
}

export default connect(mapStateToProps, mapDispatchTopProps)(Profile)
