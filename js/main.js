window.onload = ()=>{
    try{
        CNData.test = true;
        CNTrack.setup("promo:aj_2020")
    } catch(err){
        console.log(err);
    }
    validatePortrait();
}
window.onresize = ()=>{
    validatePortrait();
}
function validatePortrait()
{
    if (window.innerWidth > window.innerHeight && DATA.isMobile)  // if portrait
    {
        divgirar.style.display = 'inline-block';
        if (document.getElementsByTagName("canvas")[0] && document.getElementsByTagName("canvas")[0].classList)
        {
            document.getElementsByTagName("canvas")[0].classList.add('canvashide'); // hide canvas
        }
    } 
    else // if landscape
    {
        divgirar.style.display = 'none';
        if (document.getElementsByTagName("canvas")[0] && document.getElementsByTagName("canvas")[0].classList)
        {
            document.getElementsByTagName("canvas")[0].classList.remove('canvashide'); // show canvas
        }
    }
}

// --------------------- GAME CONFIG --------------------- 
var gWidth = 873
var gHeight = 1624
var gGravity = 2
var gDV

let gameConfig = {
    type: Phaser.CANVAS,
    scale: {
        parent: 'first-div',
        /*mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.ENVELOP,//Phaser.Scale.CENTER_BOTH,*/
        mode: DATA.isMobile ? Phaser.Scale.ENVELOP : Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: gWidth,
        height: gHeight
    },
    autoStart: false,
    physics: {
        default: 'matter',
        matter: {
            debug: false
            ,
            gravity: {y: gGravity}
        }
    },
    render: {
        antialias: true
    }
}

// --------------------- SCENES --------------------- 
let game = new Phaser.Game(gameConfig)
game.scene.add("BootScene", BootScene)
game.scene.add("SplashScene", SplashScene)
game.scene.add("HelpScene", HelpScene)
game.scene.add("LevelSelectionScene", LevelSelectionScene)
game.scene.add("PrelevelScene", PrelevelScene)
game.scene.add("LevelEndScene", LevelEndScene)
game.scene.add("ArchievementsScene", ArchievementsScene)
game.scene.add("FrozenMinigameScene", FrozenMinigameScene)
game.scene.add("GameScene", GameScene)
game.scene.add("OptionsScene", OptionsScene)

let gs
let bt
//game.scene.start("SelectScene")
game.scene.start("BootScene")