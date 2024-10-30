const startPoint = { "x": 0, "y": 0 };

document.addEventListener("DOMContentLoaded", () => {
    const gridContainer = document.querySelector('.grid');
    const executeButton = document.getElementById("executeBlocks");
    const player = document.createElement('img');
    player.id = 'player';

    let currentStageData;

    // ステージデータの読み込み関数
    async function loadStageData() {
        try {
            const response = await fetch('/static/algostudy/json/stage.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();

            // HTMLのstageIdからステージ番号を取得
            const stageNumber = parseInt(document.getElementById('stageId').textContent) - 1;

            // 取得したステージ番号に対応するデータをロード
            currentStageData = data.stages[stageNumber];
            initializeStage(currentStageData);
            startPoint = getStartPoint(currentStageData);
        } catch (error) {
            console.error("ステージデータの読み込みエラー:", error);
        }
    }

    // スタート地点の座標取得
    function getStartPoint(stageData) {
        return stageData.start;
    }

    // グリッドの初期化関数
    function initializeStage(stageData) {
        gridContainer.innerHTML = ''; // グリッドをクリア
        gridContainer.style.gridTemplateColumns = `repeat(${stageData.gridSize}, 50px)`;
        gridContainer.style.gridTemplateRows = `repeat(${stageData.gridSize}, 50px)`;

        // グリッドを生成
        stageData.grid.forEach((row, y) => {
            row.forEach((cell, x) => {
                const cellElement = document.createElement('div');
                cellElement.classList.add('cell');
                cellElement.dataset.x = x;
                cellElement.dataset.y = y;

                // 障害物の設定 (1の場合に障害物)
                if (cell === 1) {
                    cellElement.classList.add('obstacle');
                }

                gridContainer.appendChild(cellElement);
            });
        });

        // プレイヤーの初期位置を設定
        player.src = stageData.playerImage;
        movePlayer(stageData.start.x, stageData.start.y);

        // ゴールの設定
        const goalCell = document.querySelector(`.cell[data-x="${stageData.goal.x}"][data-y="${stageData.goal.y}"]`);
        goalCell.classList.add('goal');
    }

    // プレイヤーの移動
    function movePlayer(x, y) {
        const targetCell = document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
        if (targetCell && !targetCell.classList.contains('obstacle')) {
            targetCell.appendChild(player);

            player.style.position = 'absolute';
            player.style.top = '0';
            player.style.left = '0';

        }
    }

    // 実行ボタンクリックで関数を呼び出す
    executeButton.addEventListener("click", () => {
        const commands = Array.from(dropArea.querySelectorAll('.command')).map(cmd => cmd.id);
        commands.forEach((commandId, index) => {
            setTimeout(() => {  // 順次コマンド実行
                executeCommands(commandId);
            }, index * 1000); // 0.5秒ごとに実行 (適宜調整)
        });
    });

    loadStageData();  // ステージデータの読み込み
});

// コマンドのドラッグ＆ドロップ処理
document.querySelectorAll('.command').forEach(command => {
    command.draggable = true;
    command.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('commandId', command.id); // IDを設定
    });
});

const dropArea = document.getElementById('drop-area');
dropArea.addEventListener('dragover', (event) => {
    event.preventDefault(); // ドロップ許可
});

dropArea.addEventListener('drop', (event) => {
    event.preventDefault();
    const commandId = event.dataTransfer.getData('commandId');
    const commandElement = document.createElement('div');
    commandElement.id = commandId;
    commandElement.textContent = document.getElementById(commandId).textContent;
    commandElement.classList.add('command');
    dropArea.appendChild(commandElement);
});

let playerPosition = startPoint; // スタート位置
let playerDirection = 0; // 初期の向き（北）

// 各コマンド実行関数の例
function moveForward() {
    switch (playerDirection) {
        case 0:
            playerPosition.y -= 1;
        case 90:
            playerPosition.x += 1;
        case 180:
            playerPosition.y += 1;
        case 270:
            playerPosition.x -= 1;
    }
    updatePlayerPosition();
    console.log("前に進む");
}
function turnRight() {
    playerDirection = (playerDirection + 90) % 360;
    player.style.transform = `rotate(${playerDirection}deg)`;
    console.log("右に曲がる");
}

function turnLeft() {
    playerDirection = (playerDirection + 270) % 360;
    player.style.transform = `rotate(${playerDirection}deg)`;
    console.log("左に曲がる");
}

function turnBack() {
    playerDirection = (playerDirection + 180) % 360;
    player.style.transform = `rotate(${playerDirection}deg)`;
    console.log("後ろを向く");
}

function repeatCommand() {
    console.log("繰り返し");
}

function handleWallCollision() {
    console.log("壁にぶつかったら,,,");
}

function updatePlayerPosition() {
    const player = document.getElementById("player");
    player.style.left = `${playerPosition.x * 50}px`;
    player.style.top = `${playerPosition.y * 50}px`;
}

function executeCommands(command) {
    switch (command) {
        case "command-move-forward":
            // 前に進む関数を実行
            moveForward();
            break;
        case "command-turn-right":
            // 右に曲がる関数を実行
            turnRight();
            break;
        case "command-turn-left":
            // 左に曲がる関数を実行
            turnLeft();
            break;
        case "command-turn-back":
            // 後ろを向く関数を実行
            turnBack();
            break;
        case "command-repeat":
            // 繰り返し処理を実行
            repeatCommand();
            break;
        case "command-wall-collision":
            // 壁にぶつかったときの処理
            handleWallCollision();
            break;
        default:
            console.warn(`未定義のコマンドID: ${commandId}`);
    };
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('csrftoken');

function sendMessage() {
    const input = document.getElementById("chat-input");
    const chatBox = document.getElementById("chat-box");

    // ユーザーのメッセージをチャットに表示
    const userMessage = document.createElement("p");
    userMessage.textContent = "あなた: " + input.value;
    chatBox.appendChild(userMessage);

    // APIに質問を送信
    fetch('/chat/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')  // CSRFトークンを送信
        },
        body: JSON.stringify({ message: input.value })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            const botMessage = document.createElement("p");
            botMessage.textContent = "GPT: " + data.answer;
            chatBox.appendChild(botMessage);
        })
        .catch(error => console.error("Error:", error));

    // 入力フィールドをクリア
    input.value = "";
}