import * as conf from './conf'
type Coord = { x: number; y: number; dx: number; dy: number }
type Ball = { coord: Coord; life: number; invincible?: number }
type Size = { height: number; width: number }

export type State = {
  plane: Ball

  pos: Array<Ball>
  size: Size
  endOfGame: boolean
}

const dist2 = (o1: Coord, o2: Coord) =>
  Math.pow(o1.x - o2.x, 2) + Math.pow(o1.y - o2.y, 2)

const iterate = (bound: Size) => (ball: Ball) => {
  const invincible = ball.invincible ? ball.invincible - 1 : ball.invincible
  const coord = ball.coord
  const dx =
    (coord.x + conf.RADIUS > bound.width || coord.x < conf.RADIUS
      ? -coord.dx
      : coord.dx) * conf.FRICTION
  const dy =
    (coord.y + conf.RADIUS > bound.height || coord.y < conf.RADIUS
      ? -coord.dy
      : coord.dy) * conf.FRICTION
  if (Math.abs(dx) + Math.abs(dy) < conf.MINMOVE)
    return { ...ball, invincible, coord: { ...coord, dx: 0, dy: 0 } }
  return {
    ...ball,
    invincible,
    coord: {
      x: coord.x + dx,
      y: coord.y + dy,
      dx,
      dy,
    },
  }
}

export const changeDirection =
(state: State) =>
(event: KeyboardEvent): State => {
  /*
  switch (event.key) {
    case "ArrowDown":
      // Faire quelque chose pour la touche "flèche vers le bas" pressée.
      //state.plane.coord.y = state.plane.coord.y + 5
      state.plane.coord.dy += 5
      break;
    case "ArrowUp":
      // Faire quelque chose pour la touche "up arrow" pressée.
      //state.plane.coord.y -= 5
      state.plane.coord.dy -= 5
      break;
    case "ArrowLeft":
      // Faire quelque chose pour la touche "left arrow" pressée.
      //state.plane.coord.x -= 5
      state.plane.coord.dx -= 5
      break;
    case "ArrowRight":
      // Faire quelque chose pour la touche "right arrow" pressée.
      //state.plane.coord.x += 5
      state.plane.coord.dx += 5
      break;
    default:
      break;
  }
  return state
  */
 
  if (event.key === 'ArrowDown') {
    // Faire quelque chose pour la touche "flèche vers le bas" pressée.
    state.plane.coord.dy += 5
  }
  else if (event.key === 'ArrowUp') {
    // Faire quelque chose pour la touche "up arrow" pressée.
    state.plane.coord.dy -= 5
  }
  else if (event.key === 'ArrowLeft') {
    // Faire quelque chose pour la touche "left arrow" pressée.
    state.plane.coord.dx -= 5
  }
  else if (event.key === 'ArrowRight') {
    // Faire quelque chose pour la touche "right arrow" pressée.
    state.plane.coord.dx += 5
  }
  
  return state
  }

export const click =
  (state: State) =>
  (event: PointerEvent): State => {
    const { offsetX, offsetY } = event
    const target = state.pos.find(
      (p) =>
        dist2(p.coord, { x: offsetX, y: offsetY, dx: 0, dy: 0 }) <
        Math.pow(conf.RADIUS, 2) + 100
    )
    if (target) {
      target.coord.dx += Math.random() * 10
      target.coord.dy += Math.random() * 10
    }
    return state
  }

const collide = (o1: Coord, o2: Coord) =>
  dist2(o1, o2) < Math.pow(2 * conf.RADIUS, 2)

const collideBoing = (p1: Coord, p2: Coord) => {
  const nx = (p2.x - p1.x) / (2 * conf.RADIUS)
  const ny = (p2.y - p1.y) / (2 * conf.RADIUS)
  const gx = -ny
  const gy = nx

  const v1g = gx * p1.dx + gy * p1.dy
  const v2n = nx * p2.dx + ny * p2.dy
  const v2g = gx * p2.dx + gy * p2.dy
  const v1n = nx * p1.dx + ny * p1.dy
  p1.dx = nx * v2n + gx * v1g
  p1.dy = ny * v2n + gy * v1g
  p2.dx = nx * v1n + gx * v2g
  p2.dy = ny * v1n + gy * v2g
  p1.x += p1.dx
  p1.y += p1.dy
  p2.x += p2.dx
  p2.y += p2.dy
}

export const step = (state: State) => {
  state.pos.map((p1, i, arr) => {
    arr.slice(i + 1).map((p2) => {
      if (collide(p1.coord, p2.coord)) {
        if (!p1.invincible) {
          p1.life--
          p1.invincible = 20
        }
        if (!p2.invincible) {
          p2.life--
          p2.invincible = 20
        }
        collideBoing(p1.coord, p2.coord)
      }
    })

    if (collide(state.plane.coord, p1.coord)) {
      if (!p1.invincible) {
        p1.life--
        p1.invincible = 20
      }
      if (!state.plane.invincible) {
        state.plane.life--
        state.plane.invincible = 20
      }
      collideBoing(p1.coord, state.plane.coord)
    }
  })
  return {
    ...state,
    plane: iterate(state.size)(state.plane),
    pos: state.pos.map(iterate(state.size)).filter((p) => p.life > 0),
  }
}

export const mouseMove =
  (state: State) =>
  (event: PointerEvent): State => {
    return state
  }

export const endOfGame = (state: State): boolean => true
