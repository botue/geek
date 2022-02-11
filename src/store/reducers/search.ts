type Article = {
  art_id: string
  aut_id: string
  aut_name: string
  comm_count: number
  pubdate: string
  title: string
  cover: { type: number; images: string[] }
}

type SearchState = {
  suggestion: string[]
  searchResult: {
    page: number
    per_page: number
    total_count: number
    results: Article[]
  }
}

const initialState = {
  suggestion: [],
  searchResult: {
    page: 1,
    per_page: 10,
    total_count: 0,
    results: []
  }
} as SearchState

// const initialState = {
//   suggestion: [],
//   searchResult: {} as SearchState['searchResult']
// } as SearchState

type SearchAction =
  | {
      type: 'search/getSuggestion'
      payload: string[]
    }
  | {
      type: 'search/getSearchResult'
      payload: {
        page: number
        per_page: number
        total_count: number
        results: Article[]
      }
    }
  | { type: 'search/resetSuggestion' }

const search = (state = initialState, action: SearchAction) => {
  switch (action.type) {
    case 'search/getSuggestion':
      return {
        ...state,
        // 只修改联想内容
        suggestion: action.payload
      }

    case 'search/getSearchResult':
      return {
        ...state,
        // 只修改搜索结果
        searchResult: action.payload
      }

    // 重置联想数据
    case 'search/resetSuggestion':
      return {
        ...state,
        suggestion: []
      }
    default:
      return state
  }
}

export { search }
