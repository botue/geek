import { useState, useRef, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Toast, NavBar, Input, Form, Button } from 'antd-mobile'

import InputExtra from './components/input-extra'
import classNames from 'classnames'

import { useDispatch } from 'react-redux'
import { sendCode, login } from '@/store/actions'

import styles from './index.module.scss'

import { AxiosError } from 'axios'
import { InputRef } from 'antd-mobile/es/components/input'

type LoginForm = {
  mobile: string
  code: string
}

const Login = () => {
  const [form] = Form.useForm<LoginForm>()
  // 获取location
  // 注意：此处的泛型用来为 location.state 指定类型
  //      但是一定要注意：state 可能有值，也可以没有值，所以，它的类型中带有 undefined
  const location = useLocation<{ from: string } | undefined>()

  // 拿到 dispatch 分发动作的函数
  const dispatch = useDispatch()

  // 主动调用 useHistory() 来获取路由的 history 对象
  const history = useHistory()
  // 倒计时的时间，单位是 秒
  const [time, setTime] = useState(0)
  // 定时器 id
  const timerIdRef = useRef(-1)
  // 用来存储手机号码对应的文本框 DOM 元素
  const mobileRef = useRef<InputRef>(null)

  const [, forceUpdate] = useState({})
  // To disable submit button at the beginning.
  useEffect(() => {
    forceUpdate({})
  }, [])

  // 发送请求获取验证码
  const getCode = async () => {
    // 判断剩余秒数，如果剩余秒数小于 0 就允许再次发送
    // 如果剩余秒数大于等于 0 就不允许再次发送
    if (time > 0) return

    // 如果 mobile 没有值，拿到的是 undefined
    const mobile = form.getFieldValue('mobile')
    if (mobile === undefined || form.getFieldError('mobile').length > 0) {
      // 手机号码对应文本框 DOM 元素
      const mobileInputDOM = mobileRef.current
      // focus() 就是用来获得焦点的一个方法，是 DOM 元素自己提供的
      mobileInputDOM?.focus()
      return Toast.show({
        content: '请输入正确的手机号',
        duration: 1000,
      })
    }

    // 将倒计时时间，更新为：60
    setTime(59)
    clearInterval(timerIdRef.current)
    timerIdRef.current = window.setInterval(() => {
      setTime(time => {
        if (time === 1) {
          clearInterval(timerIdRef.current)
        }
        return time - 1
      })
    }, 1000)

    // 手机号码验证成功：
    dispatch(sendCode(mobile))
  }

  const onFinsih = async (values: LoginForm) => {
    try {
      // 此处，使用 await 可以做到：等到 dispatch 分发的异步action执行完成后，
      // 再执行后面的代码
      // dispatch 后会执行一个异步操作
      await dispatch(login(values))

      // 如果异步操作成功了，会执行改代码
      Toast.show({
        content: '登录成功',
        duration: 600,
        afterClose: () => {
          // 清理定时器
          clearInterval(timerIdRef.current)

          // 判断 state 是否有值
          if (location.state?.from) {
            // 重定向过来的，就返回原来的页面
            history.replace(location.state.from)
          } else {
            // 默认，返回首页
            history.replace('/home')
          }
        },
      })
    } catch (e) {
      // 处理 axios 请求的错误
      const error = e as AxiosError<{ message: string }>
      // 如果异步操作失败了，会执行此处的错误处理
      Toast.show({
        content: error.response?.data?.message,
        duration: 1000,
      })
    }
  }

  return (
    <div className={styles.root}>
      {/* 导航栏组件 */}
      <NavBar onBack={() => history.go(-1)} />
      <h1 className="title">账号登录</h1>

      <div className="login-wrap">
        <Form form={form} onFinish={onFinsih}>
          <Form.Item
            name="mobile"
            rules={[
              { required: true, message: '手机号为必填项' },
              {
                pattern: /^1[3-9]\d{9}$/,
                message: '手机号码格式不正确',
              },
            ]}
          >
            <Input placeholder="请输入手机号" ref={mobileRef} />
          </Form.Item>

          <Form.Item
            name="code"
            rules={[
              { required: true, message: '验证码为必填项' },
              {
                pattern: /^\d{6}$/,
                message: '验证码不正确',
              },
            ]}
          >
            <InputExtra
              extra={time <= 0 ? '发送验证码' : `${time}s`}
              onExtra={getCode}
            />
          </Form.Item>
          <Form.Item noStyle shouldUpdate>
            {form => {
              // https://ant-design.gitee.io/components/form-cn/#components-form-demo-inline-login
              // isFieldsTouched(true) 检查是否所有字段都被操作过
              // getFieldsError() 获取所有字段名对应的错误信息
              const disabled =
                !form.isFieldsTouched(true) ||
                form.getFieldsError().filter(({ errors }) => errors.length)
                  .length !== 0

              return (
                <Button
                  block
                  disabled={disabled}
                  type="submit"
                  className={classNames('login-button')}
                >
                  登录
                </Button>
              )
            }}
          </Form.Item>
          <Form.Item noStyle>
            <div
              style={{
                marginTop: 20,
                textAlign: 'center',
              }}
            >
              验证码：246810
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default Login
