import { List } from 'antd-mobile'
import styles from './index.module.scss'

const Announcement = () => {
  return (
    <List className={styles.root}>
      <List.Item description="2021/05/25 16:52:39">
        黑马程序员招新啦, 诚招各路编程高手
      </List.Item>
      <List.Item description="2021/1/25 16:52:39">
        传智教育成为A股中第一支成功IPO的教育产业股
      </List.Item>
      <List.Item description="2021/02/25 08:52:39">
        web前端工程师训练营来袭, 小伙伴们踊跃报名
      </List.Item>
    </List>
  )
}

export default Announcement
