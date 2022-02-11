import classnames from 'classnames'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

import Icon from '@/components/Icon'
import Image from '@/components/Image'
// import { Image } from 'antd-mobile'

import styles from './index.module.scss'

// 将 dayjs 中的语言设置为中文
dayjs.locale('zh-cn')
// 通过 dayjs 的 extend 方法，来扩展了一个插件
// 插件的作用：可以显示 相对时间
dayjs.extend(relativeTime)

type Props = {
  type: number
  title: string
  images: string[]
  aut_name: string
  comm_count: number
  pubdate: string

  isLogin?: boolean
  onFeedback?: () => void
}

const ArticleItem = ({
  type,
  title,
  images,
  aut_name,
  comm_count,
  pubdate,
  isLogin,
  onFeedback
}: Props) => {
  return (
    <div className={styles.root}>
      <div
        className={classnames(
          'article-content',
          type === 3 ? 't3' : '',
          type === 0 ? 'none-mt' : ''
        )}
      >
        <h3>{title}</h3>
        {type !== 0 && (
          <div className="article-imgs">
            {images.map((item, i) => (
              <div className="article-img-wrapper" key={i}>
                {/* <img src={item} alt="" /> */}
                <Image src={item} />
              </div>
            ))}
          </div>
        )}
      </div>
      <div className={classnames('article-info', type === 0 ? 'none-mt' : '')}>
        <span>{aut_name}</span>
        <span>{comm_count} 评论</span>
        <span>{dayjs().from(pubdate)}</span>
        {isLogin && (
          <span className="close" onClick={onFeedback}>
            <Icon type="iconbtn_essay_close" />
          </span>
        )}
      </div>
    </div>
  )
}

export default ArticleItem
