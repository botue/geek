import React, { useRef, useEffect } from 'react'
import throttle from 'lodash/throttle'

import styles from './index.module.scss'

type Props = {
  root: HTMLDivElement
  height: number
  offset: number
  children: React.ReactNode
}

const Sticky = ({ root, height, offset = 0, children }: Props) => {
  const placeholderRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!root) return

    const placeholderDOM = placeholderRef.current!
    const containerDOM = containerRef.current!

    const onScroll = throttle(() => {
      const { top } = placeholderDOM.getBoundingClientRect()
      if (top <= offset) {
        containerDOM.style.position = 'fixed'
        containerDOM.style.top = `${offset}px`
        placeholderDOM.style.height = `${height}px`
      } else {
        containerDOM.style.position = 'static'
        placeholderDOM.style.height = '0px'
      }
    }, 100)
    root.addEventListener('scroll', onScroll)
    return () => {
      root.removeEventListener('scroll', onScroll)
    }
  }, [root, offset, height])

  return (
    <div className={styles.root}>
      {/* 占位元素 */}
      <div ref={placeholderRef} className="sticky-placeholder" />
      {/* 导航栏 */}
      <div className="sticky-container" ref={containerRef}>
        {children}
      </div>
    </div>
  )
}

export default Sticky
