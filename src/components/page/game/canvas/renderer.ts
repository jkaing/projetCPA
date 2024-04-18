import * as conf from './conf'
import { State } from './state'
import playerImage from './avion2.png';
import backgroundImage from './background.jpg';
import redHeart from './coeur_rouge.png'; // 替换为您的心形图像路径
import whiteHeart from './coeur_blanc.png'; // 替换为您的心形图像路径

const COLORS = {
  RED: '#ff0000',
  GREEN: '#00ff00',
  BLUE: '#0000ff',
}

//const backgroundImg = new Image();
//const backgroundImg = backgroundImage;


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


const drawMunition = (
  ctx: CanvasRenderingContext2D,
  { x, y }: { x: number; y: number },
  color: string
) => {
  //开始一条新的路径
  ctx.beginPath()
  //设置填充颜色为指定的颜色
  ctx.fillStyle = color
  //绘制圆弧路径, (x,y)=centre de circle, 0 和 2 * Math.PI 分别是圆弧的起始角度和结束角度，表示从 0 到 2π 画一个完整的圆
  ctx.arc(x, y, conf.MUNITION, 0, 2 * Math.PI)
  //填充路径，绘制圆形
  ctx.fill()
}
// //Canvas 边界的矩形，并设置边界的线宽
// const limites = (ctx: CanvasRenderingContext2D) => {
//   const { height, width } = ctx.canvas
//   ctx.strokeRect(0, 0, width, height)
//   //定义绘制矩形边界的线宽。
//   ctx.lineWidth = 15;
// } 
// Canvas 边界的矩形，并设置两侧边界的线宽
const limites = (ctx: CanvasRenderingContext2D) => {
  const { height, width } = ctx.canvas;
  // 保存默认的线宽
  const defaultLineWidth = ctx.lineWidth;
  const defaultStrokeStyle = ctx.strokeStyle;
  
  // 设置两侧边界的线宽
  ctx.lineWidth = 10;
   ctx.strokeStyle = 'slategray'; 
  // 绘制左边边界
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, height);
  ctx.stroke();
  // 绘制右边边界
  ctx.beginPath();
  ctx.moveTo(width, 0);
  ctx.lineTo(width, height);
  ctx.stroke();
  // 恢复默认的线宽
  ctx.lineWidth = defaultLineWidth;
  ctx.strokeStyle = defaultStrokeStyle;
};

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

// 加载飞机图像资源
const planeImg = new Image();
planeImg.src = playerImage; // 替换为实际的飞机图像路径

// 绘制飞机的函数planeImg.
const drawPlane = (
  ctx: CanvasRenderingContext2D, 
  { x, y }: { x: number; y: number }
) => {
  // 确保飞机图像已经加载完成
  if (planeImg.complete) {

    //  ctx.drawImage(planeImg, x, y, planeImg.width, planeImg.height, x, y, newWidth, newHeight);
    ctx.drawImage(planeImg, x-25, y-50, conf.player_Width, conf.player_Height);
  } else {
    // 如果图像还没有加载完成，等待加载完成后再绘制
    planeImg.onload = () => {
    //  ctx.drawImage(planeImg, x, y, planeImg.width, planeImg.height, x, y, newWidth, newHeight);
    ctx.drawImage(planeImg, x-25, y-50, conf.player_Width, conf.player_Height);

    };
  }
};

const heartImg = new Image();
heartImg.src = redHeart; // 替换为您的心形图像路径

const heart_pertImg = new Image();
heart_pertImg.src = whiteHeart; // 替换为您的心形图像路径

// 在画布上绘制心形图像
const drawHearts = (ctx: CanvasRenderingContext2D, lives: number) => {
  const heartWidth = heartImg.width; // 心形图像的宽度
  const heartHeight = heartImg.height; // 心形图像的高度
  const offsetX = ctx.canvas.width -50; // 心形图像绘制的起始 x 坐标
  const offsetY = 20; // 心形图像绘制的起始 y 坐标
  const spacing = 10; // 心形图像之间的间距
  const heartCount = 5; // 总共的心形图案数量

  // 循环绘制生命值图案
  for (let i = 0; i < heartCount; i++) {
    const scaledWidth = heartWidth / 8; // 缩小后的宽度
    const scaledHeight = heartHeight / 8; // 缩小后的高度
    const scaledOffsetX = offsetX - i * (scaledWidth + spacing); // 缩小后的 x 坐标
    const scaledOffsetY = offsetY; // 不需要缩小 y 坐标
    // 如果当前索引小于生命值，则绘制心形图案
    if (i < lives) {
      // 绘制心形图案
      ctx.drawImage(heartImg, scaledOffsetX, scaledOffsetY, scaledWidth, scaledHeight);
    } else {
      // 否则，绘制其他图案（例如，团）
      ctx.drawImage(heart_pertImg, scaledOffsetX, scaledOffsetY, scaledWidth, scaledHeight);
    }
  }
};


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
  // state.pos.map((c) =>
  //   drawCirle(ctx, c.coord, computeColor(c.life, conf.BALLLIFE, COLORS.RED))
  // )

  state.planeshot.map((c) =>
    drawMunition(ctx, c.coord, computeColor(c.life, 1, COLORS.BLUE))
  )

  state.ennemis.map((c) =>
    drawCirle(ctx, c.coord, computeColor(c.life, conf.BALLLIFE, COLORS.RED))
  )

  //使用 drawCirle 函数绘制了玩家飞机，其位置和颜色也由游戏状态中的信息确定
  drawCirle(ctx, state.plane.coord, computeColor(state.plane.life, conf.BALLLIFE, COLORS.GREEN))
  
  //drawPlane(ctx, state.plane.coord);

  if (state.plane.life !== state.plane.prevLife) {
    // 检查闪烁状态，如果正在闪烁且闪烁计数器为偶数，则绘制飞机
    if (state.plane.blinkCounter % 5 === 0) {
      drawPlane(ctx, state.plane.coord); // 绘制飞机
    }
    // 递增闪烁计数器
    state.plane.blinkCounter++;
    // 如果闪烁计数器超过闪烁总次数，则重置计数器，并将飞机的 prevLife 更新为当前生命值，并取消闪烁状态
    if (state.plane.blinkCounter >= conf.BLINK_TOTAL_COUNT) {
      state.plane.blinkCounter = 0;
      state.plane.prevLife = state.plane.life;
    }
  } else {
    // 如果生命值未发生变化，则正常绘制飞机
    drawPlane(ctx, state.plane.coord); // 绘制飞机
  }

  //drawTriangle(ctx, state.plane.coord, computeColor(state.plane.life, conf.BALLLIFE, COLORS.GREEN))

  //diplayGameText(ctx)(state)
  drawHearts(ctx, state.plane.life); // 绘制玩家剩余生命值对应的心形图像
  console.log("life =", state.plane.life);
  console.log("life precedent =", state.plane.prevLife);

  // 显示得分
  ctx.font = '24px Arial';
  ctx.fillStyle = 'white';
  ctx.fillText(`Score: ${state.score}`, 20, 40);
  console.log("score = ",state.score)
  //使用 drawCirle 函数绘制了玩家飞机，其位置和颜色也由游戏状态中的信息确定
  if (state.endOfGame) {
    const text = 'END';
    ctx.font = '48px Arial';
    ctx.fillStyle = 'red'; // 设置文本颜色为红色
    ctx.fillText(text, state.size.width / 2 - 80, state.size.height / 2);
  }
}     
