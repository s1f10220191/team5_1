
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

const count = 0;
const bgm = document.getElementById('BGM')

function audio_play(){
    document.getElementById('btn-audio').currentTime = 0;
    document.getElementById('btn-audio').play();
}

document.addEventListener('click', function(event){
    if (event.button === 0){
        audio_play();
    }
});

