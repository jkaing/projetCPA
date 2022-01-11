import * as conf from './conf'
type Coord = { x: number; y: number; dx: number; dy: number }
type Size = { height: number; width: number }
export type State = { pos: Array<Coord>; size: Size }

const dist2 = (o1: Coord, o2: Coord) =>
  Math.pow(o1.x - o2.x, 2) + Math.pow(o1.y - o2.y, 2)

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
    dx: Math.abs(dx) < conf.MINMOVE ? 0 : dx,
    dy: Math.abs(dy) < conf.MINMOVE ? 0 : dy,
  }
}

export const click =
  (state: State) =>
  (event: PointerEvent): State => {
    const { offsetX, offsetY } = event
    const target = state.pos.find(
      (p) =>
        dist2(p, { x: offsetX, y: offsetY, dx: 0, dy: 0 }) <
        Math.pow(conf.RADIUS, 2)
    )
    if (target) {
      target.dx += Math.random() * 10
      target.dy += Math.random() * 10
    }
    console.log(offsetX, offsetY)
    return state
  }

const collide = (o1: Coord, o2: Coord) =>
  dist2(o1, o2) < Math.pow(2 * conf.RADIUS, 2)

export const step = (state: State) => {
  state.pos.map((p1, i, arr) => {
    arr.slice(i + 1).map((p2) => {
      if (collide(p1, p2)) {
      }
    })
  })
  return {
    ...state,
    pos: state.pos.map(iterate(state.size)),
  }
}
