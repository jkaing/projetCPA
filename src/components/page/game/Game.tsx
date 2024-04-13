import { useRef, useEffect, useState } from 'react'
import Loader from './loader'
import Canvas from './canvas'
import './Game.css'

type Size = {
  height: number
  width: number
}
const Game = () => {
  const [size, setSize] = useState<Size | null>(null)
  const container = useRef<any>()
  useEffect(() => {
    setTimeout(() => {
      setSize({
        height: 725,//container.current.clientHeight,
        width: 1250//container.current.clientWidth,
      })
    }, 100)
  })
  return (
    <div className="Game" ref={container}>
      {size ? <Canvas {...size} /> : <Loader />}
    </div>
  )
}

export default Game
