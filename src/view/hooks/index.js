import React, { useState, useEffect } from 'react'

// useState
const f1 = () => {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('like')
  useEffect(() => {
    // 相当于 componentDidMount componentDidUpdate
    console.log(`you click ${count} times`)
    // 相当于 前一次的componentDidMount componentWillUnmount
    return () => { console.log('组件更新(props或者state变化)或者组件卸载了') }
    // 如果不传入第二个参数 那componentDidUpdate都会执行
    // 如果第二个参数传入[] 那componentDidUpdate不会执行
    // 如果第二个参数传入[count] 那componentDidUpdate只在count变化的时候执行
  }, [count])
  // 执行顺序
  // you click 0 times
  // 组件更新(props或者state变化)或者组件卸载了
  // you click 1 times
  // 组件更新(props或者state变化)或者组件卸载了
  // you click 2 times
  // 组件更新(props或者state变化)或者组件卸载了

  return (
    <div>
      <button type="button" onClick = {() => { setCount(count + 1) }}>
        {count}
      </button>
      {/* <button type="button" onClick = {() => { setCount(count => count + 11) }}>
        {count}
      </button> */}
      <button type="button" onClick = {() => { setName(name + '.') }}>
        {name}
      </button>
    </div>
  )
}

export default f1
