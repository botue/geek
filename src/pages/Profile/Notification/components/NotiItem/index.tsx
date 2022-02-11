import styles from './index.module.scss'

type Props = {
  type?: 'all' | 'comment' | 'system' | 'fans' | 'thumbsup'
  comment_target?: string
  content: string
  create_time: string
  id: string
  title: string
}

const NotiItem = ({
  type,
  comment_target,
  content,
  create_time,
  title
}: Props) => {
  return (
    <div className={styles.root}>
      <span className="time">{create_time}</span>
      <div className="user">
        <span>{title}</span>
        <span className="content">{content}</span>
      </div>
      {type !== 'fans' && <p className="comment-target">{comment_target}</p>}
    </div>
  )
}

export default NotiItem
