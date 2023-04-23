const idTextInput = document.getElementById("id-join")
const idInputBtn = document.getElementById("join")
const displayMyID = document.getElementById("myId")

const sence1 = document.getElementById("sence1")

var jsonRoom
var idNow
var idJson
initClient()



idInputBtn.onclick = async(e) => {
    idNow = idTextInput.value.trim()
    if (idNow != "") {
        await getDataRoom()
        console.log(jsonRoom)
        for (let i = 0; i < jsonRoom.length; i++) {
            if (jsonRoom[i]["idroom"] == idNow) {
                sence1.style.display = "none"
                idJson = jsonRoom[i]["id"]
                startInteract()
            }
        }
    }

}

function initIdRoom() {
    var idString = Math.floor(Math.random() * 999999).toString()
    while (idString.length < 6) {
        idString = '0' + idString
    }
    for (let i = 0; i < jsonRoom; i++) {
        if (idString == jsonRoom[i]["idroom"]) {
            return initIdRoom()
        }
    }
    return idString
}

async function initClient() {
    await getDataRoom()
    if (!localStorage.getItem("MyIDv2")) {
        var myidroom = initIdRoom()
        localStorage.setItem("MyIDv2", myidroom)
        await setDataRoom({
            "idroom": myidroom,
            "n": 0,
            "time": 0,
            "status": "pause"
        })
    }
    displayMyID.innerText = localStorage.getItem("MyIDv2")
}

async function getDataRoom() {
    await fetch("https://64425c0376540ce2258a2255.mockapi.io/v1/ResMusicClient").then(res => res.json()).then(data => jsonRoom = data).catch(error => { alert("Có lỗi. Vui lòng thử lại!") })
}
async function setDataRoom(y) {
    await fetch('https://64425c0376540ce2258a2255.mockapi.io/v1/ResMusicClient', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(y)
    }).then(res => {
        if (res.ok) {
            return res.json();
        }
    }).then(task => {}).catch(error => { alert("Có lỗi. Vui lòng thử lại!") })
}