import * as conf from './conf'
import React, { useRef, useEffect, useState } from 'react'
import { State, step, click, mouseMove, endOfGame, changeDirection, moveX, moveY } from './state'
import { render } from './renderer'
import './Canvas.css'

const randomInt = (max: number) => Math.floor(Math.random() * max)
const randomSign = () => Math.sign(Math.random() - 0.5)

const initCanvas =
  (iterate: (ctx: CanvasRenderingContext2D) => void) =>
  (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    requestAnimationFrame(() => iterate(ctx))
  }

const Canvas = ({ height, width }: { height: number; width: number }) => {
  const initialState: State = {
    plane: {
      life: conf.BALLLIFE,
      coord: {
        x: (width - 120)/2 + 60,
        y: (height - 120)/2 + 60,
        dx: 0,
        dy: 0,
      },
    },

    ennemis: new Array(10). fill(1).map((_) => ({
      life: conf.BALLLIFE,
      coord: {
        x: randomInt(width - 120) + 60,
        y: 10,
        dx: 4 * randomSign(),
        dy: 1,
      },
    })),

    pos: new Array(conf.NBBALL). fill(1).map((_) => ({
      life: conf.BALLLIFE,
      coord: {
        x: randomInt(width - 120) + 60,
        y: randomInt(height - 120) + 60,
        dx: 4 * randomSign(),
        dy: 4 * randomSign(),
      },
    })),
    size: { height, width },
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

  const onPress = (e: KeyboardEvent) => {
    console.log('press')
    state.current = changeDirection(state.current)(e)
  }
  /*
  const moveDown = () => {
    console.log('moveDown')
    state.current = moveY(state.current)(-1)
  }
  */
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
  
  //const [s, dispatch] = useReducer(reducer, initialState)
  
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
    /*
    return () => {
      ref.current.removeEventListener('keydown', moveDown)
    }
    */
  }, [downPress, upPress, leftPress, rightPress])
  
  useEffect(() => {
    if (ref.current) {
      initCanvas(iterate)(ref.current)
      ref.current.addEventListener('click', onClick)
      ref.current.addEventListener('mousemove', onMove)
      //ref.current.addEventListener('keydown', onPress)
    }
    return () => {
      ref.current.removeEventListener('click', onMove)
      ref.current.removeEventListener('mousemove', onMove)
      //ref.current.removeEventListener('press', onPress)
    }
  }, [])
  //<canvas {...{ height, width, ref }} />  
  return (
    <div className="canvas-container"> {/* 使用带有背景样式的容器 */}
      <canvas {...{ height, width, ref }} />
  </div>)
}

export default Canvas
