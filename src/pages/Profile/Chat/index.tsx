import { Input, NavBar } from 'antd-mobile'
import classnames from 'classnames'
import io, { Socket } from 'socket.io-client'

import Icon from '../../../components/Icon'

import styles from './index.module.scss'
import { useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { baseURL, getToken } from '@/utils'

const Chat = () => {
  const history = useHistory()
  const [value, setValue] = useState('')
  const [chatList, setChatList] = useState<
    { message: string; type: 'user' | 'xz' }[]
  >([])
  const socketRef = useRef<Socket>()
  const chatListRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 创建 socket 连接
    const socketURL = baseURL!.replace('/v1_0', '')
    // 创建 socket 连接
    const socketio = io(socketURL, {
      query: {
        token: getToken().token,
      },
      transports: ['websocket'],
    })

    // 连接成功
    socketio.on('connect', () => {
      // console.log('连接成功')
      setChatList([
        { message: '你好，我是小智', type: 'xz' },
        { message: '你有什么疑问？', type: 'xz' },
      ])
    })

    // 接收服务器推送过来的消息
    socketio.on('message', e => {
      // console.log('接收到服务器发送的消息：', e)
      setChatList(list => [
        ...list,
        {
          message: e.msg,
          type: 'xz',
        },
      ])
    })

    // 将 socketio 对象存储到 ref 中
    socketRef.current = socketio
  }, [])

  // 只要聊天列表中内容改变，就要让页面滚动最底部，以展示聊天列表中所有的内容
  useEffect(() => {
    chatListRef.current!.scrollTop = chatListRef.current!.scrollHeight
  }, [chatList])

  // 敲回车时，给服务器发送消息
  const onSendMsg = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code !== 'Enter' || value.trim() === '') return

    // 发送消息给服务器
    socketRef.current?.emit('message', {
      msg: value,
      timestamp: +new Date() + '',
    })

    setChatList([
      ...chatList,
      {
        type: 'user',
        message: value,
      },
    ])

    setValue('')
  }

  return (
    <div className={styles.root}>
      <NavBar className="fixed-header" onBack={() => history.go(-1)}>
        小智同学
      </NavBar>

      <div className="chat-list" ref={chatListRef}>
        {chatList.map((item, index) => {
          return (
            <div
              key={index}
              className={classnames(
                'chat-item',
                item.type === 'xz' ? 'self' : 'user'
              )}
            >
              {item.type === 'xz' ? (
                <Icon type="iconbtn_xiaozhitongxue" />
              ) : (
                <img
                  src="http://geek.itheima.net/images/user_head.jpg"
                  alt=""
                />
              )}
              <div className="message">{item.message}</div>
            </div>
          )
        })}
      </div>

      <div className="input-footer">
        <Input
          className="no-border"
          placeholder="请描述您的问题"
          value={value}
          onChange={value => setValue(value)}
          onKeyDown={onSendMsg}
        />
        <Icon type="iconbianji" />
      </div>
    </div>
  )
}

export default Chat
