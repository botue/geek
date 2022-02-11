import { useState, useEffect } from 'react'
import { Toast, TextArea, Input, NavBar } from 'antd-mobile'

import styles from './index.module.scss'

type Props = {
  config: {
    text: string
    value: string
  }
  onUpdate: (name: string, value: string | number) => void
  onClose: () => void
}

const EditInput = ({ config, onUpdate, onClose }: Props) => {
  const [value, setValue] = useState(config.value || '')

  useEffect(() => {
    if (config.value !== undefined) {
      setValue(config.value)
    }
  }, [config.value])

  const onUpdateName = () => {
    const name = value.trim()
    if (name === '') return Toast.show('昵称不能为空')

    // 调用父组件中的方法，来更新昵称
    onUpdate(config.text === '昵称' ? 'name' : 'intro', value)
  }

  return (
    <div className={styles.root}>
      <NavBar
        onBack={onClose}
        className="navbar"
        right={
          <span className="commit-btn" onClick={onUpdateName}>
            提交
          </span>
        }
      >
        编辑{config.text}
      </NavBar>

      <div className="edit-input-content">
        <h3>{config.text}</h3>

        {config.text === '昵称' ? (
          <div className="input-wrap">
            <Input
              value={value}
              onChange={value => {
                setValue(value)
              }}
              placeholder="请输入"
              maxLength={20}
            />
          </div>
        ) : (
          <TextArea
            className="textarea"
            placeholder="请输入"
            showCount
            maxLength={99}
            value={value}
            onChange={value => setValue(value)}
          />
        )}
      </div>
    </div>
  )
}

export default EditInput
