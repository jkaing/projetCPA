import { useRef, useEffect, useState } from 'react'
import Loader from './loader'
import Canvas from './canvas'
import './Game.css'

type Size = {
  height: number
  width: number
}
const App = () => {
  const [size, setSize] = useState<Size | null>(null)
  const container = useRef<any>()
  useEffect(() => {
    setTimeout(() => {
      setSize({
        height: container.current.clientHeight,
        width: container.current.clientWidth,
      })
    }, 100)
  })
  return (
    <div className="Game" ref={container}>
      {size ? <Canvas {...size} /> : <Loader />}
    </div>
  )
}

export default App
