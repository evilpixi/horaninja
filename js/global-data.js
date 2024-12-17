class DATA { }
DATA.isMobile = /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent);
DATA.animationTime = 200
DATA.debug = false

// audio
DATA.sfxActive = true
DATA.melodyActive = true
DATA.isAudioActive = () => { return DATA.sfxActive || DATA.melodyActive }
DATA.activateAudio = (value) => { [DATA.sfxActive, DATA.melodyActive] = [value, value] }



// --------------- DATA STRUCTURES ---------------
DATA.text = {}
DATA.levelData = {}
DATA.progress = {}
DATA.siteProgress = {}




// --------------------------------------------
// --------------- GAME CONFIG ----------------
// --------------------------------------------
DATA.fruitNames = [
    "guava",
    "grape",
    "orange",
    "peach",
    "redapple",
    "greenapple",
    "mango"
]

DATA.characterNames = [
    "gunter",
    "marceline",
    "bubblegum",
    "lumpy",
    "flame"
]

DATA.stickerNames = [
    "sticker-1",
    "sticker-2",
    "sticker-3",
    "sticker-4"
]
DATA.accesoryNames = [
    "accesory-1",
    "accesory-2",
    "accesory-3"
]
DATA.filterNames = [
    "filter-1"
]

DATA.score = {
    fruit: 10,
    character: 10,
    bonus: 10,
    combo3: 50,
    combo4: 100,
    comboMore: 200
}

// shoot config
DATA.shootConfig = {
    velocityX: 2,
    velocityY: 30
}

// frozen minigame controls
DATA.maxHeat = 100
DATA.heatPerClick = 8
DATA.heatLostPerSecond = 30
DATA.timeToDefrost = 5000