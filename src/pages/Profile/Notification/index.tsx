import { NavBar, Tabs } from 'antd-mobile'
import { useHistory } from 'react-router-dom'

import styles from './index.module.scss'

import ListAll from './components/ListAll'

const Notification = () => {
  const history = useHistory()

  return (
    <div className={styles.root}>
      <NavBar onBack={() => history.go(-1)}>消息通知</NavBar>
      <Tabs className="tabs">
        <Tabs.Tab title="全部" key="all">
          <ListAll type="all" />
        </Tabs.Tab>
        <Tabs.Tab title="系统通知" key="system">
          <ListAll type="system" />
        </Tabs.Tab>
        <Tabs.Tab title="评论" key="comment">
          <ListAll type="comment" />
        </Tabs.Tab>
        <Tabs.Tab title="粉丝" key="fans">
          <ListAll type="fans" />
        </Tabs.Tab>
        <Tabs.Tab title="点赞" key="thumbsup">
          <ListAll type="thumbsup" />
        </Tabs.Tab>
      </Tabs>
    </div>
  )
}

export default Notification
