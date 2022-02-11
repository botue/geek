import React, { ReactElement, useEffect, useRef } from 'react'
import { RouteProps, Route, useLocation, matchPath } from 'react-router-dom'
import styles from './index.module.scss'

export const PreviousRoute = ({ children, ...rest }: RouteProps) => {
  const prevPathRef = useRef('')
  const location = useLocation()

  useEffect(() => {
    prevPathRef.current = location.pathname
  }, [location.pathname])

  return (
    <Route
      {...rest}
      children={props => {
        const child = children as ReactElement
        const isMatch = props.match !== null
        const matched = matchPath(prevPathRef.current, '/article/:id')

        const childWithPrevPathname = React.cloneElement(child, {
          prevRoute: {
            prevPathname: prevPathRef.current,
            params: matched?.params ?? {},
          },
        })

        return (
          <div
            className={styles.root}
            style={{ display: isMatch ? 'block' : 'none' }}
          >
            {childWithPrevPathname}
          </div>
        )
      }}
    />
  )
}
