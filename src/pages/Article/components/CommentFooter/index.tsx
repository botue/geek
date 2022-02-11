import Icon from '@/components/Icon'
import styles from './index.module.scss'

type Props = {
  comm_count?: number
  attitude?: number
  is_collected?: boolean
  placeholder?: string
  onComment?: () => void
  onLike?: () => void
  onCollected?: () => void
  onShare?: () => void
  onShowComment?: () => void
  // normal 普通评论
  // reply 回复评论
  type?: 'normal' | 'reply'
}

const CommentFooter = ({
  comm_count,
  attitude,
  is_collected,
  placeholder,
  onComment,
  onLike,
  onCollected,
  onShare,
  onShowComment,
  type = 'normal'
}: Props) => {
  return (
    <div className={styles.root}>
      <div className="input-btn" onClick={onComment}>
        <Icon type="iconbianji" />
        <span>{placeholder}</span>
      </div>

      {type === 'normal' && (
        <>
          <div className="action-item" onClick={onShowComment}>
            <Icon type="iconbtn_comment" />
            <p>评论</p>
            {!!comm_count && <span className="bage">{comm_count}</span>}
          </div>
          <div className="action-item" onClick={onLike}>
            <Icon
              type={attitude === 1 ? 'iconbtn_like_sel' : 'iconbtn_like2'}
            />
            <p>点赞</p>
          </div>
          <div className="action-item" onClick={onCollected}>
            <Icon
              type={is_collected ? 'iconbtn_collect_sel' : 'iconbtn_collect'}
            />
            <p>收藏</p>
          </div>
        </>
      )}

      {type === 'reply' && (
        <div className="action-item" onClick={onLike}>
          <Icon type={attitude === 1 ? 'iconbtn_like_sel' : 'iconbtn_like2'} />
          <p>点赞</p>
        </div>
      )}

      <div className="action-item" onClick={onShare}>
        <Icon type="iconbtn_share" />
        <p>分享</p>
      </div>
    </div>
  )
}

export default CommentFooter
