const gameContainer = document.querySelector('.game-container');
const player = document.querySelector('.player');
const customizePanel = document.querySelector('.customize-panel');
const customCodeInput = document.getElementById('customCode');
const showSettingsBtn = document.getElementById('showSettingsBtn');
const restartBtn = document.getElementById('restartBtn');

let playerPosition = 140;
let isGameOver = false;
let obstacleSpeed = 5;  // 障害物のスピード
let spawnFrequency = 1000;  // 障害物の生成頻度（ミリ秒）
let playerColor = '#00FF00';  // プレイヤーの色
let backgroundColor = '#FFD700';  // ゲームエリアの背景色
let obstacleIntervals = []; // 障害物の生成用のインターバルを格納

// カスタマイズ画面の表示と非表示
function toggleCustomizePanel() {
    customizePanel.classList.toggle('hidden');
}

const bgm = document.getElementById('BGM')
bgm.volume = 0.1;

function audio_play(){
    document.getElementById('btn-audio').currentTime = 0;
    document.getElementById('btn-audio').play();
}

document.addEventListener('click', function(event){
    if (event.button === 0){
        audio_play();
    }
});


function toggleBGM() {
    if (bgm.paused) {
        bgm.play();
      document.getElementById('toggleBGM').textContent = 'BGMを停止'; // ボタンのテキストを変更
    } else {
        bgm.pause();
      document.getElementById('toggleBGM').textContent = 'BGMを再生'; // ボタンのテキストを変更
    }
}

// プレイヤーの左右移動
document.addEventListener('keydown', (event) => {
    if (!isGameOver) { // ゲームオーバー時は動かさない
        if (event.key === 'ArrowLeft' && playerPosition > 0) {
            playerPosition -= 20;
            audio_play();
        } else if (event.key === 'ArrowRight' && playerPosition < 270) {
            playerPosition += 20;
            audio_play();
        }
        player.style.left = `${playerPosition}px`;
    }
});

// 障害物の生成
function createObstacle() {
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    obstacle.style.left = `${Math.floor(Math.random() * 10) * 30}px`;
    obstacle.style.top = '0px';
    gameContainer.appendChild(obstacle);

    let obstacleInterval = setInterval(() => {
        let obstacleTop = parseInt(obstacle.style.top);
        obstacle.style.top = `${obstacleTop + obstacleSpeed}px`;

        if (obstacleTop > 470 && Math.abs(playerPosition - parseInt(obstacle.style.left)) < 30) {
            gameOver();
        }

        if (obstacleTop > 500) {
            clearInterval(obstacleInterval);
            obstacle.remove();
        }
    }, 30);
    obstacleIntervals.push(obstacleInterval); // 障害物のインターバルを格納
}

// ゲームオーバー処理
function gameOver() {
    alert('ゲームオーバー！');
    isGameOver = true;
    document.querySelectorAll('.obstacle').forEach(ob => ob.remove());
    obstacleIntervals.forEach(interval => clearInterval(interval)); // すべての障害物インターバルをクリア
    obstacleIntervals = []; // リセット
     // 再スタートボタンを表示
}

// ゲーム再スタート
function restartGame() {
    isGameOver = false;
    playerPosition = 140; // プレイヤーの位置をリセット
    player.style.left = `${playerPosition}px`;
    player.style.backgroundColor = playerColor; // カスタマイズされたプレイヤーの色を適用
    gameContainer.style.backgroundColor = backgroundColor; // カスタマイズされた背景色を適用 //再スタートボタンを隠す
    startGame(); // ゲームを再スタート
}

// カスタマイズコードの適用
function applyCustomization() {
    try {
        eval(customCodeInput.value);
        player.style.backgroundColor = playerColor;
        gameContainer.style.backgroundColor = backgroundColor;
    } catch (error) {
        alert('カスタマイズコードが間違っています。');
    }
}

// ゲームの開始
function startGame() {
    if (isGameOver) return; // ゲームオーバーの場合、生成を停止
    createObstacle();
    setTimeout(startGame, spawnFrequency);  // spawnFrequency に基づき生成頻度を設定
}

startGame(); // 初回スタート
