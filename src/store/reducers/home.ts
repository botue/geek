// 排序的工具函数
import sortBy from 'lodash/sortBy'

import type { Channel } from '../types'

// 文章列表项
type Article = {
  art_id: string
  aut_id: string
  aut_name: string
  comm_count: number
  pubdate: string
  title: string
  cover: { type: number; images: string[] }
}

type HomeState = {
  channelActiveIndex: number
  channels: Channel[]
  restChannels: Channel[]

  /**
   * 所有频道的文章数据
   */
  articles: {
    /**
     * 因为不确定频道id，所以，使用 索引签名 来作为属性类型
     */
    [channelId: number]: {
      prevTime: string
      list: Article[]
    }
  }
}

// 创建该操作的默认值
const initialState = {
  // 频道列表数据
  channels: [],
  // 推荐频道
  restChannels: [],
  // 文章列表数据
  // { 频道id: 频道id的文章数据 }
  articles: {},
  // 频道高亮索引
  channelActiveIndex: 0,
} as HomeState

export type HomeType =
  | { type: 'home/getMyChannels'; payload: Channel[] }
  | { type: 'home/getRestChannels'; payload: Channel[] }
  | { type: 'home/addChannel'; payload: number }
  | { type: 'home/deleteChannel'; payload: Channel }
  | { type: 'home/selectTab'; payload: number }
  | {
      type: 'home/getArticles'
      payload: { channelId: number; prevTime: string; list: Article[] }
    }
  | {
      type: 'home/getMoreArticles'
      payload: { channelId: number; prevTime: string; list: Article[] }
    }
  | {
      type: 'home/updateCommentMount'
      payload: {
        channelId: number
        articleId: string
        comm_count: number
      }
    }

const home = (state = initialState, action: HomeType): HomeState => {
  switch (action.type) {
    // 获取我的频道数据
    case 'home/getMyChannels':
      return {
        ...state,
        channels: action.payload,
      }

    // 获取剩余的频道数据（推荐频道）
    case 'home/getRestChannels':
      return {
        ...state,
        restChannels: action.payload,
      }

    // 添加频道
    case 'home/addChannel':
      // 先找到要删除的项
      // 注意：使用数组的 find 方法时，是有可能找不到元素的，因此， find 方法的返回值类型中
      //      会包含 undefined
      //      但是，此处，我们很确定要删除的频道，一定能找到。
      //      所以，此处使用 ! 非空断言，来排除掉 undefined 的情况
      const deletedChannel = state.restChannels.find(
        item => item.id === action.payload
      )!
      return {
        ...state,
        // 删除推荐频道中 id 为 payload 的项
        restChannels: state.restChannels.filter(
          item => item.id !== action.payload
        ),
        // 添加到我的频道数据中
        channels: [...state.channels, deletedChannel],
      }

    // 删除频道
    case 'home/deleteChannel':
      return {
        ...state,
        // 我的频道
        channels: state.channels.filter(item => item.id !== action.payload.id),
        // 推荐频道数据
        restChannels: sortBy([...state.restChannels, action.payload], 'id'),
        // restChannels: [...state.restChannels, action.payload].sort(
        //   (a, b) => a.id - b.id
        // )
      }

    // 切换频道高亮
    case 'home/selectTab':
      return {
        ...state,
        // 频道高亮索引
        channelActiveIndex: action.payload,
      }

    // 文章数据 - 覆盖数据
    case 'home/getArticles':
      return {
        ...state,
        articles: {
          ...state.articles,
          [action.payload.channelId]: {
            // 上一次的时间戳
            prevTime: action.payload.prevTime,
            // 文章列表
            list: action.payload.list,
            // list: [...action.payload.list, ...state.articles[action.payload.channelId].list]
          },
        },
      }

    // 获取更多文章数据 - 追加数据
    case 'home/getMoreArticles':
      let channelId = action.payload.channelId
      const oldList = state.articles[channelId]?.list ?? []
      return {
        ...state,
        // 只修改 articles 这一个数据
        articles: {
          ...state.articles,
          // 只修改当前 频道 的文章数据
          [channelId]: {
            // 上一次的时间戳
            prevTime: action.payload.prevTime,
            // 文章列表
            // list: [...原来的文章列表数据, ...action.payload.list]
            list: [...oldList, ...action.payload.list],
          },
        },
      }

    case 'home/updateCommentMount':
      const updateChannelId = action.payload.channelId
      const articleId = action.payload.articleId
      return {
        ...state,
        articles: {
          ...state.articles,
          [updateChannelId]: {
            ...state.articles[updateChannelId],
            list: state.articles[updateChannelId].list.map(item => {
              if (item.art_id === articleId) {
                return {
                  ...item,
                  comm_count: action.payload.comm_count,
                }
              }
              return item
            }),
          },
        },
      }
    default:
      return state
  }
}

export { home }
