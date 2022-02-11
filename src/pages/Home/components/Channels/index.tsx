import { useState, useEffect } from 'react'
import classnames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import {
  getChannels,
  addChannel,
  deleteChannel,
  selectTab
} from '@/store/actions'

import Icon from '@/components/Icon'
import styles from './index.module.scss'
import { AppState } from '@/store'
import { Channel } from '@/store/types'

type Props = {
  onClose: () => void
}

const Channels = ({ onClose }: Props) => {
  // 拿到 dispatch
  const dispatch = useDispatch()
  // 拿 redux 中的频道数据
  const { channels, restChannels, channelActiveIndex } = useSelector(
    (state: AppState) => state.home
  )
  const [isEdit, setIsEdit] = useState(false)

  useEffect(() => {
    dispatch(getChannels())
  }, [dispatch])

  // 添加频道
  const onAddChannel = (item: Channel) => {
    dispatch(addChannel(item))
  }

  // 切换编辑状态
  const onChangeEdit = () => {
    setIsEdit(!isEdit)
  }

  // 我的频道点击事件
  const onMyChannelClick = (item: Channel, index: number) => {
    // 判断是否为编辑状态
    if (isEdit) {
      // 要执行的操作：删除
      dispatch(deleteChannel(item))
    } else {
      // 要执行的操作：切换
      dispatch(selectTab(index))
      // 关闭抽屉
      onClose()
    }
  }

  return (
    <div className={styles.root}>
      <div className="channel-header">
        <Icon type="iconbtn_channel_close" onClick={onClose} />
      </div>
      <div className="channel-content">
        <div className={classnames('channel-item', isEdit ? 'edit' : '')}>
          <div className="channel-item-header">
            <span className="channel-item-title">我的频道</span>
            <span className="channel-item-title-extra">点击进入频道</span>
            <span className="channel-item-edit" onClick={onChangeEdit}>
              {isEdit ? '保存' : '编辑'}
            </span>
          </div>
          <div className="channel-list">
            {channels.map((item, index) => {
              return (
                // selected 类名表示选中项高亮
                <span
                  onClick={() => onMyChannelClick(item, index)}
                  key={item.id}
                  className={classnames(
                    'channel-list-item',
                    index === channelActiveIndex ? 'selected' : ''
                  )}
                >
                  {item.name}
                  <Icon type="iconbtn_tag_close" />
                </span>
              )
            })}
          </div>
        </div>

        <div className="channel-item">
          <div className="channel-item-header">
            <span className="channel-item-title">频道推荐</span>
            <span className="channel-item-title-extra">点击添加频道</span>
          </div>
          <div className="channel-list">
            {restChannels.map(item => (
              <span
                key={item.id}
                className="channel-list-item"
                onClick={() => onAddChannel(item)}
              >
                + {item.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Channels
