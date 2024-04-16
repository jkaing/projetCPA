import * as conf from './conf'
//这定义了一个名为 Coord 的类型，表示游戏中的坐标。它包含 x 和 y 表示位置，以及 dx 和 dy 表示速度。
type Coord = { x: number; y: number; dx: number; dy: number }
//这定义了一个名为 Ball 的类型，表示游戏中的球,invincible 表示球是否处于无敌状态（可选)
type Ball = { coord: Coord; life: number; invincible?: number }
//表示画布的尺寸
type Size = { height: number; width: number }

// 定义子弹对象
type Bullet = {
  coord: Coord; // 子弹位置
  dx: number;   // 子弹水平速度
  dy: number;   // 子弹垂直速度
}

//描述游戏的整体状态结构，并确保在代码中使用类型检查来提高代码的可靠性和可维护性。
export type State = {
  //玩家的飞机
  plane: Ball

  planeshot: Array<Ball>

  //表示游戏中的其他物体的位置,它是一个 Array，其中的每个元素都是一个 Ball 类型的对象
  ennemis: Array<Ball>

  //pos: Array<Ball>
  
  // 子弹
  //bullets: Array<Bullet>

  //表示画布的尺寸
  size: Size
  //表示游戏是否结束。它是一个布尔值，用于标识游戏是否已经结束
  endOfGame: boolean
}


// //计算两个坐标之间的平方距离
const dist2 = (o1: Coord, o2: Coord) =>
  Math.pow(o1.x - o2.x, 2) + Math.pow(o1.y - o2.y, 2)

//这是一个柯里化的函数,作用是根据球的当前状态，计算并返回球的下一个状态
const iterate = (bound: Size) => (ball: Ball) => {
  // 递减无敌状态计数器
  const invincible = ball.invincible ? ball.invincible - 1 : ball.invincible
  // 保存球的坐标
  const coord = ball.coord
  
  // 计算新的速度（dx 和 dy）,根据边界条件和摩擦系数，如果球碰到边界，则速度将被设置为零
  const dx =
    (coord.x + conf.RADIUS >= bound.width || coord.x <= conf.RADIUS
      ? 0//-coord.dx
      : coord.dx) * conf.FRICTION
  const dy =
    (coord.y + conf.RADIUS >= bound.height || coord.y <= conf.RADIUS
      ? 0//-coord.dy
      : coord.dy) * conf.FRICTION

  // 如果速度太小，球停止移动
  if (Math.abs(dx) + Math.abs(dy) < conf.MINMOVE)
    return { ...ball, invincible, coord: { ...coord, dx: 0, dy: 0 } }
  
  // 更新球的坐标,返回一个新的球对象，其中包含更新后的坐标和速度
  return {
    ...ball,
    invincible,
    coord: {
      x: (coord.x + conf.RADIUS >= bound.width || coord.x <= conf.RADIUS
        ? (coord.x + conf.RADIUS >= bound.width
          ? bound.width - conf.RADIUS
          : 1+conf.RADIUS)
        : coord.x + dx),

      y: (coord.y + conf.RADIUS > bound.height || coord.y <= conf.RADIUS
        ? (coord.y + conf.RADIUS > bound.height
          ? bound.height - conf.RADIUS
          : 1+conf.RADIUS)
        : coord.y + dy),
      dx,
      dy,
    },
  }
}

//这是一个柯里化的函数,作用是根据球的当前状态，计算并返回球的下一个状态
const iterate_player = (bound: Size) => (ball: Ball) => {
  // 递减无敌状态计数器
  const invincible = ball.invincible ? ball.invincible - 1 : ball.invincible
  // 保存球的坐标
  const coord = ball.coord
  
  // 计算新的速度（dx 和 dy）,根据边界条件和摩擦系数，如果球碰到边界，则速度将被设置为零
  const dx =
    (coord.x + conf.player_Width/2 >= bound.width || coord.x <= conf.player_Width/2
      ? 0//-coord.dx
      : coord.dx) * conf.FRICTION
  const dy =
    (coord.y + conf.player_Height/2 >= bound.height || coord.y <= conf.player_Height/2
      ? 0//-coord.dy
      : coord.dy) * conf.FRICTION
  // 如果速度太小，球停止移动
  if (Math.abs(dx) + Math.abs(dy) < conf.MINMOVE)
    return { ...ball, invincible, coord: { ...coord, dx: 0, dy: 0 } }
  
  // 更新球的坐标,返回一个新的球对象，其中包含更新后的坐标和速度
  return {
    ...ball,
    invincible,
    coord: {
      x: (coord.x + conf.player_Width/2 >= bound.width || coord.x <= conf.player_Width/2
        ? (coord.x + conf.player_Width/2 >= bound.width
          ? bound.width - conf.player_Width/2
          : 1+conf.player_Width/2)
        : coord.x + dx),
      y: (coord.y + conf.player_Height/2 > bound.height || coord.y <= conf.player_Height/2
        ? (coord.y + conf.player_Height/2 > bound.height
          ? bound.height - conf.player_Height/2
          : 1+conf.player_Height/2)
        : coord.y + dy),
      dx,
      dy,
    },
  }
}


//调整飞机的水平速度，并根据当前速度更新飞机的水平位置,更新飞机在 x 轴上的位置。
//这是一个柯里化函数，它接受一个 State 类型的参数 state，然后返回一个函数，该函数接受一个 number 类型的参数 i，并返回一个新的 State 对象
export const moveX =
(state: State) =>
(i:number): State => {
  // 根据输入的值调整飞机的水平速度,调整飞机的水平速度。i 的正负值决定了飞机向左还是向右移动，乘以 5 是为了调整速度
  state.plane.coord.dx += i*5
  // state.plane.coord.x = (state.plane.coord.x + conf.RADIUS > state.size.width || state.plane.coord.x <= conf.RADIUS
  //   ? (state.plane.coord.x + conf.RADIUS > state.size.width
  //     ? state.size.width-conf.RADIUS
  //     : 1+conf.RADIUS)
  //   : state.plane.coord.x + i)
  state.plane.coord.x = (state.plane.coord.x + conf.player_Width/2 > state.size.width || state.plane.coord.x <= conf.player_Width/2
    ? (state.plane.coord.x + conf.player_Width/2 > state.size.width
      ? state.size.width-conf.player_Width/2
      : 1+conf.player_Width/2)
    : state.plane.coord.x + i)
  return state
}

//用于在垂直方向上移动玩家的飞机
export const moveY =
(state: State) =>
(i:number): State => {
  // 根据输入的值调整飞机的垂直速度
  state.plane.coord.dy += i*5
  state.plane.coord.y = (state.plane.coord.y + conf.player_Height/2 > state.size.height || state.plane.coord.y <= conf.player_Height/2 
    ? (state.plane.coord.y + conf.player_Height/2  > state.size.height
      ? state.size.height-conf.player_Height/2 
      : 1+conf.player_Height/2 )
    : state.plane.coord.y + i)
  return state
}

//处理鼠标点击事件
export const click =
  (state: State) =>
  (event: PointerEvent): State => {
    // 解构鼠标点击事件的偏移量, 以获取鼠标点击的位置
    const { offsetX, offsetY } = event
    // 在 state.pos 数组中查找与点击位置距离较近的球体,这里使用了 dist2 函数来计算球体与点击位置的距离的平方，并与半径的平方相比较，以判断球体是否在点击范围内。
    // const target = state.pos.find(
    //   (p) =>
    //     dist2(p.coord, { x: offsetX, y: offsetY, dx: 0, dy: 0 }) <
    //     Math.pow(conf.RADIUS, 2) + 100
    // )
    const target = state.ennemis.find(
      (p) =>
        dist2(p.coord, { x: offsetX, y: offsetY, dx: 0, dy: 0 }) <
        Math.pow(conf.RADIUS, 2) + 100
    )
    // 如果找到了目标球体，增加其速度,以模拟点击球体后的效果
    if (target) {
      target.coord.dx += Math.random() * 10
      target.coord.dy += Math.random() * 10
    }
    return state
}

//用于检测两个物体是否发生了碰撞;物体之间的距离的平方是否小于球体直径的平方
const collide = (o1: Coord, o2: Coord) =>
  dist2(o1, o2) < Math.pow(2 * conf.RADIUS, 2)

//处理两个球体之间的碰撞，实现了一种弹力效果
//实现两个球体之间的碰撞，并根据碰撞后的速度更新球体的位置，从而实现弹力效果。
const collideBoing = (p1: Coord, p2: Coord) => {
  // 计算碰撞的法线向量
  const nx = (p2.x - p1.x) / (2 * conf.RADIUS)
  const ny = (p2.y - p1.y) / (2 * conf.RADIUS)
  // 计算碰撞的切线向量
  const gx = -ny
  const gy = nx

  // 计算速度投影
  const v1g = gx * p1.dx + gy * p1.dy
  const v2n = nx * p2.dx + ny * p2.dy
  const v2g = gx * p2.dx + gy * p2.dy
  const v1n = nx * p1.dx + ny * p1.dy
 
  // 计算碰撞后的速度
  p1.dx = nx * v2n + gx * v1g
  p1.dy = ny * v2n + gy * v1g
  p2.dx = nx * v1n + gx * v2g
  p2.dy = ny * v1n + gy * v2g
  // 更新球体的位置
  p1.x += p1.dx
  p1.y += p1.dy
  p2.x += p2.dx
  p2.y += p2.dy
}

//用于在游戏中执行一步操作
export const step = (state: State) => {
  if (state.planeshot.length<30) {
    state.planeshot.push(({
      life: conf.BALLLIFE,
      coord: {
        x: state.plane.coord.x,
        y: state.plane.coord.y,
        dx: 0,
        dy: -5,
      },
    }))
  }
  /*
  else {
    //state.planeshot.shift(),
    state.planeshot.push(({
      life: conf.BALLLIFE,
      coord: {
        x: state.plane.coord.x,
        y: state.plane.coord.y,
        dx: 0,
        dy: -5,
      },
    }))
  }*/
  
  // 遍历所有的球体，检测是否发生碰撞，并更新球体的生命值和位置
  //state.pos.map((p1, i, arr) => {
  state.ennemis.map((p1, i, arr) => {  
    // 检测当前球体与其他球体之间的碰撞
    /*
    arr.slice(i + 1).map((p2) => {
      if (collide(p1.coord, p2.coord)) {
        // 如果发生碰撞，减少球体的生命值并设置无敌状态，然后处理碰撞效果
        if (!p1.invincible) {
          p1.life--
          p1.invincible = 20
        }
        if (!p2.invincible) {
          p2.life--
          p2.invincible = 20
        }
        //collideBoing(p1.coord, p2.coord)
      }
    })
    */
    // 如果发生碰撞，减少球体的生命值并设置无敌状态，然后处理碰撞效果
    if (collide(state.plane.coord, p1.coord)) {
      // 如果发生碰撞，减少球体和玩家飞机的生命值并设置无敌状态，然后处理碰撞效果
      if (!p1.invincible) {
        p1.life--
        p1.invincible = 20
      }
      if (!state.plane.invincible) {
        state.plane.life--
        state.plane.invincible = 20
      }
      //collideBoing(p1.coord, state.plane.coord)
    }
  })
  // 更新玩家飞机的位置和球体的位置，并移除生命值为 0 的球体
  return {
    ...state,
    plane: iterate_player(state.size)(state.plane),
    planeshot: state.planeshot.map(iterate(state.size)).filter((p) => p.life > 0).map(iterate(state.size)).filter((p) => p.coord.y > conf.RADIUS),
    ennemis: state.ennemis.map(iterate(state.size)).filter((p) => p.life > 0).map(iterate(state.size)).filter((p) => p.coord.y < state.size.height - conf.RADIUS),
    //pos: state.pos.map(iterate(state.size)).filter((p) => p.life > 0),
  }
}

//用于处理鼠标移动事件
export const mouseMove =
  (state: State) =>
  (event: PointerEvent): State => {
    return state
  }

//export const endOfGame = (state: State): boolean => true
export const endOfGame = (state: State): boolean => {
  // 检查玩家的生命值是否耗尽
  return state.plane.life > 0;
};




 

