import { useEffect, memo } from 'react'
import classnames from 'classnames'
import { useState, useRef } from 'react'

import Icon from '../Icon'

import styles from './index.module.scss'

type Props = {
  src: string
  className?: string
}

const Image = memo(({ src, className }: Props) => {
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const imgRef = useRef(null)

  // 图片加载完成
  const onLoad = () => {
    setIsLoading(false)
  }

  // 图片加载失败
  const onError = () => {
    setIsError(true)
  }

  // 渲染 loading or error 占位符
  const renderPlaceholder = () => {
    if (isError) {
      return (
        <div className="image-icon">
          <Icon type="iconphoto-fail" />
        </div>
      )
    }

    if (isLoading) {
      return (
        <div className="image-icon">
          <Icon type="iconphoto" />
        </div>
      )
    }

    return null
  }

  const renderImage = () => {
    if (isError) return null

    return (
      <img
        ref={imgRef}
        data-src={src}
        onLoad={onLoad}
        onError={onError}
        alt=""
      />
    )
  }

  // 图片懒加载
  useEffect(() => {
    const imageObserver = new IntersectionObserver(
      (entries, imgObserver) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const lazyImage = entry.target as HTMLImageElement
            lazyImage.src = lazyImage.dataset.src!

            // 当图片加载完成了，此时，就没有必要再监听图片，因此，取消监听即可
            // 取消监听
            imgObserver.unobserve(lazyImage)
          }
        })
      },
      {
        // 表示 图片加载 百分比，就出发监听。比如，如果为 0 表示刚刚出现图片，就出发监听
        // threshold: [0]
        // 10px 表示提前加载该图片
        rootMargin: '0px 0px 10px 0px'
      }
    )

    imageObserver.observe(imgRef.current!)

    return () => imageObserver.disconnect()
  }, [])

  return (
    <div className={classnames(styles.root, className)}>
      {renderPlaceholder()}
      {renderImage()}
    </div>
  )
})

export default Image
