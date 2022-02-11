import { List, DatePicker, Popup, Dialog, NavBar } from 'antd-mobile'
import classNames from 'classnames'
import { useHistory } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import dayjs from 'dayjs'
import { useSelector, useDispatch } from 'react-redux'
import { updateUser, updateUserPhoto, getUserInfo } from '@/store/actions'

import styles from './index.module.scss'

// 导入 性别 对应的抽屉内容
import EditList from './components/EditList'
// 导入 昵称或简介对应的抽屉内容
import EditInput from './components/EditInput'

import { removeToken } from '@/utils'
import { AppState } from '@/store'

const Item = List.Item
const { show } = Dialog

// 修改头像对应的数据：
const photoItems = [
  { text: '拍照', value: 'picture' },
  { text: '本地选择', value: 'local' },
]
// 修改性别对应的数据：
const genderItems = [
  { text: '男', value: 0 },
  { text: '女', value: 1 },
]

const ProfileEdit = () => {
  const history = useHistory()
  const dispatch = useDispatch()

  // 创建一个用来获取 file 的ref对象
  const fileRef = useRef<HTMLInputElement>(null)

  // 个人资料的状态
  const { userInfo } = useSelector<AppState, AppState['profile']>(
    state => state.profile
  )
  const [showBirthday, setShowBirthday] = useState(false)

  // 性别抽屉的展示或隐藏
  const [listDrawer, setListDrawer] = useState({
    open: false,
    type: 'photo',
  })

  // 昵称或简介对应的状态
  const [inputDrawer, setInputDrawer] = useState({
    open: false,
    // 类型：如果是昵称，值为：name；如果是简介，值为：intro
    type: 'name',
  })

  // 进入页面发送请求
  useEffect(() => {
    try {
      dispatch(getUserInfo())
    } catch (e) {}
  }, [dispatch])

  // 修改头像的事件
  const onUpdatePhoto = () => {
    fileRef.current?.click()
  }
  // input[type="file"] 标签的 change 事件
  // 通过事件对象，可以拿到选择的照片
  const onPhotoChagne = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files![0]
      const formData = new FormData()
      formData.append('photo', file)

      dispatch(updateUserPhoto(formData))
    } catch {
    } finally {
      // 关闭抽屉
      onGenderClose()
    }
  }

  // 列表项的点击事件
  const onListOpen = (type: 'gender' | 'photo') => {
    setListDrawer({
      open: true,
      type,
    })
  }

  // 输入框的点击事件
  const onInputOpen = (type: 'name' | 'intro') => {
    setInputDrawer({
      open: true,
      type,
    })
  }

  const onUpdateUser = async (name: string, value: string | number) => {
    try {
      dispatch(updateUser({ [name]: value }))
      onInputClose()
      onGenderClose()
    } catch {}
  }

  // 修改生日
  const onBirthdayChange = async (date: Date) => {
    const birthday = dayjs(date).format('YYYY-MM-DD')

    try {
      dispatch(updateUser({ birthday }))
      setShowBirthday(false)
    } catch {}
  }

  // 关闭昵称或简介的抽屉
  const onInputClose = () => {
    setInputDrawer({
      ...inputDrawer,
      open: false,
    })
  }

  // 关闭性别对应的抽屉
  const onGenderClose = () => {
    // 只修改其中的一个状态值
    setListDrawer({
      ...listDrawer,
      open: false,
    })
  }

  // 退出功能
  const logout = () => {
    show({
      title: '温馨提示',
      content: '你确定退出吗？',
      closeOnMaskClick: true,
      closeOnAction: true,
      actions: [
        [
          {
            key: 'cancel',
            text: '取消',
          },
          {
            key: 'confirm',
            text: '确认',
            style: {
              color: '#fc6627',
            },
            onClick: () => {
              // 移除本地token
              removeToken()
              // 跳转到登录页面
              history.push('/login')
            },
          },
        ],
      ],
    })
  }

  const onShowBirthday = () => {
    setShowBirthday(true)
  }

  // 约定：
  // name 第一次渲染时没有值
  //      以后的每次渲染都是有值的
  const { photo, name, intro, gender, birthday } = userInfo

  // 昵称对应的数据
  const nameConfig = {
    text: '昵称',
    value: name,
  }

  // 简介对应的数据
  const introConfig = {
    text: '简介',
    value: intro ?? '',
  }

  return (
    <div className={styles.root}>
      <div className="content">
        {/* 标题 */}
        <NavBar
          style={{
            '--border-bottom': '1px solid #F0F0F0',
          }}
          onBack={() => history.go(-1)}
        >
          个人信息
        </NavBar>

        <div className="wrapper">
          {/* 列表 */}
          <List className="profile-list">
            {/* 列表项 */}
            <Item
              extra={
                <span className="avatar-wrapper">
                  <img
                    width={24}
                    height={24}
                    src={
                      photo || 'http://toutiao.itheima.net/images/user_head.jpg'
                    }
                    alt=""
                  />
                </span>
              }
              onClick={() => onListOpen('photo')}
            >
              头像
            </Item>
            <Item arrow extra={name} onClick={() => onInputOpen('name')}>
              昵称
            </Item>
            <Item
              arrow
              extra={
                <span
                  className={classNames(
                    'intro text-overflow',
                    intro && 'normal'
                  )}
                >
                  {intro || '未填写'}
                </span>
              }
              onClick={() => onInputOpen('intro')}
            >
              简介
            </Item>
          </List>

          <List className="profile-list">
            <Item
              arrow
              extra={gender === 0 ? '男' : '女'}
              onClick={() => onListOpen('gender')}
            >
              性别
            </Item>
            <Item onClick={onShowBirthday} extra={birthday}>
              生日
            </Item>
          </List>

          <DatePicker
            visible={showBirthday}
            value={new Date(birthday)}
            onClose={() => setShowBirthday(false)}
            onConfirm={onBirthdayChange}
            title="选择年月日"
            min={new Date(1900, 0, 1, 0, 0, 0)}
            max={new Date()}
          />

          {/* 此处是一个隐藏的 file 标签 */}
          <input type="file" hidden ref={fileRef} onChange={onPhotoChagne} />
        </div>

        <div className="logout">
          <button className="btn" onClick={logout}>
            退出登录
          </button>
        </div>
      </div>

      {/* 头像、性别 */}
      <Popup
        visible={listDrawer.open}
        onMaskClick={onGenderClose}
        position="bottom"
      >
        <EditList
          items={listDrawer.type === 'photo' ? photoItems : genderItems}
          onClose={onGenderClose}
          onUpdateGender={
            listDrawer.type === 'photo'
              ? onUpdatePhoto
              : (value: string) => onUpdateUser('gender', value)
          }
        />
      </Popup>
      {/* 昵称、简介 */}
      <Popup
        visible={inputDrawer.open}
        onMaskClick={onInputClose}
        position="right"
      >
        <EditInput
          config={inputDrawer.type === 'name' ? nameConfig : introConfig}
          onUpdate={onUpdateUser}
          onClose={onInputClose}
        />
      </Popup>
    </div>
  )
}

export default ProfileEdit
