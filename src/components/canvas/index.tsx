import { useRef, useEffect } from 'react'
import { State, step, click } from './state'
import { render } from './renderer'

const initCanvas =
  (iterate: (ctx: CanvasRenderingContext2D) => void) =>
  (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    requestAnimationFrame(() => iterate(ctx))
  }

const Canvas = ({ height, width }: { height: number; width: number }) => {
  const initialState: State = {
    pos: [
      { x: 123 % width, y: 123 % height, dx: 4, dy: 4 },
      { x: 600 % width, y: 600 % height, dx: -4, dy: -4 },
    ],
    size: { height, width },
  }

  const ref = useRef<any>()
  const state = useRef<State>(initialState)

  const iterate = (ctx: CanvasRenderingContext2D) => {
    state.current = step(state.current)
    render(ctx)(state.current)
    requestAnimationFrame(() => iterate(ctx))
  }
  const onClick = (e: PointerEvent) => {
    state.current = click(state.current)(e)
  }
  useEffect(() => {
    if (ref.current) {
      initCanvas(iterate)(ref.current)
      ref.current.addEventListener('click', onClick)
    }
    return () => {
      ref.current.removeEventListener('click', onClick)
    }
  }, [])
  return <canvas {...{ height, width, ref }} />
}

export default Canvas
