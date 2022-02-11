import React from 'react'
import classnames from 'classnames'
import styles from './index.module.scss'

import Icon from '../Icon'

type Props = {
  onClick?: () => void
  // ReactNode 类型表示：任何可以被渲染在 JSX 中的内容，比如，字符串、数组、JSX标签、其他组件 等
  children?: React.ReactNode
  rightContent?: React.ReactNode
  className?: string
}

const NavBar = ({ onClick, children, rightContent, className }: Props) => {
  return (
    <div className={classnames(styles.root, className)}>
      {/* 左侧 */}
      <span className="navbar-left" onClick={onClick}>
        <Icon type="iconfanhui" />
      </span>

      {/* 中间 */}
      <div className="navbar-center">{children}</div>

      {/* 右侧 */}
      <span className="navbar-right">{rightContent}</span>
    </div>
  )
}

export default NavBar
