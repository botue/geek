import { Input } from 'antd-mobile'
import styles from './index.module.scss'

type Props = {
  extra: string
  onExtra: () => void
  value?: string
  onChange?: (value: string) => void
}

const InputExtra = ({ extra, onExtra, value, onChange }: Props) => {
  return (
    <div className={styles.root}>
      <Input placeholder="请输入验证码" value={value} onChange={onChange} />
      <span className="extra" onClick={onExtra}>
        {extra}
      </span>
    </div>
  )
}

export default InputExtra
