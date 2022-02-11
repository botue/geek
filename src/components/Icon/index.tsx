import classnames from 'classnames'

// 组件的 props 是一个对象
type Props = {
  type: string
  // 可选属性
  className?: string
  onClick?: () => void
}

// 为 组件 props 指定类型
const Icon = ({ type, className, onClick }: Props) => {
  return (
    <svg
      className={classnames('icon', className)}
      aria-hidden="true"
      onClick={onClick}
    >
      <use xlinkHref={`#${type}`}></use>
    </svg>
  )
}

export default Icon
