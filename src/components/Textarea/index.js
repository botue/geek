import classnames from 'classnames'
import { useEffect, useState } from 'react'

import styles from './index.module.scss'

const noop = () => {}

// maxLength = 100 设置默认值
const Textarea = ({
  className,
  maxLength = 100,
  value = '',
  onChange = noop,
  ...rest
}) => {
  // 因为该组件需要拿到输入内容的长度，所以，该组件需要维护自己的状态
  const [text, setText] = useState(value)

  const onTextChange = e => {
    setText(e.target.value)

    onChange(e)
  }

  useEffect(() => {
    setText(value)
  }, [value])

  return (
    <div className={classnames(styles.root, className)}>
      <textarea
        className="textarea"
        maxLength={maxLength}
        value={text}
        onChange={onTextChange}
        {...rest}
      />
      <div className="count">
        {text.length}/{maxLength}
      </div>
    </div>
  )
}

export default Textarea
