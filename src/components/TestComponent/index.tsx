import { useEffect, useRef } from 'react'

import Icon from '../Icon'
import Input from '../Input'

// 测试 交叉类型 &
// type A = { name: string; a1: boolean }
// type B = { age: number; a1: boolean[] }

// // type C = A & Omit<B, 'a1'>
// type C = Omit<A, 'a1'> & B

// let c1: C = {
//   name: '',
//   age: 19,
//   a1: [false]
// }

// console.log(c1)

// --

// unkown 类型
// let notSure: unknown = 4
// notSure = 'maybe a string instead'
// // OK, definitely a boolean
// notSure = false
// console.log(notSure)

// --

// 索引签名
// type Obj = {
//   [k: string]: number
// }
// const o1: Obj = {
//   a: 1,
//   b: 2
// }
// console.log(o1)

// ---

// 获取函数返回值类型
// const fn = () => 10
// // R1 => number
// type R1 = ReturnType<typeof fn>

// --

// 索引查询类型：
// type A = {
//   name: string
// }

// // NameType => string
// // 表示：查询 类型A 中 name 属性的类型
// type NameTyep = A['name']

// --

// never
// const fn = (a: number | string) => {
//   if (typeof a === 'number') {
//     // a => number
//     console.log(a)
//   } else if (typeof a === 'string') {
//     // a => string
//     console.log(a)
//   } else {
//     console.log(a)
//   }
// }

const Test = () => {
  const dom = useRef<HTMLInputElement>(null)

  useEffect(() => {
    dom.current?.focus()
  }, [])

  return (
    <>
      <Icon type="iconbtn_search" onClick={() => 123} />
      <Input
        extra=""
        className=""
        onExtraClick={() => {}}
        dom={dom}
        onClick={e => {}}
      />
    </>
  )
}

export default Test
