import * as conf from './conf'
import React, { useRef, useEffect, useState } from 'react'
import { State, step, click, mouseMove, endOfGame, moveX, moveY } from './state'
import { render } from './renderer'
import './Canvas.css'

//生成一个小于指定最大值的随机整数
const randomInt = (max: number) => Math.floor(Math.random() * max)
// 用于生成一个随机的正负号 
const randomSign = () => Math.sign(Math.random() - 0.5)

//用于初始化 Canvas，并启动游戏循环
//通常会将 Canvas 组件的渲染函数作为参数传入 initCanvas 函数，以便在 Canvas 初始化完成后开始渲染游戏画面
const initCanvas =
  (iterate: (ctx: CanvasRenderingContext2D) => void) =>
  (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    //目的是让传入的 iterate 函数在下一次浏览器重绘之前执行，实现了在 Canvas 上执行游戏循环的功能
    requestAnimationFrame(() => iterate(ctx))
  }

const Canvas = ({ height, width }: { height: number; width: number }) => {
  // 初始化游戏的初始状态
  const initialState: State = {
    plane: {
      // 设置玩家飞机的生命值
      life: conf.PLAYERLIFE,
      prevLife: conf.PLAYERLIFE,
      blinkCounter: 0,
      shootCounter: 30,
      // 设置玩家飞机的初始位置 
      coord: {
        x: (width - 120)/2 + 60,
        y: height - 120,
        dx: 0,
        dy: 0,
      },
    
    },
    planeshot: new Array(0)/*. fill(1).map((_) => ({
      life: conf.BALLLIFE,
      coord: {
        x: randomInt(width - 120) + 60,
        y: height - conf.RADIUS - 1,
        dx: 0,
        dy: -(4 * randomSign() + 5) * 2,
      },
    }))*/,
    // 初始化游戏中的球体数组
    ennemis: new Array(10). fill(1).map((_) => ({
      life: conf.BALLLIFE,
      coord: {
        x: randomInt(width - 120) + 60,
        y: conf.RADIUS + 1,
        dx: 0,
        dy: 4 * randomSign() + 5,
      },
    })),
    // pos: new Array(conf.NBBALL). fill(1).map((_) => ({
    //   // 设置每个球体的生命值
    //   life: conf.BALLLIFE,
    //   // 设置每个球体的随机初始位置和速度
    //   coord: {
    //     x: randomInt(width - 120) + 60,
    //     y: randomInt(height - 120) + 60,
    //     dx: 4 * randomSign(),
    //     dy: 4 * randomSign(),
    //   },
    // })),
    // 设置游戏的尺寸
    size: { height, width },
    // 设置游戏的结束状态，默认为 true

    score: 0,
    
    endOfGame: true,
  }
  
  // 创建一个引用，用于引用 Canvas 元素
  const ref = useRef<any>()
  // 创建一个引用，用于引用游戏的状态
  const state = useRef<State>(initialState)

  //会在每一帧中更新游戏状态并渲染画面
  const iterate = (ctx: CanvasRenderingContext2D) => {
    // 在每一帧中更新游戏状态
    state.current = step(state.current)
    // 判断游戏是否结束
    state.current.endOfGame = !endOfGame(state.current)
    // 渲染游戏画面
    render(ctx)(state.current)
    // 如果游戏未结束，则继续执行游戏循环
    if (!state.current.endOfGame) requestAnimationFrame(() => iterate(ctx))
  }

  // 处理鼠标点击事件
  const onClick = (e: PointerEvent) => {
    state.current = click(state.current)(e)
  }

  // 处理鼠标移动事件
  const onMove = (e: PointerEvent) => {
    state.current = mouseMove(state.current)(e)
  }

  //自定义 Hook，它用于检测用户是否按下了特定的键盘按键, targetKey，表示要检测的目标按键
  const useKeyPress = function(targetKey:string) {
    //用于记录目标按键是否被按下
    const [keyPressed, setKeyPressed] = useState(false);

    //来注册键盘按下和弹起事件的监听器
    React.useEffect(() => {
      // 键盘按下事件的处理函数
      const downHandler = ({ key }: { key: string}) => {
        if (key === targetKey) {
          //表示目标按键被按下
          setKeyPressed(true);
        }
      }
      // 键盘弹起事件的处理函数
      const upHandler = ({ key }: {key: string}) => {
        if (key === targetKey) {
          //表示目标按键被释放
          setKeyPressed(false);
        }
      }

      //将键盘按下和弹起事件的监听器注册到全局的 window 对象上，从而能够在整个页面范围内监听键盘事件, ，并在相应事件发生时调用相应的处理函数，从而实现对用户键盘操作的响应。
      window.addEventListener("keydown", downHandler);
      window.addEventListener("keyup", upHandler);
      
      //通过返回这个清理函数，我们可以确保在组件销毁时，及时地清除注册的事件监听器，保持代码的健壮性和可维护性。
      return () => {
        //移除了之前注册的键盘按下和弹起事件的监听器。这样做可以确保在组件卸载时，移除对键盘事件的监听，防止监听器在组件卸载后仍然持续存在，造成内存泄漏。
        window.removeEventListener("keydown", downHandler);
        window.removeEventListener("keyup", upHandler);
      };
    }, [targetKey])

    //表示目标按键是否被按下
    return keyPressed;
  };
  
  //分别用于检测用户是否按下了上、下、左、右方向键。
  const upPress = useKeyPress("ArrowUp")
  const downPress = useKeyPress("ArrowDown")
  const leftPress = useKeyPress("ArrowLeft")
  const rightPress = useKeyPress("ArrowRight")
  
  //根据用户按下的方向键来实现对游戏角色移动的响应，并将游戏状态更新为相应的新状态
  useEffect(() => {
    if (downPress) {
      console.log('downPress')
      state.current = moveY(state.current)(1)
    }
    if (upPress) {
      console.log('upPress')
      state.current = moveY(state.current)(-1)
    }
    if (leftPress) {
      console.log('leftPress')
      state.current = moveX(state.current)(-1)
    }
    if (rightPress) {
      console.log('rightPress')
      state.current = moveX(state.current)(1)
    }
  }, [downPress, upPress, leftPress, rightPress])
  
  useEffect(() => {
    if (ref.current) {
      initCanvas(iterate)(ref.current)
      ref.current.addEventListener('click', onClick)
      ref.current.addEventListener('mousemove', onMove)
    }
    return () => {
      ref.current.removeEventListener('click', onMove)
      ref.current.removeEventListener('mousemove', onMove)
    }
  }, [])

  //<canvas {...{ height, width, ref }} />  
  return (
    <div className="canvas-container"> {/* 使用带有背景样式的容器 */}
      <canvas {...{ height, width, ref }} />
  </div>)
}

export default Canvas