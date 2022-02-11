import type { AppThunkAction } from '@/store'
import { http } from '@/utils'

// 接口返回的数据类型
type Suggestion = {
  message: string
  data: {
    options: string[]
  }
}

// 获取联想内容
const getSuggestion = (q: string): AppThunkAction => {
  return async dispatch => {
    const res = await http.get<Suggestion>('/suggestion', {
      params: {
        q
      }
    })

    let { options } = res.data.data
    if (options[0] === null) {
      options = []
    }

    dispatch({ type: 'search/getSuggestion', payload: options })
  }
}

// 搜索结果的类型
type Article = {
  art_id: string
  aut_id: string
  aut_name: string
  comm_count: number
  pubdate: string
  title: string
  cover: { type: number; images: string[] }
}

type SearchResult = {
  message: string
  data: {
    page: number
    per_page: number
    total_count: number
    results: Article[]
  }
}

// 获取搜索结果
const getSearchResult = (q: string): AppThunkAction => {
  return async dispatch => {
    const res = await http.get<SearchResult>('/search', {
      params: {
        q
      }
    })

    dispatch({ type: 'search/getSearchResult', payload: res.data.data })
  }
}

// 重置联想内容
const resetSuggestion = () => ({ type: 'search/resetSuggestion' })

export { getSuggestion, getSearchResult, resetSuggestion }
