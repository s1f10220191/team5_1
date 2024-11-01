
const count = 0;
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