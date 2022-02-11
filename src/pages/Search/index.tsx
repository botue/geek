import classnames from 'classnames'
import React, { useEffect, useState /*, useRef*/ } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router'
import { NavBar, Search } from 'antd-mobile'
import { useDebounceFn } from 'ahooks'

import { getSuggestion, resetSuggestion } from '@/store/actions'

import Icon from '@/components/Icon'
import styles from './index.module.scss'
import { AppState } from '@/store'

// 防抖
// import debounce from 'lodash/debounce'

const SEARCH_KEY = 'geek-h5-search_pip__'

const SearchPage = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation()
  const [searchText, setSearchText] = useState('')
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  // const debounceSearchRef = useRef<any>()

  // 获取 redux 中的搜索联想
  const { suggestion } = useSelector<AppState, AppState['search']>(
    state => state.search
  )

  useEffect(() => {
    // 进入页面时，就从本地存储中获取搜索历史记录
    const localSearchHistory = JSON.parse(
      localStorage.getItem(SEARCH_KEY) || '[]'
    ) as string[]

    // 如果本地缓存中有搜索历史记录，就更新到状态中，也就是展示在页面里面
    if (localSearchHistory.length > 0) {
      setSearchHistory(localSearchHistory)
    }
  }, [location])

  useEffect(() => {
    return () => {
      dispatch(resetSuggestion())
    }
  }, [dispatch])

  // // 注意：此处返回的函数 debounceGetSuggest 才是防抖函数
  // const debounceGetSuggest = debounce((value: string) => {
  //   // 发请求获取联想内容
  //   dispatch(getSuggestion(value))
  // }, 1000)

  // if (!debounceSearchRef.current) {
  //   debounceSearchRef.current = debounceGetSuggest
  // }

  // https://ahooks.gitee.io/zh-CN/hooks/side-effect/use-debounce-fn
  const { run: debounceGetSuggest } = useDebounceFn(
    (value: string) => {
      dispatch(getSuggestion(value))
    },
    {
      wait: 500,
    }
  )

  // 搜索文本框内容改变时的回调
  const onSearchChange = (value: string) => {
    setSearchText(value)

    // 如果文本框没有值，不发请求
    if (!value) {
      return dispatch(resetSuggestion())
    }

    // 发请求获取联想内容
    debounceGetSuggest(value)
  }

  const onGoToDetail = (value: string) => {
    history.replace(`/search/result?q=${value}`)

    onSuggestionItemClick(value)
  }
  const onSearch = () => {
    history.replace(`/search/result?q=${searchText}`)

    onSuggestionItemClick(searchText)
  }

  // 将 搜索记录 保存到本地缓存中
  const onSuggestionItemClick = (searchValue: string) => {
    // 将当前被点击项存储到 本地缓存 中
    // 1 从本地缓存中获取到 历史记录
    let localSearchHistory = JSON.parse(
      localStorage.getItem(SEARCH_KEY) || '[]'
    ) as string[]

    if (localSearchHistory.length === 0) {
      // 说明没有任何记录
      localSearchHistory.unshift(searchValue)
    } else {
      // 说明已经有记录
      // 2 判断是否已经搜索过该项内容
      if (localSearchHistory.includes(searchValue)) {
        // 4 如果搜索过，就从数组中移除该项，将该项添加到第一个
        const restArr = localSearchHistory.filter(item => item !== searchValue)
        localSearchHistory = [searchValue, ...restArr]
      } else {
        // 3 如果没有搜索过，此时，只要添加到历史记录中的第一个即可
        localSearchHistory.unshift(searchValue)
      }
    }
    // 5 将处理后的数据存储到本地缓存中
    localStorage.setItem(SEARCH_KEY, JSON.stringify(localSearchHistory))
  }

  // 清除全部
  const onClearAll = () => {
    localStorage.removeItem(SEARCH_KEY)
    setSearchHistory([])
  }

  // 将联想关键词中匹配的内容高亮
  // 接口返回的数据：['1', '101', '1.11', '01', '18']
  /**
   *  1. 拿到第一匹配项的索引（index）
      2. 开启截取字符串，
        2.1 先截取关键字前面的内容： slice(0, index)
        2.2 再截取关键字后面的内容： slice(index + 1)
      3. 将得到的三部分内容，分别是： `前面的内容 关键字 后面的内容` ，展示在页面中即可
   */
  const suggetList = suggestion.map(item => {
    const suggestIndex = item.indexOf(searchText)
    const left = item.slice(0, suggestIndex)
    const right = item.slice(suggestIndex + 1)

    // return [left, searchText, right]
    return {
      left,
      searchText,
      right,
    }
  })
  // console.log(suggetList)

  return (
    <div className={styles.root}>
      <NavBar
        className="navbar"
        onBack={() => {
          history.go(-1)
          dispatch(resetSuggestion())
        }}
        right={
          <span className="search-text" onClick={onSearch}>
            搜索
          </span>
        }
      >
        <Search
          placeholder="请输入关键字搜索"
          value={searchText}
          onChange={onSearchChange}
          onSearch={onSearch}
          onClear={() => {
            setSearchText('')
            // 清空联想内容
            dispatch(resetSuggestion())
          }}
        />
      </NavBar>

      {searchHistory.length > 0 && (
        <div
          className="history"
          style={{
            display: suggestion.length > 0 ? 'none' : 'block',
          }}
        >
          <div className="history-header">
            <span>搜索历史</span>
            <span onClick={onClearAll}>
              <Icon type="iconbtn_del" />
              清除全部
            </span>
          </div>

          <div className="history-list">
            {searchHistory.map((item, i) => (
              <span
                className="history-item"
                key={i}
                onClick={() => onGoToDetail(item)}
              >
                {item}
                <span className="divider"></span>
              </span>
            ))}
          </div>
        </div>
      )}

      <div
        className={classnames(
          'search-result',
          suggestion.length > 0 ? 'show' : ''
        )}
      >
        {suggetList.map((item, index) => (
          <div
            key={index}
            className="result-item"
            onClick={() =>
              onGoToDetail(item.left + item.searchText + item.right)
            }
          >
            <Icon className="icon-search" type="iconbtn_search" />
            <div className="result-value">
              {item.left}
              <span>{item.searchText}</span>
              {item.right}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SearchPage
