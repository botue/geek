import { Router, Route, Redirect, Switch } from 'react-router-dom';

import { history } from '@/utils';
import AuthRoute from '@/components/AuthRoute';
import { KeepAlive } from './components/KeepAlive';

import Login from './pages/Login';
import Layout from './pages/Layout';
import ProfileEdit from './pages/Profile/Edit';
import Search from './pages/Search';
import SearchResult from './pages/Search/Result';
import Article from './pages/Article';
import ProfileChat from './pages/Profile/Chat';
import Feedback from './pages/Profile/Feedback';
import UserActivity from './pages/Profile/Activity';
import UserFans from './pages/Profile/Fans';
import UserArticles from './pages/Profile/Articles';
import UserNotification from './pages/Profile/Notification';
import NotFound from './pages/NotFound';

// const UserArticleList = lazy(() => import('@/pages/Profile/Article'))
// const UserFans = lazy(() => import('@/pages/Profile/Fans'))
// const UserNotification = lazy(() => import('@/pages/Profile/Notification'))

const App = () => {
  return (
    <Router history={history}>
      <div className="app">
        <KeepAlive activePath="/home" exact path="/home">
          <Layout />
        </KeepAlive>
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/home/index" />} />
          <Route
            exact
            path="/home"
            render={() => <Redirect to="/home/index" />}
          />
          <Route path="/login">
            <Login />
          </Route>
          <AuthRoute path="/profile/edit">
            <ProfileEdit />
          </AuthRoute>
          <Route exact path="/search">
            <Search />
          </Route>
          <Route path="/search/result">
            <SearchResult />
          </Route>
          <Route path="/article/:id">
            <Article />
          </Route>
          <Route path="/chat">
            <ProfileChat />
          </Route>
          <AuthRoute path="/profile/feedback">
            <Feedback />
          </AuthRoute>
          <AuthRoute path="/profile/activity">
            <UserActivity />
          </AuthRoute>
          <AuthRoute path="/profile/fans">
            <UserFans />
          </AuthRoute>
          <AuthRoute path="/profile/article">
            <UserArticles />
          </AuthRoute>
          <AuthRoute path="/profile/notification">
            <UserNotification />
          </AuthRoute>

          {/* 放在路由配置的最后，用来在路由不存在时，展示 404 页面 */}
          {/* path="*" 表示匹配所有路由 */}
          <Route
            path="*"
            render={(props) => {
              // 注意：此处需要将 /home 排除掉，因为 Home 对应的路由没有放在 Switch 中
              //      所以，路由匹配时，会全部匹配一次，当匹配到 Switch 内部时，此处，就会匹配成功
              //      而我们不希望此处的 * 来匹配 Home
              //      因此，此处将 /home 排除掉
              if (props.location.pathname.startsWith('/home')) {
                return null;
              }
              return <NotFound />;
            }}
          ></Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
