import { http } from '@/utils'
import differenceBy from 'lodash/differenceBy'
import type { AppThunkAction } from '../index'
import type { Channel } from '@/store/types'

// 频道对应的 key
const CHANNEL_KEY = 'geek-h5-home-channel_pip__'

// 获取我的频道数据
const getMyChannels = (): AppThunkAction => {
  return async (dispatch, getState) => {
    const {
      login: { token },
    } = getState()

    // 1. 判断用户是否登录
    if (token) {
      // 2. 如果登录了，直接发请求获取该登录用户的频道列表数据
      const res = await http.get('/user/channels')
      // console.log('登陆了', res)
      const { channels } = res.data.data
      dispatch({ type: 'home/getMyChannels', payload: channels })
    } else {
      // 3. 如果没有登录：
      //    1. 先判断本地缓存中是否有频道数据
      const localChannels = JSON.parse(
        localStorage.getItem(CHANNEL_KEY) || '[]'
      )
      if (localChannels.length > 0) {
        //    2. 如果有，直接返回本地缓存中的频道数据
        dispatch({ type: 'home/getMyChannels', payload: localChannels })
      } else {
        //    3. 如果没有，发请求获取默认频道列表数据
        // 说明：该接口不管是否登录，都可以获取到频道数据
        //   1 如果你登录了，该接口返回的就是：登录用户的频道列表数据
        //   2 如果没有登录，该接口返回的就是：默认的频道列表数据
        const res = await http.get('/user/channels')
        const { channels } = res.data.data
        dispatch({ type: 'home/getMyChannels', payload: channels })

        // 因为没有登录，所以，我们在本地缓存中存储一份数据
        // 将来当未登录用户对频道进行添加、删除操作时，就修改本地的数据
        localStorage.setItem(CHANNEL_KEY, JSON.stringify(channels))
      }
    }
  }
}

// 获取所有的频道数据
const getChannels = (): AppThunkAction => {
  return async (dispatch, getState) => {
    // console.log('getChannels')
    const res = await http.get('/channels')
    const { channels: allChannels } = res.data.data
    // console.log('所有频道数据：', res)
    // 从 所有频道列表数据 中过滤出 我的频道 中没有的数据，再存储到 redux 中
    const {
      home: { channels },
    } = getState()

    // as typeof channels
    // 表示 先通过 typeof channels 来拿到 channels 的 TS 类型 Channel[]
    // 再 as 成 Channel[]
    let allChannel = allChannels as typeof channels

    // 从 allChannels 数组中排除掉 channels 中的数据
    const restChannels = differenceBy(allChannel, channels, 'id')
    // console.log(restChannles)
    dispatch({ type: 'home/getRestChannels', payload: restChannels })
  }
}

// 添加频道

const addChannel = (channel: Channel): AppThunkAction => {
  return async (dispatch, getState) => {
    const {
      login: { token },
    } = getState()
    if (token) {
      // 登录
      // 修改接口中的数据
      await http.patch('/user/channels', {
        channels: [{ id: channel.id }],
      })

      // // 更新redux状态，让页面更新
      // dispatch({ type: 'home/addChannel', payload: channel.id })
    } else {
      // 未登录
      // 修改本地存储中的数据
      const myChannels = JSON.parse(localStorage.getItem(CHANNEL_KEY) || '[]')

      // console.log('本地的 channel', myChannels)

      // 因为本地存储中，频道数据存的是 我的频道 数据，
      // 往本地存储中的 频道数据 中添加一项
      // 而本地没有存储 推荐频道 数据的，所以，不需要再本地存储中对推荐频道数据做处理
      // 所以，推荐频道数据的处理只在 redux 中更新即可
      const newMyChannels = [...myChannels, channel]
      // 将处理后的新我的频道，更新到本地存储中
      localStorage.setItem(CHANNEL_KEY, JSON.stringify(newMyChannels))

      // // 更新redux状态，让页面更新
      // dispatch({ type: 'home/addChannel', payload: channel.id })
    }

    // 更新redux状态，让页面更新
    dispatch({ type: 'home/addChannel', payload: channel.id })
  }
}

// 删除频道
const deleteChannel = (channel: Channel): AppThunkAction => {
  return async (dispatch, getState) => {
    const {
      login: { token },
    } = getState()
    if (token) {
      // 登录
      // 改接口
      await http.delete(`/user/channels/${channel.id}`)
    } else {
      // 未登录
      // 该本地缓存
      const myChannels = JSON.parse(
        localStorage.getItem(CHANNEL_KEY) || '[]'
      ) as Channel[]
      const newMyChannels = myChannels.filter(item => item.id !== channel.id)
      localStorage.setItem(CHANNEL_KEY, JSON.stringify(newMyChannels))
    }

    // 更新 redux 状态
    dispatch({ type: 'home/deleteChannel', payload: channel })
  }
}

// 切换频道高亮状态
// 注意：此 action 不涉及任何异步操作，所以，直接使用普通的对象形式的 action 即可
const selectTab = (payload: number) => ({ type: 'home/selectTab', payload })

// 获取某个频道的文章列表数据
// getArticlesByChannelId
// 第一个参数：表示 频道 id
// 第二个参数：表示 时间戳，第一次获取数据时，为当前时间；以后的每次获取数据都是前一次返回的 pre_timestamp
const getArticles = (channelId: number, timestamp: string): AppThunkAction => {
  return async dispatch => {
    // console.log(channelId)
    const res = await http.get('/articles', {
      params: {
        channel_id: channelId,
        timestamp,
      },
    })

    // 为接口返回的两个数据重命名
    const { pre_timestamp: prevTime, results: list } = res.data.data

    // 将数据存储到 redux 中
    dispatch({
      type: 'home/getArticles',
      payload: { prevTime, list, channelId },
    })
  }
}

// 触底获取更多文章数据
const getMoreArticles = (
  channelId: number,
  timestamp: string
): AppThunkAction => {
  return async dispatch => {
    const res = await http.get('/articles', {
      params: {
        channel_id: channelId,
        timestamp,
      },
    })

    // 为接口返回的两个数据重命名
    const { pre_timestamp: prevTime, results: list } = res.data.data

    // 将数据存储到 redux 中
    dispatch({
      type: 'home/getMoreArticles',
      payload: { prevTime, list, channelId },
    })
  }
}

// 文章列表页面 - 更新评论数量
export const updateCommentMount = (
  channelId: number,
  articleId: string
): AppThunkAction => {
  return async (dispatch, getState) => {
    const {
      article: {
        info: { comm_count },
      },
    } = getState()
    dispatch({
      type: 'home/updateCommentMount',
      payload: {
        channelId,
        articleId,
        comm_count,
      },
    })
  }
}

export {
  getMyChannels,
  getChannels,
  addChannel,
  deleteChannel,
  selectTab,
  getArticles,
  getMoreArticles,
}
