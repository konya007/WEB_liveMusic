const thumbMusic = document.querySelectorAll(".thumbnail-music")
const nameSong = document.querySelectorAll(".name-song")
const nameSinger = document.querySelectorAll(".name-singer")
const controlBtn = document.querySelectorAll(".control-items")
const statusControl = document.getElementById("statusControl")

const timeNow = document.getElementById("time-now")
const timeLength = document.getElementById("time-dur")
const progBar = document.getElementById("progbar2")
const durBarHover = document.getElementById("progbar3")
const durBar = document.getElementById("progbar")
const volumebar = document.getElementById("volume")

const playListBox = document.getElementById("plbox")
var itemPlayList



const DOMStatusControl = [`<i class="fa-solid fa-play"></i>`, `<i class="fa-solid fa-pause"></i>`]
var jsonAlbum
var audioMain
var statusPlay = 'pause'
var nSong = 0
var cooldown = false

var volMusic = 0.5
var volInput = 10

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

durBar.onclick = (e) => {
    if (roleAd) {
        audioMain.currentTime = audioMain.duration * (e.offsetX / durBar.offsetWidth)

    }
}

durBar.onmousemove = (e) => {
    durBarHover.style.width = e.offsetX + 'px'
}

volumebar.oninput = (e) => {
    volInput = volumebar.value
    volMusic = (volumebar.value / 20)
    audioMain.volume = volMusic
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


var cooldownAutoNext = false
async function init() {
    controlBtn[2].innerHTML = DOMStatusControl[0]
    await APIMusic(1)
    audioMain = new Audio(jsonAlbum[nSong]["link"])
    audioMain.volume = volMusic
    volumebar.value = volInput
    updateInfoMusic()
    setInterval(async(e) => {
        timeLength.innerText = fommatTime(audioMain.duration)
        timeNow.innerText = fommatTime(audioMain.currentTime)
        progBar.style.width = (audioMain.currentTime / audioMain.duration) * 100 + "%"
        if (cooldownAutoNext == false) {
            if (audioMain.currentTime >= audioMain.duration && roleAd) {
                setTimeout(async() => {
                    await controlBtn[3].onclick()
                }, 500)
                cooldownAutoNext = true
                setTimeout(() => {
                    cooldownAutoNext = false
                }, 3000)
            }

        }

    }, 500)
}

function playAudioMain() {
    itemPlayList[nSong].classList.add("playnow")
    statusPlay = 'play'
    audioMain.play()
    controlBtn[2].innerHTML = DOMStatusControl[1]
    audioMain.volume = volMusic
}

function pauseAudioMain() {
    itemPlayList[nSong].classList.remove("playnow")
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
        }, 1000)
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
    await updatePl()

}

async function updatePl() {
    playListBox.innerHTML = ""
    for (let i = 0; i < jsonAlbum.length; i++) {
        playListBox.innerHTML += `
        <div class="itemsongPl">
            <div class="avtSongPlbox">
                <img class="avtSongPl" src="${jsonAlbum[i]["img"]}" alt="">
            </div>
            <div class="infoSongPl">
                <p>${jsonAlbum[i]["name"]}</p>
                <p>${jsonAlbum[i]["singer"]}</p>
            </div>
        </div>`
    }
    itemPlayList = document.getElementsByClassName("itemsongPl")
    if (roleAd) {
        for (let i = 0; i < jsonAlbum.length; i++) {
            itemPlayList[i].onclick = async(e) => {
                if (cooldown == false) {
                    pauseAudioMain()
                    await APIMusic(1)
                    nSong = i;
                    audioMain = new Audio(jsonAlbum[nSong]["link"])
                    updateInfoMusic()
                    playAudioMain()
                }
                checkCooldown()
            }
        }
    }

}