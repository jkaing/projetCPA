import * as conf from './conf'
import { State } from './state'

const clear = (ctx: CanvasRenderingContext2D) => {
  const { height, width } = ctx.canvas
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, width, height)
}

const drawCirle =
  (ctx: CanvasRenderingContext2D) =>
  ({ x, y }: { x: number; y: number }) => {
    ctx.beginPath()
    ctx.fillStyle = 'red'
    ctx.arc(x, y, conf.RADIUS, 0, 2 * Math.PI)
    ctx.fill()
  }

export const render = (ctx: CanvasRenderingContext2D) => (state: State) => {
  clear(ctx)
  state.pos.map(drawCirle(ctx))
}
