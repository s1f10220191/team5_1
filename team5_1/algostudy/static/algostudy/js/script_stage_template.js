let commands = [];
let position = { x: 1, y: 6 };  // プレイヤーの初期位置
let isClear = false; // クリア状態のフラグ

document.addEventListener("DOMContentLoaded", function () {
    movePlayer(position.x, position.y);  // 初期位置に配置
    moveGoal(6, 1);  // ゴールの初期位置を設定
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

function resetBlocks() {
    commands = [];
    const dropArea = document.getElementById('drop-area');
    while (dropArea.firstChild) {
        dropArea.removeChild(dropArea.firstChild);
    }
    position = { x: 1, y: 6 };
    movePlayer(1, 6);
    isClear = false; // クリア状態をリセット
    hideClearScreen(); // クリア画面を非表示に設定
}

function executeBlocks() {
    commands.forEach((command, index) => {
        setTimeout(() => {
            if (command === 'up') position.y = Math.max(0, position.y - 1);
            if (command === 'down') position.y = Math.min(7, position.y + 1);
            if (command === 'left') position.x = Math.max(0, position.x - 1);
            if (command === 'right') position.x = Math.min(7, position.x + 1);
            movePlayer(position.x, position.y);
            checkCollision(); // 衝突を確認
        }, index * 500);
    });
}

function checkCollision() {
    if (!isClear && position.x === 6 && position.y === 1) { // ゴールとプレイヤーの位置が重なった場合
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
