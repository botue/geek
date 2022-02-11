import { NavBar, Tabs } from 'antd-mobile'
import { useHistory, useLocation } from 'react-router-dom'

import styles from './index.module.scss'

import Followed from './components/Followed'

const Fans = () => {
  const history = useHistory()
  const location = useLocation()

  const search = new URLSearchParams(location.search)
  const type = search.get('type')!

  return (
    <div className={styles.root}>
      <NavBar onBack={() => history.go(-1)}>关注/粉丝</NavBar>
      <Tabs className="tabs" defaultActiveKey={type}>
        <Tabs.Tab title="我的关注" key="followings">
          <Followed type="followings" />
        </Tabs.Tab>
        <Tabs.Tab title="我的粉丝" key="followers">
          <Followed type="followers" />
        </Tabs.Tab>
      </Tabs>
    </div>
  )
}

export default Fans
