import { useEffect, useState, useRef } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'

import styles from './index.module.scss'
import React from 'react'

// no operation 没有操作，就是一个空函数
// onChange 的默认值
const noop = () => {}

/**
 * Tabs 组件
 * @param {string | number} activeKey 动态设置 哪个 Tab 选中（高亮）
 * @param {function} onTabChange 点击 tab 时，触发的回调，该回调会通过参数暴露当前高亮的索引
 * @returns React Element React 元素
 *
 * @example
 *
 * <Tabs activeKey={1} onTabChange={index => { ... }} />
 *
 */
const Tabs = ({ activeKey = 0, tabs = [], onTabChange = noop, children }) => {
  const navRef = useRef()
  const lineRef = useRef()

  const [activeIndex, setActiveIndex] = useState(activeKey)

  // 切换tab的事件处理程序
  const changeTab = index => {
    setActiveIndex(index)

    // 将高亮索引暴露给组件使用者
    onTabChange(index)
  }

  // https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html
  // https://github.com/facebook/react/issues/14830
  useEffect(() => {
    setActiveIndex(activeKey)
  }, [activeKey])

  useEffect(() => {
    // TODO: 清理上一次的 animate

    // 拿到高亮的 Tab 项对应的 DOM 元素
    const activeTab = navRef.current.children[activeIndex]

    // 注意：解决动态设置 Tab 高亮时的 Bug
    // 如果没有这句代码，该组件代码会报错：因为此处 activeTab 是 undefined
    // 所以，此处，判断一下，如果 activeTab 是 undefined 就 return 不执行下面的代码
    if (!activeTab) return

    // 获取 高亮 Tab 的宽度
    const activeTabWidth = activeTab.offsetWidth || 60
    // 注意：第一次获取 offsetLeft 值为 0 ，以后每次获取为 8
    //      所以，设置默认值 8，让所有情况下 offsetLeft 值都相同
    const activeOffsetLeft = activeTab.offsetLeft || 8
    // 整个 Tab 的宽度
    const tabWidth = navRef.current.offsetWidth

    // activeOffsetLeft 是带有滚动的距离
    // tabWidth Tab的宽度
    // activeTabWidth 当前要点击的那一项 Tab 的宽度
    const to = activeOffsetLeft - (tabWidth - activeTabWidth) / 2

    // navRef.current.scrollLeft = to
    const from = navRef.current.scrollLeft
    const frames = Math.round((0.2 * 1000) / 16)
    let count = 0
    function animate() {
      navRef.current.scrollLeft += (to - from) / frames

      if (++count < frames) {
        requestAnimationFrame(animate)
      }
    }

    animate()

    // window.innerWidth / 375： 手动处理 JS 移动端适配
    // 说明：15 表示 Line 宽度的一半
    lineRef.current.style.transform = `translateX(${
      activeOffsetLeft + activeTabWidth / 2 - 15 * (window.innerWidth / 375)
    }px)`

    // 注意： 由于 tabs 数据是动态获取的，所以，为了能够在 tabs 数据加载完成后
    //       获取到 tab，所以，此处将 tabs 作为依赖项。
    //       否则，会导致 navRef.current.children[activeIndex] 拿到的是 line 而不是第一个tab
  }, [activeIndex, tabs])

  return (
    <div className={styles.root}>
      <div className="tabs">
        <div className="tabs-wrap">
          <div className="tabs-nav" ref={navRef}>
            {tabs.map((item, index) => (
              <div
                className={classnames(
                  'tab',
                  index === activeIndex ? 'active' : ''
                )}
                key={index}
                onClick={() => changeTab(index)}
              >
                <span>{item.name}</span>
              </div>
            ))}
            <div className="tab-line" ref={lineRef}></div>
          </div>
        </div>

        <div className="tabs-content">
          {React.Children.map(children, child => {
            return React.cloneElement(child, {
              activeId: tabs[activeIndex]?.id || 0
            })
          })}
        </div>
      </div>
    </div>
  )
}

Tabs.propTypes = {
  tabs: PropTypes.array.isRequired,
  children: PropTypes.arrayOf(PropTypes.element),
  onChange: PropTypes.func
}

export default Tabs
