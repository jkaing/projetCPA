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
      // 设置玩家飞机的初始位置 
      coord: {
        x: (width - 120)/2 + 60,
        y: (height - 120)/2 + 60,
        dx: 0,
        dy: 0,
      },
    },
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
    pos: new Array(conf.NBBALL). fill(1).map((_) => ({
      // 设置每个球体的生命值
      life: conf.BALLLIFE,
      // 设置每个球体的随机初始位置和速度
      coord: {
        x: randomInt(width - 120) + 60,
        y: randomInt(height - 120) + 60,
        dx: 4 * randomSign(),
        dy: 4 * randomSign(),
      },
    })),
    // 设置游戏的尺寸
    size: { height, width },
    // 设置游戏的结束状态，默认为 true
    endOfGame: true,
  }
  
  const ref = useRef<any>()
  const state = useRef<State>(initialState)

  const iterate = (ctx: CanvasRenderingContext2D) => {
    state.current = step(state.current)
    state.current.endOfGame = !endOfGame(state.current)
    render(ctx)(state.current)
    if (!state.current.endOfGame) requestAnimationFrame(() => iterate(ctx))
  }

  const onClick = (e: PointerEvent) => {
    state.current = click(state.current)(e)
  }

  const onMove = (e: PointerEvent) => {
    state.current = mouseMove(state.current)(e)
  }

  const useKeyPress = function(targetKey:string) {
    const [keyPressed, setKeyPressed] = useState(false);

    React.useEffect(() => {
      const downHandler = ({ key }: { key: string}) => {
        if (key === targetKey) {
          setKeyPressed(true);
        }
      }

      const upHandler = ({ key }: {key: string}) => {
        if (key === targetKey) {
          setKeyPressed(false);
        }
      }

      window.addEventListener("keydown", downHandler);
      window.addEventListener("keyup", upHandler);
  
      return () => {
        window.removeEventListener("keydown", downHandler);
        window.removeEventListener("keyup", upHandler);
      };
    }, [targetKey])

    return keyPressed;
  };
  
  const upPress = useKeyPress("ArrowUp")
  const downPress = useKeyPress("ArrowDown")
  const leftPress = useKeyPress("ArrowLeft")
  const rightPress = useKeyPress("ArrowRight")
    
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