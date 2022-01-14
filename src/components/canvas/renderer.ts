import * as conf from './conf'
import { State } from './state'

const clear = (ctx: CanvasRenderingContext2D) => {
  const { height, width } = ctx.canvas
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, width, height)
}

const drawCirle =
  (ctx: CanvasRenderingContext2D, color?: string) =>
  ({ x, y }: { x: number; y: number }) => {
    ctx.beginPath()
    ctx.fillStyle = color ?? 'red'
    ctx.arc(x, y, conf.RADIUS, 0, 2 * Math.PI)
    ctx.fill()
  }

export const render = (ctx: CanvasRenderingContext2D) => (state: State) => {
  clear(ctx)
  ctx.font = '96px arial'
  ctx.strokeText(`life ${state.player.life}`, 20, 100)
  state.pos.map(drawCirle(ctx))
  drawCirle(ctx, 'blue')(state.player.coord)
  if (state.endOfGame) {
    ctx.font = '48px'
    ctx.strokeText(
      'END OF GAME',
      state.size.width / 2 - 400,
      state.size.height / 2
    )
  }
}
