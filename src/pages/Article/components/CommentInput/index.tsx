import React, { useState, useRef, useEffect } from 'react'
import { NavBar, TextArea } from 'antd-mobile'
import styles from './index.module.scss'
import { TextAreaRef } from 'antd-mobile/es/components/text-area'

type Props = {
  name?: string
  // art_id?: string
  onClose?: () => void
  // 修改：参数为 string 类型，也就是拿到 评论的内容
  onComment: (content: string) => void
}

const CommentInput = ({ name, onClose, onComment }: Props) => {
  const [value, setValue] = useState('')
  const txtRef = useRef<TextAreaRef>(null)

  useEffect(() => {
    // 解决页面抖动的问题
    setTimeout(() => {
      txtRef.current?.focus()
    }, 600)
  }, [])

  const onChange = (value: string) => {
    setValue(value)
  }

  return (
    <div className={styles.root}>
      <NavBar
        onBack={onClose}
        right={
          <span className="publish" onClick={() => onComment(value)}>
            发表
          </span>
        }
      >
        {name ? '回复评论' : '评论文章'}
      </NavBar>

      <div className="input-area">
        {name && <div className="at">@{name}:</div>}
        <TextArea
          ref={txtRef}
          placeholder="说点什么~"
          rows={10}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  )
}

export default CommentInput
