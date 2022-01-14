import * as conf from './conf'
type Coord = { x: number; y: number; dx: number; dy: number }
type Size = { height: number; width: number }
export type State = {
  pos: Array<Coord>
  size: Size
  player: { coord: Coord; life: number; invincible?: number }
  endOfGame: boolean
}

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
  if (Math.abs(dx) + Math.abs(dy) < conf.MINMOVE)
    return { ...coord, dx: 0, dy: 0 }
  return {
    x: coord.x + dx,
    y: coord.y + dy,
    dx,
    dy,
  }
}

export const click =
  (state: State) =>
  (event: PointerEvent): State => {
    const { offsetX, offsetY } = event
    const target = state.pos.find(
      (p) =>
        dist2(p, { x: offsetX, y: offsetY, dx: 0, dy: 0 }) <
        Math.pow(conf.RADIUS, 2) + 100
    )
    if (target) {
      target.dx += Math.random() * 10
      target.dy += Math.random() * 10
    }
    return state
  }

const collide = (o1: Coord, o2: Coord) =>
  dist2(o1, o2) < Math.pow(2 * conf.RADIUS, 2)

const collideBoing = (p1: Coord, p2: Coord) => {
  // const nx = ((p2.x - p1.x) / 2) * conf.RADIUS
  // const ny = ((p2.y - p1.y) / 2) * conf.RADIUS
  // const gx = -ny
  // const gy = nx
  //
  // const v1g = gx * p1.dx + gy * p1.dy
  // const v2n = nx * p2.dx + ny * p2.dy
  // const v2g = gx * p2.dx + gy * p2.dy
  // const v1n = nx * p1.dx + ny * p1.dy
  // p1.dx = nx * v2n + gx * v1g
  // p1.dy = ny * v2n + gy * v1g
  // p2.dx = nx * v1n + gx * v2g
  // p2.dy = ny * v1n + gy * v2g
  // console.log(p1.dx)
}

export const step = (state: State) => {
  state.pos.map((p1, i, arr) => {
    arr.slice(i + 1).map((p2) => {
      if (collide(p1, p2)) {
        collideBoing(p1, p2)
      }
    })
  })
  if (state.player.invincible) state.player.invincible--
  else
    state.pos.map((p1, i) => {
      if (collide(p1, state.player.coord)) {
        collideBoing(p1, state.player.coord)
        state.player.coord.dx = 0
        state.player.coord.dy = 0
        state.player.life--
        state.player.invincible = 20
      }
    })
  return {
    ...state,
    pos: state.pos.map(iterate(state.size)),
  }
}

export const mouseMove =
  (state: State) =>
  (event: PointerEvent): State => {
    const { offsetX, offsetY } = event
    state.player = {
      ...state.player,
      coord: { x: offsetX, y: offsetY, dx: 0, dy: 0 },
    }
    return state
  }

export const endOfGame = (state: State): boolean => {
  return state.player.life > 0
}
