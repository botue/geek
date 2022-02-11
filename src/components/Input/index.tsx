import classnames from 'classnames'
import React, { InputHTMLAttributes } from 'react'

import styles from './index.module.scss'

// 组件的 props 类型
type Props = {
  extra?: string
  onExtraClick?: () => void
  className?: string
  dom?: React.RefObject<HTMLInputElement>
} & InputHTMLAttributes<HTMLInputElement>

// 使用接口
// interface Props extends InputHTMLAttributes<HTMLInputElement> {
//   extra?: string
//   onExtraClick?: () => void
//   className?: string
//   dom?: React.RefObject<HTMLInputElement>
// }

const Input = ({ extra, onExtraClick, className, dom, ...rest }: Props) => {
  return (
    <div className={styles.root}>
      <input
        className={classnames('geek-input', className)}
        {...rest}
        ref={dom}
      />
      {extra && (
        <span className="extra-text" onClick={onExtraClick}>
          {extra}
        </span>
      )}
    </div>
  )
}

// Input.propTypes = {
//   extra: Types.string,
//   onExtraClick: Types.func,
//   className: Types.string
// }

export default Input
