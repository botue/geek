import { Route, useHistory, useLocation } from 'react-router-dom'
import { TabBar } from 'antd-mobile'
import styles from './index.module.scss'

import Icon from '@/components/Icon'
import AuthRoute from '@/components/AuthRoute'
// import { KeepAlive } from '@/components/KeepAlive'
import { PreviousRoute } from '@/components/PreviousRoute'

// 导入页面组件，配置路由
import Home from '../Home'
import Question from '../Question'
import Video from '../Video'
import Profile from '../Profile'

const tabs = [
  { path: '/home/index', icon: 'iconbtn_home', text: '首页' },
  { path: '/home/question', icon: 'iconbtn_qa', text: '问答' },
  { path: '/home/video', icon: 'iconbtn_video', text: '视频' },
  { path: '/home/profile', icon: 'iconbtn_mine', text: '我的' },
]

const Layout = () => {
  const history = useHistory()
  const location = useLocation()

  const changeActive = (path: string) => {
    history.push(path)
  }

  return (
    <div className={styles.root}>
      <PreviousRoute exact path="/home/index">
        <Home></Home>
      </PreviousRoute>
      <Route path="/home/question">
        <Question></Question>
      </Route>
      <Route path="/home/video">
        <Video></Video>
      </Route>
      <AuthRoute path="/home/profile">
        <Profile></Profile>
      </AuthRoute>

      <TabBar
        className="tab-bar"
        activeKey={location.pathname}
        onChange={key => changeActive(key)}
      >
        {tabs.map(item => (
          <TabBar.Item
            key={item.path}
            icon={active => (
              <Icon
                type={active ? `${item.icon}_sel` : item.icon}
                className="tab-bar-item-icon"
              />
            )}
            title={item.text}
          />
        ))}
      </TabBar>
    </div>
  )
}

export default Layout
