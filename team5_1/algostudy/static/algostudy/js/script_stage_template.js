//script_stage_template.js
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

let startPoint = { x: 0, y: 0 };
let goalPoint = { x: 0, y: 0 };
let gridSize = 0;

document.addEventListener("DOMContentLoaded", () => {
    const gridContainer = document.querySelector('.grid');
    const executeButton = document.getElementById("executeBlocks");
    const resetButton = document.getElementById("resetButton");
    const player = createPlayerElement();
    let currentStageData;

    // ステージデータの読み込み
    loadStageData();

    // コマンドボタンのイベント設定
    executeButton.addEventListener("click", executeAllCommands);
    resetButton.addEventListener("click", resetCommands);

    function createPlayerElement() {
        const img = document.createElement('img');
        img.id = 'player';
        img.style.position = 'absolute';
        img.style.top = '0';
        img.style.left = '0';
        return img;
    }

    async function loadStageData() {
        try {
            const response = await fetch('/static/algostudy/json/stage.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            const stageNumber = parseInt(document.getElementById('stageId').textContent) - 1;

            currentStageData = data.stages[stageNumber];
            initializeStage(currentStageData);
            startPoint = currentStageData.start;
            goalPoint = currentStageData.goal;
            gridSize = currentStageData.gridSize;
        } catch (error) {
            console.error("ステージデータの読み込みエラー:", error);
        }
    }

    function initializeStage(stageData) {
        gridContainer.innerHTML = '';
        gridContainer.style.gridTemplateColumns = `repeat(${stageData.gridSize}, 50px)`;
        gridContainer.style.gridTemplateRows = `repeat(${stageData.gridSize}, 50px)`;

        stageData.grid.forEach((row, y) => {
            row.forEach((cell, x) => {
                const cellElement = document.createElement('div');
                cellElement.classList.add('cell');
                cellElement.dataset.x = x;
                cellElement.dataset.y = y;
                if (cell === 1) cellElement.classList.add('obstacle');
                gridContainer.appendChild(cellElement);
            });
        });

        player.src = stageData.playerImage;
        movePlayer(stageData.start.x, stageData.start.y);

        const goalCell = document.querySelector(`.cell[data-x="${stageData.goal.x}"][data-y="${stageData.goal.y}"]`);
        goalCell.classList.add('goal');
    }

    function movePlayer(x, y) {
        const targetCell = document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
        if (targetCell && !targetCell.classList.contains('obstacle')) {
            targetCell.appendChild(player);
        }
    }

    async function executeAllCommands() {
        const commands = Array.from(dropArea.querySelectorAll('.command')).map(cmd => cmd.id);
        for (let i = 0; i < commands.length; i++) {
            await new Promise(resolve => setTimeout(() => {
                executeCommands(commands[i]);
                resolve();
            }, i * 500));
        }

        if (playerPosition.x === goalPoint.x - startPoint.x && playerPosition.y === goalPoint.y - startPoint.y) {
            displayMessage("Cleared");
        } else {
            displayMessage("Failed");
        }
    }

    function resetCommands() {
        // Reset logic here if needed
    }
});

// ドラッグ＆ドロップ処理の設定
document.querySelectorAll('.command').forEach(command => {
    command.draggable = true;
    command.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('commandId', command.id);
    });
});

const dropArea = document.getElementById('drop-area');
dropArea.addEventListener('dragover', (event) => event.preventDefault());
dropArea.addEventListener('drop', handleDrop);

function handleDrop(event) {
    event.preventDefault();
    const commandId = event.dataTransfer.getData('commandId');
    const commandElement = document.createElement('div');
    commandElement.id = commandId;
    commandElement.textContent = document.getElementById(commandId).textContent;
    commandElement.classList.add('command');
    dropArea.appendChild(commandElement);
}

let playerPosition = startPoint;
let playerDirection = 0;
const obstacles = Array.from(document.querySelectorAll('.grid .cell')).filter(cell => cell.classList.contains('obstacle'));
const playArea = { minX: -1, maxX: 5, minY: -5, maxY: 1 };

function moveForward() {
    const directions = {
        0: { x: 0, y: -1 },
        90: { x: 1, y: 0 },
        180: { x: 0, y: 1 },
        270: { x: -1, y: 0 }
    };

    const { x, y } = directions[playerDirection];
    const newX = playerPosition.x + x;
    const newY = playerPosition.y + y;
    playerPosition = { x: newX, y: newY };
            updatePlayerPosition();
    // if (newX >= playArea.minX && newX <= playArea.maxX && newY >= playArea.minY && newY <= playArea.maxY) {
    //     const targetCell = document.querySelector(`[data-x="${newX}"][data-y="${newY}"]`);
    //     if (!targetCell.classList.contains('obstacle')) {
    //         playerPosition = { x: newX, y: newY };
    //         updatePlayerPosition();
    //     } else {
    //         alert("壁があるから進めない。");
    //     }
    // } else {
    //     alert("この先はエリア範囲外です。");
    //     console.log(newX+","+newY);
    //     console.log("player(" + playerPosition.x + ", "+playerPosition.y+"), lim{max("+playArea.maxX+", "+playArea.maxY+"),min("+playArea.minX+", "+playArea.minY+")}");
    //     console.log("start("+startPoint.x+", "+startPoint.y+"), goal("+goalPoint.x+", "+goalPoint.y+")");
    //     console.log("grid:" + gridSize);
    // }
}

function turnRight() {
    playerDirection = (playerDirection + 90) % 360;
    player.style.transform = `rotate(${playerDirection}deg)`;
}

function turnLeft() {
    playerDirection = (playerDirection + 270) % 360;
    player.style.transform = `rotate(${playerDirection}deg)`;
}

function turnBack() {
    playerDirection = (playerDirection + 180) % 360;
    player.style.transform = `rotate(${playerDirection}deg)`;
}

function repeatCommand() {
    console.log("繰り返し");
}

function handleWallCollision() {
    console.log("壁にぶつかったら...");
}

function updatePlayerPosition() {
    player.style.left = `${playerPosition.x * 50}px`;
    player.style.top = `${playerPosition.y * 50}px`;
}

function executeCommands(command) {
    const commands = {
        "command-move-forward": moveForward,
        "command-turn-right": turnRight,
        "command-turn-left": turnLeft,
        "command-turn-back": turnBack,
        "command-repeat": repeatCommand,
        "command-wall-collision": handleWallCollision
    };

    (commands[command] || (() => console.warn(`未定義のコマンドID: ${command}`)))();
}

function displayMessage(message) {
    document.getElementById('message').textContent = message;
}


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
            botMessage.textContent = "GPT: " + data.reply;
            chatBox.appendChild(botMessage);
        })
        .catch(error => {
            console.error("Error:", error);
            const errorMessage = document.createElement("p");
            errorMessage.textContent = "エラーが発生しました。もう一度お試しください。";
            chatBox.appendChild(errorMessage);
        });

    // 入力フィールドをクリア
    input.value = "";

    // チャットボックスを最新メッセージにスクロール
    chatBox.scrollTop = chatBox.scrollHeight;
}

