import * as conf from './conf'
import { State } from './state'
const COLORS = {
  RED: '#ff0000',
  GREEN: '#00ff00',
  BLUE: '#0000ff',
}

//const backgroundImg = new Image();
//const backgroundImg = HTMLImageElement;
//backgroundImg.src = './background.jpg';


//将一个十进制数转换为两位的十六进制数, 
//如果给定的数字小于 16，它将在其前面添加一个零，然后将其转换为十六进制字符串；否则，直接将其转换为十六进制字符串。
const toDoubleHexa = (n: number) =>
  n < 16 ? '0' + n.toString(16) : n.toString(16)

//给定的颜色字符串转换为带有指定透明度的新的颜色字符串，并返回结果
export const rgbaTorgb = (rgb: string, alpha = 0) => {
  let r = 0
  let g = 0
  let b = 0
  //函数首先检查给定的颜色字符串是否以 # 开头，如果是，则将其解析为十六进制的颜色值
  //它提取红、绿、蓝三个分量的值，并将它们转换为十进制数
  if (rgb.startsWith('#')) {
    const hexR = rgb.length === 7 ? rgb.slice(1, 3) : rgb[1]
    const hexG = rgb.length === 7 ? rgb.slice(3, 5) : rgb[2]
    const hexB = rgb.length === 7 ? rgb.slice(5, 7) : rgb[3]
    r = parseInt(hexR, 16)
    g = parseInt(hexG, 16)
    b = parseInt(hexB, 16)
  }
  //如果颜色字符串是以 'rgb' 开头的，则将其解析为 RGB 格式，并提取出相应的红、绿、蓝三个分量的值
  if (rgb.startsWith('rgb')) {
    const val = rgb.replace(/(rgb)|\(|\)| /g, '')
    const splitted = val.split(',')
    r = parseInt(splitted[0])
    g = parseInt(splitted[1])
    b = parseInt(splitted[2])
  }
  //如果颜色字符串是以 'rgb' 开头的，则将其解析为 RGB 格式，并提取出相应的红、绿、蓝三个分量的值
  r = Math.max(Math.min(Math.floor((1 - alpha) * r + alpha * 255), 255), 0)
  g = Math.max(Math.min(Math.floor((1 - alpha) * g + alpha * 255), 255), 0)
  b = Math.max(Math.min(Math.floor((1 - alpha) * b + alpha * 255), 255), 0)

  //函数将计算得到的新的红、绿、蓝分量的十六进制字符串连接起来，形成新的颜色字符串，并返回结果
  return `#${toDoubleHexa(r)}${toDoubleHexa(g)}${toDoubleHexa(b)}`
}

//用于清除给定的 Canvas 区域
//从而实现清除画布的效果。这样就可以将之前绘制的内容清除，以便在之后的绘制操作中重新绘制新的内容。
const clear = (ctx: CanvasRenderingContext2D) => {
  // Canvas 的高度和宽度
  const { height, width } = ctx.canvas
  //上下文的填充颜色设置为白色
  ctx.fillStyle = 'white' //configurer le couleur au fond
  // //fillRect 方法在 Canvas 的整个区域内绘制一个填充了白色的矩形
   ctx.fillRect(0, 0, width, height)
   ctx.clearRect(0, 0, width, height);                                       

}




//Canvas 边界的矩形，并设置边界的线宽
const limites = (ctx: CanvasRenderingContext2D) => {
  const { height, width } = ctx.canvas
  ctx.strokeRect(0, 0, width, height)
  //定义绘制矩形边界的线宽。
  ctx.lineWidth = 15;
} 

//在 Canvas 上绘制一个圆形
const drawCirle = (
  ctx: CanvasRenderingContext2D,
  { x, y }: { x: number; y: number },
  color: string
) => {
  //开始一条新的路径
  ctx.beginPath()
  //设置填充颜色为指定的颜色
  ctx.fillStyle = color
  //绘制圆弧路径, (x,y)=centre de circle, 0 和 2 * Math.PI 分别是圆弧的起始角度和结束角度，表示从 0 到 2π 画一个完整的圆
  ctx.arc(x, y, conf.RADIUS, 0, 2 * Math.PI)
  //填充路径，绘制圆形
  ctx.fill()
}

//在 Canvas 上绘制一个三角形
const drawTriangle = (
  //是一个参数，它指定了绘图操作的上下文，表示将在哪个 Canvas 上进行绘制,是一个参数，它指定了绘图操作的上下文，表示将在哪个 Canvas 上进行绘制
  ctx: CanvasRenderingContext2D,
  { x, y }: { x: number; y: number },
  color: string
  ) => {
    ctx.beginPath()
    //将绘图游标移动到指定的坐标 (90, 130) 处
    ctx.moveTo(90,130)
    //从当前绘图位置绘制直线到指定的坐标，依次绘制三条边形成一个三角形
    ctx.lineTo(95,150)
    ctx.lineTo(150,80)
    ctx.lineTo(90,130)
    ctx.fillStyle = color
    //绘制路径，即绘制三角形的边框
    ctx.stroke();
    //ctx.lineWidth = 15;
    //填充路径，即填充三角形的内部颜色
    ctx.fill()
  }

//它的作用是根据生命值 life 和最大生命值 maxLife，以及基础颜色 baseColor 来计算当前生物的颜色
//生命值越低的生物将更加透明，生命值越高的生物将更加不透明
const computeColor = (life: number, maxLife: number, baseColor: string) =>
  rgbaTorgb(baseColor, (maxLife - life) * (1 / maxLife))


//用于在 Canvas 上渲染游戏状态
export const render = (ctx: CanvasRenderingContext2D) => (state: State) => {
  //调用了 clear(ctx) 函数来清除画布上的内容
  clear(ctx)

  //调用 limites(ctx) 函数来绘制画布的边界
  limites(ctx)

  //通过 state.pos.map 遍历了游戏中的每个物体，并使用 drawCirle 函数来绘制圆形物体。每个物体的位置和颜色由游戏状态 state 中的信息确定
  state.pos.map((c) =>
    drawCirle(ctx, c.coord, computeColor(c.life, conf.BALLLIFE, COLORS.RED))
  )

  //使用 drawCirle 函数绘制了玩家飞机，其位置和颜色也由游戏状态中的信息确定
  drawCirle(ctx, state.plane.coord, computeColor(state.plane.life, conf.BALLLIFE, COLORS.GREEN))
  
  //drawTriangle(ctx, state.plane.coord, computeColor(state.plane.life, conf.BALLLIFE, COLORS.GREEN))

  //使用 drawCirle 函数绘制了玩家飞机，其位置和颜色也由游戏状态中的信息确定
  if (state.endOfGame) {
    const text = 'END'
    ctx.font = '48px arial'
    ctx.strokeText(text, state.size.width / 2 - 200, state.size.height / 2)
  }
}
