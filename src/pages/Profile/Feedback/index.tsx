import { useHistory } from 'react-router-dom'
import { NavBar, ImageUploader, Input, TextArea } from 'antd-mobile'

import styles from './index.module.scss'

const FeedBack = () => {
  const history = useHistory()

  return (
    <div className={styles.root}>
      <NavBar onBack={() => history.go(-1)}>意见反馈</NavBar>

      <div className="wrapper">
        <div className="feedback-item">
          <p className="title">简介</p>
          <div className="textarea-wrap">
            <TextArea
              className="textarea"
              placeholder="请输入"
              maxLength={100}
              showCount
            ></TextArea>
          </div>
          <ImageUploader upload={async () => ({ url: '' })} multiple />
          <p className="image-picker-desc">最多6张，单个图片不超过20M。</p>
        </div>

        <div className="feedback-item">
          <p className="title">联系方式</p>
          <div className="input-phone">
            <Input placeholder="请输入手机号码便于联系（非必填）" />
          </div>
        </div>

        <div className="feedback-item feedback-submit">
          <button>提交反馈</button>
        </div>
      </div>
    </div>
  )
}

export default FeedBack
