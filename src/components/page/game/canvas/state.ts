import * as conf from './conf'


//这定义了一个名为 Coord 的类型，表示游戏中的坐标。它包含 x 和 y 表示位置，以及 dx 和 dy 表示速度。
type Coord = { x: number; y: number; dx: number; dy: number }
//这定义了一个名为 Ball 的类型，表示游戏中的球,invincible 表示球是否处于无敌状态（可选)
type Ball = { coord: Coord; life: number; invincible?: number }
//表示画布的尺寸
type Size = { height: number; width: number }

type Polygon_plane = {points: Coord[]; centre: Coord; life: number; prevLife: number; invincible?: number ; blinkCounter: number ; shootCounter: number }  

type Polygon_ennemis = {points: Coord[]; centre: Coord;  life: number; invincible?: number }  


//描述游戏的整体状态结构，并确保在代码中使用类型检查来提高代码的可靠性和可维护性。
export type State = {
  //玩家的飞机
  plane: Polygon_plane

  planeshot: Array<Ball>

  //表示游戏中的其他物体的位置,它是一个 Array
  ennemis: Array<Polygon_ennemis>
  ennemishots: Array<Ball>

  //表示画布的尺寸
  size: Size

  score: number

  //表示游戏是否结束。它是一个布尔值，用于标识游戏是否已经结束
  endOfGame: boolean
}


// //计算两个坐标之间的平方距离
const dist2 = (o1: Coord, o2: Coord) =>
  Math.pow(o1.x - o2.x, 2) + Math.pow(o1.y - o2.y, 2)
/*
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
*/
//这是一个柯里化的函数,作用是根据球的当前状态，计算并返回球的下一个状态
const iterate_player = (bound: Size) => (plane: Polygon_plane) => {
  // 递减无敌状态计数器
  const invincible = plane.invincible ? plane.invincible - 1 : plane.invincible
  // 保存球的坐标
  //const coord = plane.coord
  const coord = plane.centre
  
  // 计算新的速度（dx 和 dy）,根据边界条件和摩擦系数，如果球碰到边界，则速度将被设置为零
  /*
  const dx =
    (coord.x + conf.player_Width/2 >= bound.width || coord.x <= conf.player_Width/2
      ? 0
      : coord.dx) * conf.FRICTION
  const dy =
    (coord.y + conf.player_Height/2 >= bound.height || coord.y <= conf.player_Height/2
      ? 0
      : coord.dy) * conf.FRICTION
  */
  var x = coord.x;
  var y = coord.y;
  var dx = coord.dx;
  var dy = coord.dy;
  const player_Width = conf.player_Width;
  const player_Height = conf.player_Height;
  const width = bound.width;
  const height = bound.height;
  if (x + conf.player_Width/2 > width) {
    dx = 0
    x = width - player_Width/2
  } else if (x <= player_Width/2) {
    dx = 0
    x = 1+player_Width/2
  } else {
    dx = dx * conf.FRICTION
    x = x + dx
  }
  if (y + player_Height/2 > height) {
    dy = 0
    y = height-player_Height/2
  } else if (y <= player_Height/2) {
    dy = 0
    y = 1+player_Height/2
  } else {
    dy = dy * conf.FRICTION
    y = y + dy
  }
  // 如果速度太小，球停止移动
  if (Math.abs(dx) + Math.abs(dy) < conf.MINMOVE)
    return { ...plane, invincible, coord: { ...coord, dx: 0, dy: 0 } }
  
  // 更新球的坐标,返回一个新的球对象，其中包含更新后的坐标和速度
  return {
    ...plane,
    invincible,
    centre: {
      /*
      x: (coord.x + conf.player_Width/2 >= bound.width || coord.x <= conf.player_Width/2
        ? (coord.x + conf.player_Width/2 >= bound.width
          ? bound.width - conf.player_Width/2
          : 1+conf.player_Width/2)
        : coord.x + dx),
      y: (coord.y + conf.player_Height/2 >= bound.height || coord.y <= conf.player_Height/2
        ? (coord.y + conf.player_Height/2 >= bound.height
          ? bound.height - conf.player_Height/2
          : 1+conf.player_Height/2)
        : coord.y + dy),
        */
      x,
      y,
      dx,
      dy,
    },
    points: [
      { x: x, y: y - 50, dx, dy },                
      { x: x - 20, y: y - 16, dx, dy },             
      { x: x - 25, y: y + 18, dx, dy },    
      { x: x - 21, y: y + 50, dx, dy },                
      { x: x + 21, y: y + 50, dx, dy },            
      { x: x + 25, y: y + 18, dx, dy },    
      { x: x + 20, y: y - 16, dx, dy },   
    ]
    ,
  }
}

const iterate_ennemis = (bound: Size) => (ennemi: Polygon_ennemis) => {
  // 递减无敌状态计数器
  const invincible = ennemi.invincible ? ennemi.invincible - 1 : ennemi.invincible
  // 保存球的坐标
  const coord = ennemi.centre
  
  // 计算新的速度（dx 和 dy）,根据边界条件和摩擦系数，如果球碰到边界，则速度将被设置为零
  const dx =
    (coord.x + conf.ennemis_Width/2 >= bound.width || coord.x <= conf.ennemis_Width/2
      ? 0//-coord.dx
      : coord.dx) * conf.FRICTION
  const dy =
    (coord.y + conf.ennemis_Height/2 >= bound.height || coord.y <= conf.ennemis_Height/2
      ? 0//-coord.dy
      : coord.dy) * conf.FRICTION

  // 如果速度太小，球停止移动
  if (Math.abs(dx) + Math.abs(dy) < conf.MINMOVE)
    return { ...ennemi, invincible, coord: { ...coord, dx: 0, dy: 0 } }

  const x = coord.x
  const y = coord.y
  
  // 更新球的坐标,返回一个新的球对象，其中包含更新后的坐标和速度
  return {
    ...ennemi,
    invincible,
    centre: {
      x: (coord.x + conf.ennemis_Width/2 >= bound.width || coord.x <= conf.ennemis_Width/2
        ? (coord.x + conf.ennemis_Width/2 >= bound.width
          ? bound.width - conf.ennemis_Width/2
          : 1+conf.ennemis_Width/2)
        : coord.x + dx),

      y: (coord.y + conf.ennemis_Height/2 > bound.height || coord.y <= conf.ennemis_Height/2
        ? (coord.y + conf.ennemis_Height/2 > bound.height
          ? bound.height - conf.ennemis_Height/2
          : 1+conf.ennemis_Height/2)
        : coord.y + dy),
      dx,
      dy,
    },
    points: [
      { x: x+5, y: y+25, dx, dy },
      { x: x+25, y: y-25, dx, dy },
      { x: x-25, y: y-25, dx, dy },
      { x: x-5, y: y+25, dx, dy },
    ],
  }
}

const iterate_munitions = (bound: Size) => (ball: Ball) => {
  // 递减无敌状态计数器
  const invincible = ball.invincible ? ball.invincible - 1 : ball.invincible
  // 保存球的坐标
  const coord = ball.coord
  
  // 计算新的速度（dx 和 dy）,根据边界条件和摩擦系数，如果球碰到边界，则速度将被设置为零
  const dx =
    (coord.x + conf.MUNITIONRADIUS >= bound.width || coord.x <= conf.MUNITIONRADIUS
      ? 0//-coord.dx
      : coord.dx) * conf.FRICTION
  const dy =
    (coord.y + conf.MUNITIONRADIUS >= bound.height || coord.y <= conf.MUNITIONRADIUS
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
      x: (coord.x + conf.MUNITIONRADIUS >= bound.width || coord.x <= conf.MUNITIONRADIUS
        ? (coord.x + conf.MUNITIONRADIUS >= bound.width
          ? bound.width - conf.MUNITIONRADIUS
          : 1+conf.MUNITIONRADIUS)
        : coord.x + dx),

      y: (coord.y + conf.MUNITIONRADIUS > bound.height || coord.y <= conf.MUNITIONRADIUS
        ? (coord.y + conf.MUNITIONRADIUS > bound.height
          ? bound.height - conf.MUNITIONRADIUS
          : 1+conf.MUNITIONRADIUS)
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
  var x = state.plane.centre.x
  const player_Width = conf.player_Width
  const width = state.size.width
  if (x + player_Width/2 > width) {
    state.plane.centre.dx = 0
    state.plane.centre.x = width-player_Width/2
  } else if (x <= player_Width/2) {
    state.plane.centre.dx = 0
    state.plane.centre.x = 1+player_Width/2
  } else {
    state.plane.centre.dx += i*5
    state.plane.centre.x += i
  }
  x = state.plane.centre.x
  const y = state.plane.centre.y
  const dx = state.plane.centre.dx
  const dy = state.plane.centre.dy
  state.plane.points = [
    { x: x, y: y - 50, dx: dx, dy: dy },                
    { x: x - 20, y: y - 16, dx: dx, dy: dy },             
    { x: x - 25, y: y + 18, dx: dx, dy: dy },    
    { x: x - 21, y: y + 50, dx: dx, dy: dy },                
    { x: x + 21, y: y + 50, dx: dx, dy: dy },            
    { x: x + 25, y: y + 18, dx: dx, dy: dy },    
    { x: x + 20, y: y - 16, dx: dx, dy: dy },   
  ]
  return state
}

//用于在垂直方向上移动玩家的飞机
export const moveY =
(state: State) =>
(i:number): State => {
  var y = state.plane.centre.y
  const player_Height = conf.player_Height
  const height = state.size.height
  if (y + player_Height/2 > height) {
    state.plane.centre.dy = 0
    state.plane.centre.y = height-player_Height/2
  } else if (y <= player_Height/2) {
    state.plane.centre.dy = 0
    state.plane.centre.y = 1+player_Height/2
  } else {
    state.plane.centre.dy += i*5
    state.plane.centre.y += i
  }
  y = state.plane.centre.y
  const x = state.plane.centre.x
  const dx = state.plane.centre.dx
  const dy = state.plane.centre.dy
  state.plane.points = [
    { x: x, y: y - 50, dx: dx, dy: dy },                
    { x: x - 20, y: y - 16, dx: dx, dy: dy },             
    { x: x - 25, y: y + 18, dx: dx, dy: dy },    
    { x: x - 21, y: y + 50, dx: dx, dy: dy },                
    { x: x + 21, y: y + 50, dx: dx, dy: dy },            
    { x: x + 25, y: y + 18, dx: dx, dy: dy },    
    { x: x + 20, y: y - 16, dx: dx, dy: dy },   
  ]
  return state
}

const collisionsound = require("./audio/powerup.wav")

const onCollision = 
  () => {
    var filepath=collisionsound
    var audio = new Audio();
    audio.src = filepath;
    audio.controls = true;
    audio.autoplay = true;
    return;
  }
/*
const shotedsound = require("./audio/shot.wav")

const onShoted = 
  () => {
    var filepath=shotedsound
    var audio = new Audio();
    audio.src = filepath;
    audio.controls = true;
    audio.autoplay = true;
    return;
  }
*/
const explosionsound = require("./audio/explosion-small.wav")

const onExplosion = 
  () => {
    var filepath=explosionsound
    var audio = new Audio();
    audio.src = filepath;
    audio.controls = true;
    audio.autoplay = true;
    return;
  }

//用于检测两个物体是否发生了碰撞;物体之间的距离的平方是否小于球体直径的平方
export const collide = (o1: Coord, o2: Coord) =>
  dist2(o1, o2) < Math.pow(2 * conf.RADIUS, 2)

const shapeOverlap_SAT = (p1:Coord[] , p2: Coord[]) =>
	{
		let poly1 = p1;
		let poly2 = p2;

		for (let shape = 0; shape < 2; shape++)
		{
			if (shape === 1)
			{
				poly1 = p2;
				poly2 = p1;
			}
		
			for (let a = 0; a < poly1.length ; a++)
			{
				const b = (a + 1) % poly1.length;
				const axisProj = { x:-(poly1[b].y - poly1[a].y), y: poly1[b].x - poly1[a].x};
				const d = Math.sqrt(axisProj.x * axisProj.x + axisProj.y * axisProj.y);
				//axisProj = { axisProj.x / d, axisProj.y / d };
        axisProj.x /= d;
        axisProj.y /= d;

				// Work out min and max 1D points for r1
				let min_p1 = Infinity, max_p1 = -Infinity;
				for (let p = 0; p < poly1.length; p++)
				{
					const q = (poly1[p].x * axisProj.x + poly1[p].y * axisProj.y);
					min_p1 = Math.min(min_p1, q);
					max_p1 = Math.max(max_p1, q);
				}

				// Work out min and max 1D points for r2
				let min_p2 = Infinity, max_p2 = -Infinity;
				for (let p = 0; p < poly2.length; p++)
				{
					const q = (poly2[p].x * axisProj.x + poly2[p].y * axisProj.y);
					min_p2 = Math.min(min_p2, q);
					max_p2 = Math.max(max_p2, q);
				}

				if (!(max_p2 >= min_p1 && max_p1 >= min_p2))
					return false;
			}
		}

		return true;
	} 

const collide_munitions = (o1: Coord, o2: Coord) =>
  dist2(o1, o2) <= Math.pow(conf.RADIUS + conf.MUNITIONRADIUS, 2)

export const generateEnemyPosition = (existingEnemies: Array<Polygon_ennemis>, width: number, height: number) => {
  let x: number, y: number;
  do {
      x = randomInt(width - 120) + 60;
      y = conf.ennemis_Height / 2 + 1;
      const coord: Coord = { x, y, dx: 0, dy: 0 };
      const isTooClose = existingEnemies.some(enemy => collide(enemy.centre, coord));
      if (!isTooClose) break;
  } while (true);
  return { x, y };
}



const randomInt = (max: number) => Math.floor(Math.random() * max)
// 用于生成一个随机的正负号 
const randomSign = () => Math.sign(Math.random() - 0.5)

//用于在游戏中执行一步操作
export const step = (state: State) => {
  if (state.ennemis.length<5) {
    const { x, y } = generateEnemyPosition(state.ennemis, state.size.width, state.size.height);
    const dy = 4 * randomSign() + 5
    state.ennemis.push(({
      life: conf.BALLLIFE,
      centre: {
        x: x,
        y: y,
        dx: 0,
        dy: dy,
      },
      points: [
        { x: x+5, y: y+25, dx: 0, dy },
        { x: x+25, y: y-25, dx: 0, dy },
        { x: x-25, y: y-25, dx: 0, dy },
        { x: x-5, y: y+25, dx: 0, dy },
      ],
    }))
  }
  
  if (state.plane.shootCounter>0) {
    state.planeshot.push(({
      life: 1,
      coord: {
        x: state.plane.centre.x,
        y: state.plane.centre.y-conf.player_Height/2+5,
        dx: 0,
        dy: -5,
      },
    }))
    state.plane.shootCounter--
  } else if (state.plane.shootCounter<-10) {
    state.plane.shootCounter = 30
  } else {
    state.plane.shootCounter--
  }
  
  state.ennemishots.map((p2) => {
    if (collide_munitions(state.plane.centre, p2.coord)) {
      // 如果发生碰撞，减少球体的生命值并设置无敌状态，然后处理碰撞效果
      if (!state.plane.invincible) {
        state.plane.life--
        state.plane.invincible = 20
        onCollision()
      }
      if (!p2.invincible) {
        p2.life--
        p2.invincible = 20
      }
      
      //collideBoing(p1.coord, p2.coord)
    }
  })
  
  // 遍历所有的球体，检测是否发生碰撞，并更新球体的生命值和位置
  //state.pos.map((p1, i, arr) => {
  state.ennemis.map((p1) => {  
    if (state.ennemishots.length<state.ennemis.length/2 && randomInt(100*state.ennemis.length)===1) {
      state.ennemishots.push(({
        life: 1,
        coord: {
          x: p1.centre.x,
          y: p1.centre.y+conf.ennemis_Height/2-10,
          dx: 0,
          dy: 5,
        },
      }))
    }

    state.planeshot.map((p2) => {
      if (collide_munitions(p1.centre, p2.coord)) {
        // 如果发生碰撞，减少球体的生命值并设置无敌状态，然后处理碰撞效果
        if (!p1.invincible) {
          p1.life--
          p1.invincible = 20
          state.score += 10
          onExplosion()
        }
        if (!p2.invincible) {
          p2.life--
          p2.invincible = 20
        }
      }
    })
    
    // 如果发生碰撞，减少球体的生命值并设置无敌状态，然后处理碰撞效果
    if (shapeOverlap_SAT(state.plane.points, p1.points)) {
      // 如果发生碰撞，减少球体和玩家飞机的生命值并设置无敌状态，然后处理碰撞效果
      if (!p1.invincible) {
        p1.life--
        p1.invincible = 20
      }
      if (!state.plane.invincible) {
        state.plane.prevLife = state.plane.life
        state.plane.life--
        state.plane.invincible = 20
        onCollision()
      }
    }
  })
  // 更新玩家飞机的位置和球体的位置，并移除生命值为 0 的球体
  return {
    ...state,
    plane: iterate_player(state.size)(state.plane),
    planeshot: state.planeshot.map(iterate_munitions(state.size)).filter((p) => p.life > 0).map(iterate_munitions(state.size)).filter((p) => p.coord.y > conf.MUNITIONRADIUS),
    ennemis: state.ennemis.map(iterate_ennemis(state.size)).filter((p) => p.life > 0).map(iterate_ennemis(state.size)).filter((p) => p.centre.y < state.size.height - conf.ennemis_Height/2),
    ennemishots: state.ennemishots.map(iterate_munitions(state.size)).filter((p) => p.life > 0).map(iterate_munitions(state.size)).filter((p) => p.coord.y < state.size.height - conf.MUNITIONRADIUS),
  }
}

//用于处理鼠标移动事件
export const mouseMove =
  (state: State) =>
  (event: PointerEvent): State => {
    return state
  }

const fin_audio = require("./audio/game_over.wav")

//export const endOfGame = (state: State): boolean => true
export const endOfGame = (state: State): boolean => {
  // 检查玩家的生命值是否耗尽
  if (state.plane.life > 0){
    return true;
  }
  var filepath=fin_audio
  var audio = new Audio();
  audio.src = filepath;
  audio.controls = true;
  audio.autoplay = true;
  return false;
  
};




 

