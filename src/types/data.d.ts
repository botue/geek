// 公共可复用的泛型工具类型

/**
 * 请求响应的顶层结构
 */
export type ApiResponse<T> = {
  data: T
  message: string
}

/**
 * 基于 page 分页的列表的结构
 */
export type PageResult<T> = {
  page: number
  per_page: number
  results: T[]
  total_count: number
}

// ----

export type Token = {
  token: string
  refresh_token: string
}

export type Channel = {
  id: number
  name: string
}

export type MoreAction = {
  visible: boolean
  articleId: string
  channelId: number
}

export type Ariticle = {
  art_id: string
  title: string
  aut_id: string
  aut_name: string
  comm_count: string
  pubdate: string
  cover: {
    type: number
    images: string[]
  }
}

export type Articles = {
  [index: number]: {
    timestamp: string
    list: Ariticle[]
  }
}

export type HomeType = {
  userChannels: Channel[]
  allChannels: Channel[]
  moreAction: MoreAction
  articles: Articles
}

export type ArticlePayload = {
  channelId: number
  timestamp: string
  list: Ariticle[]
}

export type User = {
  id: string
  name: string
  photo: string
  art_count: number
  follow_count: number
  fans_count: number
  like_count: number
}

export type Profile = {
  id: string
  photo: string
  name: string
  mobile: string
  gender: number
  birthday: string
  intro: string
}

export type UserFigure = {
  fans_count: number
  read_count: number
}

export type UserAnnouncement = {
  id: number
  title: string
  pubdate: string
}

export type FollowInfo = {
  id: string
  name: string
  photo: string
  fans_count: number
  mutual_follow: boolean
  is_followed?: boolean
}

export type ProfileType = {
  user: User
  profile: Profile
  figure: UserFigure
  announcement: UserAnnouncementPage
  article: ArticlePage
  following: FollowInfoPage
  follower: FollowInfoPage
  notification: NotificationPage
}

export type SearchType = {
  // 存放推荐的结果
  suggestions: string[]
  // 存放历史记录
  histories: string[]
  // 存放搜索的结果
  results: Ariticle[]
}

export type Detail = {
  art_id: string
  title: string
  pubdate: string
  aut_id: string
  content: string
  aut_name: string
  aut_photo: string
  is_followed: boolean
  is_collected: boolean
  attitude: number
  comm_count: number
  read_count: number
  like_count: number
}

export type Comment = {
  aut_id: string
  aut_name: string
  aut_photo: string
  com_id: string
  content: string
  is_followed: boolean
  is_top: boolean
  is_liking: boolean
  like_count: number
  pubdate: string
  reply_count: number
}

export type CommentType = {
  end_id: string
  last_id: string
  total_count: number
  results: Comment[]
}

export type ArticleType = {
  // 文章详情信息
  detail: Detail
  // 评论信息
  comment: CommentType
}

export type FeedbackMenuItem = {
  id: number
  title: string
}

export type ChatMessage = {
  type: string
  text: string
}

export type Notification = {
  id: string
  title: string
  content: string
  create_time: string
  comment_content: string
  comment_target: string
}

export type UserAnnouncementPage = PageResult<UserAnnouncement>
export type ArticlePage = PageResult<Ariticle>
export type FollowInfoPage = PageResult<FollowInfo>
export type NotificationPage = PageResult<Notification>

// ---------------- 响应数据中 data 字段的类型 ---------------------

export type TokenRes = ApiResponse<Token>
export type UserRes = ApiResponse<User>
export type ProfileRes = ApiResponse<Profile>
export type DetailRes = ApiResponse<Detail>
export type CommentTypeRes = ApiResponse<CommentType>
export type SearchResultRes = ApiResponse<ArticlePage>
export type UserAnnouncementRes = ApiResponse<UserAnnouncementPage>
export type FollowInfoRes = ApiResponse<FollowInfoPage>
export type NotificationRes = ApiResponse<NotificationPage>
export type UserFigureRes = ApiResponse<UserFigure>

export type SuggestListRes = ApiResponse<{ options: string[] }>
export type ChannelListRes = ApiResponse<{ channels: Channel[] }>

export type ArticleListRes = ApiResponse<{
  pre_timestamp: string
  results: Ariticle[]
}>

export type NewCommentRes = ApiResponse<{
  com_id: string
  target: string
  new_obj: Comment
  art_id?: string
}>

// ---------------- 请求携带参数的类型 ---------------------

/**
 * 请求分页数据的参数
 */
export type PaginationParams = {
  page: number
  per_page: number
}

export type SearchParams = PaginationParams & { q: string }

export type GetNotificationParams = PaginationParams & { type: string }

export type AddChannelParams = {
  channels: Channel[]
}

export type GetArticleListParams = {
  timestamp: string
  channel_id: number
}

export type TargetIdParams = {
  target: string
}

export type LikeArticleParams = TargetIdParams
export type LikeCommentParams = TargetIdParams
export type CollectArticleParams = TargetIdParams
export type FollowArticleParams = TargetIdParams
export type FollowParams = TargetIdParams

export type ReportArticleParams = TargetIdParams & {
  type: number
}

export type NewCommentParams = TargetIdParams & {
  content: string
  art_id?: string
}

export type GetCommentListParams = {
  type: 'a' | 'c'
  source: string
  offset?: string
}
