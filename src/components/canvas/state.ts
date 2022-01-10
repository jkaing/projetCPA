import * as conf from './conf'
type Coord = { x: number; y: number; dx: number; dy: number }
type Size = { height: number; width: number }
export type State = { pos: Array<Coord>; size: Size }

const iterate = (bound: Size) => (coord: Coord) => {
  const dx =
    (coord.x + conf.RADIUS > bound.width || coord.x < conf.RADIUS
      ? -coord.dx
      : coord.dx) * conf.FRICTION
  const dy =
    (coord.y + conf.RADIUS > bound.height || coord.y < conf.RADIUS
      ? -coord.dy
      : coord.dy) * conf.FRICTION
  return {
    x: coord.x + dx,
    y: coord.y + dy,
    dx,
    dy,
  }
}

export const click =
  (state: State) =>
  (event: any): State => {
    const { offsetX, offsetY } = event
    console.log(offsetX, offsetY)
    return state
  }

export const step = (state: State) => ({
  ...state,
  pos: state.pos.map(iterate(state.size)),
})
