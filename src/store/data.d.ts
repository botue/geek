// 用来存放跟网络请求相关的类型，也就是：接口返回数据的类型
type GeekResponse<T = {}> = {
  message: string
  data: T
}

// 文章详情的类型
export type ArticleInfo = {
  title: string
  content: string
  pubdate: string
  art_id: string
  aut_id: string
  aut_name: string
  aut_photo: string
  is_followed: boolean
  is_collected: boolean
  attitude: number
  like_count: number
  read_count: number
  comm_count: number
}
export type ArticleResponse = GeekResponse<ArticleInfo>

// 文章评论的类型
export type ArticleComment = {
  total_count: number
  end_id: string | null
  last_id: string | null
  results: ArtComment[]
}
export type ArticleCommentResponse = GeekResponse<ArticleComment>

// 文章评论的类型
export type ArtComment = {
  com_id: string
  aut_id: string
  aut_name: string
  aut_photo: string
  like_count: number
  reply_count: number
  pubdate: string
  content: string
  is_liking: boolean
  is_followed: boolean
}
// 文章的评论对应的类型
type AddArticleComment = {
  // 新建评论的 id
  com_id: string
  // 对谁进行了评论，如果是对文章进行评论，那么，就是 文章的id
  target: string
  // 文章id
  new_obj: ArtComment
}
export type AddArticleCommentResp = GeekResponse<AddArticleComment>

// 对评论就行回复
type AddCommentReply = AddArticleComment & {
  art_id: string
}
export type AddCommentReplyResp = GeekResponse<AddCommentReply>

// export type ArticleInfo = {
//   message: string
//   data: {
//     title: string
//     content: string
//     pubdate: string
//     art_id: string
//     aut_id: string
//     aut_name: string
//     aut_photo: string
//     is_followed: boolean
//     is_collected: boolean
//     attitude: number
//     like_count: number
//     read_count: number
//     comm_count: number
//   }
// }
