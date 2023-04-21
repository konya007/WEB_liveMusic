const thumbMusic = document.querySelectorAll(".thumbnail-music")
const nameSong = document.querySelectorAll(".name-song")
const nameSinger = document.querySelectorAll(".name-singer")
const controlBtn = document.querySelectorAll(".control-items")
const statusControl = document.getElementById("statusControl")

const timeNow = document.getElementById("time-now")
const timeLength = document.getElementById("time-dur")
const progBar = document.getElementById("progbar2")
const volumebar = document.getElementById("volume")



const DOMStatusControl = [`<i class="fa-solid fa-play"></i>`, `<i class="fa-solid fa-pause"></i>`]
var jsonAlbum
var audioMain
var statusPlay = 'pause'
var nSong = 0
var cooldown = false
init()

function activeBtn() {

    controlBtn[1].onclick = async(e) => {
        if (nSong > 0) {
            if (cooldown == false) {
                pauseAudioMain()
                await APIMusic(1)
                nSong--;
                audioMain = new Audio(jsonAlbum[nSong]["link"])
                updateInfoMusic()
                playAudioMain()
            }
            checkCooldown()
        }
    }

    controlBtn[3].onclick = async(e) => {
        if (nSong < jsonAlbum.length - 1) {
            if (cooldown == false) {
                pauseAudioMain()
                await APIMusic(1)
                nSong++;
                audioMain = new Audio(jsonAlbum[nSong]["link"])
                updateInfoMusic()
                playAudioMain()
            }
            checkCooldown()
        }
    }

    controlBtn[2].onclick = (e) => {
        if (statusPlay == 'pause') {
            playAudioMain()
        } else {
            pauseAudioMain()
        }
    }
}

setInterval(async(e) => {
    timeLength.innerText = fommatTime(audioMain.duration)
    timeNow.innerText = fommatTime(audioMain.currentTime)
    progBar.style.width = (audioMain.currentTime / audioMain.duration) * 100 + "%"
}, 500)

volumebar.oninput = (e) => {
    audioMain.volume = (volumebar.value / 20)
}

function updateInfoMusic() {
    for (let i = 0; i < nameSong.length; i++) {
        nameSong[i].innerText = jsonAlbum[nSong]["name"]
    }
    for (let i = 0; i < nameSinger.length; i++) {
        nameSinger[i].innerText = jsonAlbum[nSong]["singer"]
    }
    for (let i = 0; i < thumbMusic.length; i++) {
        thumbMusic[i].style.backgroundImage = `url(${jsonAlbum[nSong]["img"]})`
    }
}

async function init() {
    controlBtn[2].innerHTML = DOMStatusControl[0]
    await APIMusic(1)
    audioMain = new Audio(jsonAlbum[nSong]["link"])
    audioMain.volume = 0.1
    volumebar.value = 2
    updateInfoMusic()
}

function playAudioMain() {
    statusPlay = 'play'
    audioMain.play()
    controlBtn[2].innerHTML = DOMStatusControl[1]

}

function pauseAudioMain() {
    controlBtn[2].innerHTML = DOMStatusControl[0]
    statusPlay = 'pause'
    audioMain.pause()
}



document.onkeydown = (e) => {
        if (e.key == ' ') {
            controlBtn[2].onclick()
        }
    }
    //Chuyển bài



function checkCooldown() {
    if (cooldown == true) {
        alert("Sống chậm lại! Không ai tranh ăn cỗ của bạn đâu!")
    } else {
        cooldown = true
        setTimeout(() => {
            cooldown = false
        }, 2000)
    }
}

function fommatTime(n) {
    n = Math.round(n);
    var m = Math.floor(n / 60);
    var s = n % 60;
    if (m < 10) { m = '0' + m }
    if (s < 10) { s = '0' + s }
    return m + ':' + s
}

async function APIMusic(x, y) {
    if (x == 1) {
        await fetch('https://64425c0376540ce2258a2255.mockapi.io/v1/Music', {
            method: 'GET',
            headers: { 'content-type': 'application/json' },
        }).then(res => {
            if (res.ok) {
                return res.json();
            }
        }).then(data => {
            jsonAlbum = data
        }).catch(error => {
            alert("Có lỗi! Vui lòng thử lại!!!")
        })
    }

}