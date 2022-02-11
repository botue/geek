import { NavBar, Tabs } from 'antd-mobile'
import { useHistory } from 'react-router-dom'

import styles from './index.module.scss'

import Creation from './components/Creation'
import Announcement from './components/Announcement'
import Statics from './components/Statics'
// const tabs = [
//   { title: '作品', key: '1' },
//   { title: '公告', key: '2' },
//   { title: '数据', key: '3' }
// ]

const Activity = () => {
  const history = useHistory()

  return (
    <div className={styles.root}>
      <NavBar onBack={() => history.go(-1)}>我的动态</NavBar>
      <Tabs className="tabs">
        <Tabs.Tab title="作品" key="1">
          <Creation />
        </Tabs.Tab>
        <Tabs.Tab title="公告" key="2">
          <Announcement />
        </Tabs.Tab>
        <Tabs.Tab title="数据" key="3">
          <Statics />
        </Tabs.Tab>
      </Tabs>
    </div>
  )
}

export default Activity
