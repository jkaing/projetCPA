import React from 'react';
import { useState, useEffect } from 'react';
//import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './Main.css'; // 导入样式文件
import GamePage from './page/game/Game';
import ShopPage from './page/shop/Shop';


function Main() {
//    const history = useHistory();
    const[page,setPage]=useState("welcome_page");
    const [isStart, setStart] = useState(false);
 
    useEffect(() => {
        console.log("page:", page);
        console.log("isStart:", isStart);
      }, [page, isStart]);
      
    const handleStartGame = (ev) => {
        ev.preventDefault();
        setStart(true);
        setPage("game_page");
        //console.log(page); // 在页面状态更新之前打印
        //console.log(isStart); // 在isStart状态更新之前打印
      }
      

    const handleShop = (ev) => {
        ev.preventDefault();
        setStart(false);
        setPage("shop_page");
        //console.log(page);
        //console.log(isStart);

    }

    //根据当前页面状态渲染不同的页面组件
    const renderPage = () => {
        switch (page) {
            case "game_page":
                return <GamePage />;
            case "shop_page":
                return <ShopPage />;
            default:
                return (
                    <div className="main">
                        <h1>Welcome to Space Shooter Game!</h1>
                        <div className='different_page'>
                            <button onClick={handleStartGame}>Start Game</button>
                            <button onClick={handleShop}>Shop</button>
                        </div>
                    </div>
                );
        }
    };

    return renderPage();

}

export default Main;
