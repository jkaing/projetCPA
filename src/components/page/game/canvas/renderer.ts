import * as conf from './conf'
import { State } from './state'
const COLORS = {
  RED: '#ff0000',
  GREEN: '#00ff00',
  BLUE: '#0000ff',
}

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
  //fillRect 方法在 Canvas 的整个区域内绘制一个填充了白色的矩形
  ctx.fillRect(0, 0, width, height)
}

//Canvas 边界的矩形，并设置边界的线宽
const limites = (ctx: CanvasRenderingContext2D) => {
  const { height, width } = ctx.canvas
  ctx.strokeRect(0, 0, width, height)
  //定义绘制矩形边界的线宽。
  ctx.lineWidth = 15;
} 

const drawCirle = (
  ctx: CanvasRenderingContext2D,
  { x, y }: { x: number; y: number },
  color: string
) => {
  ctx.beginPath()
  ctx.fillStyle = color
  ctx.arc(x, y, conf.RADIUS, 0, 2 * Math.PI)
  ctx.fill()
}

const drawTriangle = (
  ctx: CanvasRenderingContext2D,
  { x, y }: { x: number; y: number },
  color: string
  ) => {
    ctx.beginPath()
    ctx.moveTo(90,130)
    ctx.lineTo(95,150)
    ctx.lineTo(150,80)
    ctx.lineTo(90,130)
    ctx.fillStyle = color
    ctx.stroke();
    //ctx.lineWidth = 15;
    ctx.fill()
  }

const computeColor = (life: number, maxLife: number, baseColor: string) =>
  rgbaTorgb(baseColor, (maxLife - life) * (1 / maxLife))

export const render = (ctx: CanvasRenderingContext2D) => (state: State) => {
  clear(ctx)

  limites(ctx)

  state.pos.map((c) =>
    drawCirle(ctx, c.coord, computeColor(c.life, conf.BALLLIFE, COLORS.RED))
  )

  drawCirle(ctx, state.plane.coord, computeColor(state.plane.life, conf.BALLLIFE, COLORS.GREEN))
  
  //drawTriangle(ctx, state.plane.coord, computeColor(state.plane.life, conf.BALLLIFE, COLORS.GREEN))

  if (state.endOfGame) {
    const text = 'END'
    ctx.font = '48px arial'
    ctx.strokeText(text, state.size.width / 2 - 200, state.size.height / 2)
  }
}
