var dataClient

async function startInteract() {
    if (idNow == localStorage.getItem("MyID")) {
        await hostInt()
    } else {
        await clientInt()
    }
}

function hostInt() {
    init()
    setInterval(async() => {
        await setDataRoomHost({
            "n": nSong,
            "time": audioMain.currentTime,
            "status": statusPlay,
        }, idJson)
        console.log("ok Host")
    }, 2000)
}

function clientInt() {
    controlBtn[2].innerHTML = DOMStatusControl[0]
    audioMain.volume = 0.1
    volumebar.value = 2
    setInterval(async() => {
        dataClient = await getDataRoomClient(idJson)
        if (nSong != dataClient["n"]) {
            nSong = dataClient["n"]
            pauseAudioMain()
            await APIMusic(1)
            audioMain = new Audio(jsonAlbum[nSong]["link"])
            updateInfoMusic()
        }
        if (dataClient["status"] == 'play') {
            playAudioMain()
        } else {
            pauseAudioMain()
        }
        if (Math.abs(dataClient["time"] - audioMain.currentTime) > 5) {
            audioMain.currentTime = dataClient["time"]
        }
        console.log("ok Client")
    }, 2000)
}

async function setDataRoomHost(y, id) {
    await fetch(`https://64425c0376540ce2258a2255.mockapi.io/v1/ResMusicClient/${id}`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(y)
    }).then(res => {
        if (res.ok) {
            return res.json();
        }
    }).then(data => jsonRoom = data).catch(error => { alert("Có lỗi. Vui lòng thử lại!") })
}
async function getDataRoomClient(id) {
    await fetch(`https://64425c0376540ce2258a2255.mockapi.io/v1/ResMusicClient/${id}`, {
        method: 'GET',
        headers: { 'content-type': 'application/json' },
    }).then(res => {
        if (res.ok) {
            return res.json();
        }
    }).then(data => jsonRoom = data).catch(error => { alert("Có lỗi. Vui lòng thử lại!") })
}