var dataClient
const idRoomNow = document.getElementById("idRoomNow")
const roleRoomNow = document.getElementById("role")
const checkAdFree = document.getElementById("checkAdFree")
    // const mainboxitem = document.getElementsByClassName("mainboxitem")
var roleAd = false
var permisAD = false

async function startInteract() {

    idRoomNow.innerText = idNow
    if (idNow == localStorage.getItem("MyIDv2")) {
        await hostInt()
        roleRoomNow.innerText = "Chủ phòng"
        roleAd = true
    } else {
        await clientInt()
        roleRoomNow.innerText = "Khách"
            // mainboxitem[1].style.display = "none"
        document.documentElement.style.setProperty("--cur", "no-drop")
    }
    init()

}

checkAdFree.oninput = () => {
    if (checkAdFree.checked) {
        permisAD = true
    } else {
        permisAD = false
    }
}

function hostInt() {

    setInterval(async() => {
        await setDataRoomHost({
            "n": nSong,
            "time": audioMain.currentTime,
            "status": statusPlay,
            "nowTime": Date.now() / 1000,
            "more": [loop, shuffle],
            // "freehost": permisAD,
        }, idJson)
        console.log("ok Host")
    }, 3000)
    activeBtn()
}

function clientInt() {

    setInterval(async() => {

        await getDataRoomClient(idJson)
            // if (dataClient["freehost"]) {
            //     roleAd = true
            // } else {
            //     roleAd = false
            // }
        if (dataClient.more[0]) {
            controlBtn[0].classList.add("ctrlBtnAtv")
        } else {
            controlBtn[0].classList.remove("ctrlBtnAtv")
        }
        if (dataClient.more[1]) {
            controlBtn[4].classList.add("ctrlBtnAtv")
        } else {
            controlBtn[4].classList.remove("ctrlBtnAtv")
        }
        if ((Date.now() / 1000) - dataClient["nowTime"] > 5) {
            idRoomNow.innerText = "Đã kết thúc!"
        } else {
            idRoomNow.innerText = idNow
        }
        if (nSong != dataClient["n"]) {
            nSong = dataClient["n"]
            pauseAudioMain()
            await APIMusic(1)
            audioMain = new Audio(jsonAlbum[nSong]["link"])
            updateInfoMusic()
            playAudioMain()

        }
        if (dataClient["status"] == 'play') {

            playAudioMain()

            var timeTemp = dataClient["time"] + ((Date.now() / 1000) - dataClient["nowTime"])
            if (Math.abs(timeTemp - audioMain.currentTime) > 0.08) {
                audioMain.currentTime = timeTemp
            }

        } else {
            pauseAudioMain()
        }

        console.log("ok Client")
    }, 3000)
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
    }).then(data => dataClient = data).catch(error => { alert("Có lỗi. Vui lòng thử lại!") })
}