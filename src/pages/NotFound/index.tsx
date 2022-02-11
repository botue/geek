import { Link, useHistory } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'

const NotFound = () => {
  const history = useHistory()
  const [time, setTime] = useState(5)
  const timerRef = useRef(-1)

  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      console.log('123')
      setTime(time => time - 1)
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [])

  useEffect(() => {
    if (time < 1) {
      history.replace('/home/index')
    }
  }, [time, history])

  return (
    <div>
      <h1>对不起，你访问的内容不存在...</h1>
      <p>
        {time} 秒后，返回<Link to="/home/index">首页</Link>
      </p>
    </div>
  )
}

export default NotFound
