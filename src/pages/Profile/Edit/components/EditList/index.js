import styles from './index.module.scss'

// 子组件需要接受 onUpdateGender 方法，所以，父组件得提供 onUpdateGender 方法
const EditList = ({ onUpdateGender, onClose, items }) => {
  return (
    <div className={styles.root}>
      {items.map(item => (
        <div
          key={item.value}
          className="list-item"
          onClick={() => onUpdateGender(item.value)}
        >
          {item.text}
        </div>
      ))}

      {/* <div className="list-item" onClick={() => onUpdateGender('0')}>
        男
      </div>
      <div className="list-item" onClick={() => onUpdateGender('1')}>
        女
      </div> */}

      <div className="list-item" onClick={onClose}>
        取消
      </div>
    </div>
  )
}

export default EditList
