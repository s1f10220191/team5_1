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

let commands = [];
let position = { x: 2, y: 2 };  // プレイヤーの初期位置

document.addEventListener("DOMContentLoaded", function () {
    movePlayer(position.x, position.y);  // 初期位置に配置
    moveGoal(3, 1);  // ゴールの初期位置を設定
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
    position = { x: 2, y: 2 };
    movePlayer(2, 2);
}

function executeBlocks() {
    let interval = 500;
    commands.forEach((command, index) => {
        setTimeout(() => {
            if (command === 'up') position.y = Math.max(0, position.y - 1);
            if (command === 'down') position.y = Math.min(4, position.y + 1);
            if (command === 'left') position.x = Math.max(0, position.x - 1);
            if (command === 'right') position.x = Math.min(4, position.x + 1);
            movePlayer(position.x, position.y);
        }, index * interval);
    });
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