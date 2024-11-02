let commands = [];
let position = { x: 1, y: 6 };  // プレイヤーの初期位置
let isClear = false; // クリア状態のフラグ
let obstacles = []; // お邪魔ブロックの位置リスト

document.addEventListener("DOMContentLoaded", function () {
    movePlayer(position.x, position.y);  // 初期位置に配置
    randomizeGoal();  // ゴールの初期位置をランダムに設定
    hideClearScreen(); // ページロード時にクリア画面を非表示に設定
});

function movePlayer(x, y) {
    const player = document.getElementById('player');
    const newX = x * 50;
    const newY = y * 50;
    player.style.left = newX + 'px';
    player.style.top = newY + 'px';
}

function moveGoal(x, y) {
    const goal = document.getElementById('goal');
    const newX = x * 50;
    const newY = y * 50;
    goal.style.left = newX + 'px';
    goal.style.top = newY + 'px';
}

function randomizeGoal() {
    let randomX, randomY;
    do {
        randomX = Math.floor(Math.random() * 8);  // 0から7までのランダムな整数
        randomY = Math.floor(Math.random() * 8);
    } while (randomX === position.x && randomY === position.y); // スタート地点と重ならないようにする
    moveGoal(randomX, randomY);
}

function resetBlocks() {
    commands = [];
    const dropArea = document.getElementById('drop-area');
    while (dropArea.firstChild) {
        dropArea.removeChild(dropArea.firstChild);
    }
    position = { x: 1, y: 6 };
    movePlayer(1, 6);
    isClear = false; // クリア状態をリセット
    randomizeGoal();  // ゴールの位置をランダムに変更
    clearObstacles(); // お邪魔ブロックもリセット
    hideClearScreen(); // クリア画面を非表示に設定
}

function resetCommands() {
    // コマンドブロックのみリセットする
    commands = [];
    const dropArea = document.getElementById('drop-area');
    while (dropArea.firstChild) {
        dropArea.removeChild(dropArea.firstChild);
    }
}

function executeBlocks() {
    commands.forEach((command, index) => {
        setTimeout(() => {
            if (command === 'up') position.y = Math.max(0, position.y - 1);
            if (command === 'down') position.y = Math.min(7, position.y + 1);
            if (command === 'left') position.x = Math.max(0, position.x - 1);
            if (command === 'right') position.x = Math.min(7, position.x + 1);

            // お邪魔ブロックの位置にいるかチェック
            if (isObstacle(position.x, position.y)) {
                alert("お邪魔ブロックにぶつかりました！");
                resetBlocks(); // ぶつかったらリセット
                return;
            }

            movePlayer(position.x, position.y);

            // 最後のコマンドが実行されたときにクリアを確認
            if (index === commands.length - 1) {
                checkCollision();
            }
        }, index * 500);
    });
}

function checkCollision() {
    const goal = document.getElementById('goal');
    const goalX = parseInt(goal.style.left) / 50;
    const goalY = parseInt(goal.style.top) / 50;

    if (!isClear && position.x === goalX && position.y === goalY) {
        isClear = true; // クリア状態を更新
        showClearScreen();
    }
}

function showClearScreen() {
    const clearScreen = document.getElementById('clear-screen');
    clearScreen.style.display = 'flex';
}

function hideClearScreen() {
    const clearScreen = document.getElementById('clear-screen');
    clearScreen.style.display = 'none';
    resetBlocks(); // 盤面もリセット
}

function generateObstacles() {
    clearObstacles(); // 既存のお邪魔ブロックをクリア

    // ランダムに1~5個のお邪魔ブロックを生成
    const obstacleCount = Math.floor(Math.random() * 5) + 1;
    for (let i = 0; i < obstacleCount; i++) {
        let obstacleX, obstacleY;
        do {
            obstacleX = Math.floor(Math.random() * 8);
            obstacleY = Math.floor(Math.random() * 8);
        } while (
            (obstacleX === position.x && obstacleY === position.y) || // スタート地点
            (obstacleX === parseInt(goal.style.left) / 50 && obstacleY === parseInt(goal.style.top) / 50) || // ゴール地点
            isObstacle(obstacleX, obstacleY) // 既に障害物がある位置
        );

        obstacles.push({ x: obstacleX, y: obstacleY });
        createObstacleElement(obstacleX, obstacleY);
    }
}

function createObstacleElement(x, y) {
    const obstacle = document.createElement("div");
    obstacle.classList.add("obstacle");
    obstacle.style.left = x * 50 + "px";
    obstacle.style.top = y * 50 + "px";
    document.querySelector(".grid-container").appendChild(obstacle);
}

function clearObstacles() {
    obstacles = []; // お邪魔ブロックの位置リストをクリア
    const existingObstacles = document.querySelectorAll(".obstacle");
    existingObstacles.forEach(obstacle => obstacle.remove());
}

function isObstacle(x, y) {
    return obstacles.some(obstacle => obstacle.x === x && obstacle.y === y);
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    const draggedElement = document.getElementById(data);
    const clone = draggedElement.cloneNode(true);
    ev.target.appendChild(clone);
    const direction = data.split('-')[1];
    commands.push(direction);
}
