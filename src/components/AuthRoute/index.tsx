import React from 'react'
import { Route, RouteProps, Redirect } from 'react-router-dom'

import { isAuth } from '@/utils'

/**
  原来：<AuthRoute component={Profile} path="/home/profile" />
  现在：
    <AuthRoute path="/home/profile">
      <Profile />
    </AuthRoute>
 */

const AuthRoute = ({ children, ...rest }: RouteProps) => {
  return (
    <Route
      {...rest}
      render={props => {
        const isLogin = isAuth()
        if (isLogin) {
          return children
        }

        // 未登录
        return (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location.pathname }
            }}
          />
        )
      }}
    />
  )
}

export default AuthRoute
