import { ThunkAction } from "redux-thunk";
import store from '../store';
import {
  Ariticle, ArticlePage, ArticlePayload, Channel, Comment,
  CommentType,
  Detail, FollowInfo, FollowInfoPage, MoreAction, NotificationPage,
  Profile, Token, User, UserAnnouncementPage, UserFigure
} from './data';

// -------------------- Redux Actions ---------------------------

export type LoginAction = {
  type: `login/${'token' | 'logout'}`
  payload: Token
}

export type HomeAction =
  | {
    type: `home/${'saveChannels' | 'saveAllChannels'}`
    payload: Channel[]
  }
  | {
    type: `home/${'saveArticleList' | 'saveMoreArticleList'}`
    payload: ArticlePayload
  }
  | {
    type: 'home/setMoreAction'
    payload: MoreAction
  }

export type ProfileAction =
  | {
    type: 'profile/user'
    payload: User
  }
  | {
    type: 'profile/profile'
    payload: Profile
  }
  | {
    type: 'profile/figure'
    payload: UserFigure
  }
  | {
    type: 'profile/announce',
    payload: UserAnnouncementPage
  }
  | {
    type: 'profile/article',
    payload: ArticlePage
  }
  | {
    type: `profile/${'followings' | 'followers'}`,
    payload: FollowInfoPage
  }
  | {
    type: `profile/${'update_followings' | 'update_followers'}`,
    payload: FollowInfo[]
  }
  | {
    type: 'profile/notification'
    payload: NotificationPage
  }
  | {
    type: `profile/${'reset_notification' | 'reset_article'}`
  }

export type SearchAction =
  | {
    type: `search/${'saveSuggestions' | 'saveHistories'}`
    payload: string[]
  }
  | {
    type: 'search/saveResults'
    payload: Ariticle[]
  }
  | {
    type: `search/${'clearHistories' | 'clearSuggestions'}`
  }

export type ArticleAction =
  | {
    type: 'artcile/saveDetail'
    payload: Detail
  }
  | {
    type: `article/${'saveComment' | 'saveMoreComment'}`
    payload: CommentType
  }
  | {
    type: `article/${'saveNewComment' | 'updateComment'}`
    payload: Comment
  }
  | {
    type: 'article/set_comment',
    payload: Partial<CommentType>
  }

// -----------------------------------------------

// ??????RootState?????????
// typeof: ??????store.getState?????????
// ReturnType ????????????????????????
export type RootState = ReturnType<typeof store.getState>

// R???thunk???action???????????????  void Promise<void>
// S: ???????????????getState???????????????  RootState
// E: extra: ??????????????? any
// A: ????????????Action????????? Action AnyAction [extraProps: string]: any
// ThunkAction<R, S, E, A>
export type RootAction =
  | HomeAction
  | LoginAction
  | ProfileAction
  | SearchAction
  | ArticleAction

export type RootThunkAction = ThunkAction<
  Promise<void>,
  RootState,
  unknown,
  RootAction
>