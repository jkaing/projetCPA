import React from 'react';
//import { useHistory } from 'react-router-dom'; // 如果你使用了 React Router，可以使用 useHistory 来实现路由导航
import './Main.css'; // 导入样式文件

function Main() {
    //const history = useHistory();

    const handleStartGame = () => {
        // 点击开始游戏按钮时触发的函数
        // 可以在这里添加开始游戏逻辑
        // 比如导航到游戏页面
        //history.push('/game'); // 假设游戏页面的路由是 '/game'
    }

    return (
        <div className="main">
            <h1>Welcome to Space Shooter Game</h1>
            <p>Get ready to experience the thrill of space battles!</p>
        </div>
    );
}

export default Main;
