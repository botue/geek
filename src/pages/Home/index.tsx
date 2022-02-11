import { useState, useEffect, useRef } from 'react'
import { Popup, Tabs } from 'antd-mobile'
import { useHistory, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getMyChannels, selectTab } from '@/store/actions'

import Icon from '@/components/Icon'
import Channels from './components/Channels'
import ArticleList from './components/ArticleList'

import styles from './index.module.scss'
import { AppState } from '@/store'

export type Props = {
  prevRoute?: {
    prevPathname: string
    params: {
      [k in string]: string
    }
  }
}

const Home = ({ prevRoute }: Props) => {
  const location = useLocation()
  const history = useHistory()
  // 拿到dispatch
  const dispatch = useDispatch()
  // 拿 redux 中的频道数据
  const { channels, channelActiveIndex } = useSelector(
    (state: AppState) => state.home
  )
  const [open, setOpen] = useState(false)
  const prevRouteRef = useRef(prevRoute)

  // 进入页面时，获取频道数据
  useEffect(() => {
    if (location.pathname !== '/home/index') return
    dispatch(getMyChannels())
  }, [dispatch, location.pathname])

  // 关闭 channels
  const onClose = () => setOpen(false)

  // 切换 tab 时，更新 redux 中的状态
  const onTabChange = (key: string) => {
    dispatch(selectTab(+key))

    // 切换 tabs 时，重置数据
    prevRouteRef.current = {
      prevPathname: '',
      params: {},
    }
  }

  return (
    <div className={styles.root}>
      <Tabs
        className="tabs"
        activeKey={channelActiveIndex + ''}
        onChange={onTabChange}
      >
        {channels.map(item => (
          <Tabs.Tab title={item.name} key={item.id + ''} forceRender>
            <ArticleList
              activeId={channelActiveIndex}
              channelId={item.id}
              detailParams={{
                isMatch:
                  prevRouteRef.current?.prevPathname?.startsWith('/article') ??
                  false,
                params: prevRouteRef.current?.params ?? {},
              }}
            />
          </Tabs.Tab>
        ))}
      </Tabs>

      <div className="tabs-opration">
        <Icon type="iconbtn_search" onClick={() => history.push('/search')} />
        <Icon type="iconbtn_channel" onClick={() => setOpen(true)} />
      </div>

      <Popup position="left" className="channel-popup" visible={open}>
        <Channels onClose={onClose} />
      </Popup>
    </div>
  )
}

export default Home
