import { useRef, useEffect } from 'react'
import { State, step, click, mouseMove, endOfGame } from './state'
import { render } from './renderer'

const randomInt = (max: number) => Math.floor(Math.random() * max)
const randomSign = () => Math.sign(Math.random() - 0.5)

const initCanvas =
  (iterate: (ctx: CanvasRenderingContext2D) => void) =>
  (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    requestAnimationFrame(() => iterate(ctx))
  }

const Canvas = ({ height, width }: { height: number; width: number }) => {
  const initialState: State = {
    pos: new Array(20).fill(1).map((_) => ({
      x: randomInt(width - 120) + 60,
      y: randomInt(height - 120) + 60,
      dx: 4 * randomSign(),
      dy: 4 * randomSign(),
    })),
    size: { height, width },
    player: {
      coord: { x: 500 % width, y: 500 % height, dx: 0, dy: 0 },
      life: 10,
    },
    endOfGame: true,
  }

  const ref = useRef<any>()
  const state = useRef<State>(initialState)

  const iterate = (ctx: CanvasRenderingContext2D) => {
    state.current = step(state.current)
    state.current.endOfGame = !endOfGame(state.current)
    render(ctx)(state.current)
    if (!state.current.endOfGame) requestAnimationFrame(() => iterate(ctx))
  }
  const onClick = (e: PointerEvent) => {
    state.current = click(state.current)(e)
  }

  const onMove = (e: PointerEvent) => {
    state.current = mouseMove(state.current)(e)
  }
  useEffect(() => {
    if (ref.current) {
      initCanvas(iterate)(ref.current)
      ref.current.addEventListener('click', onClick)
      ref.current.addEventListener('mousemove', onMove)
    }
    return () => {
      ref.current.removeEventListener('click', onClick)
      ref.current.removeEventListener('mousemove', onMove)
    }
  }, [])
  return <canvas {...{ height, width, ref }} />
}

export default Canvas
