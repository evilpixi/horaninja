class SplashScene extends Phaser.Scene {
    constructor() {
        super("SplashScene")
    }

    create() {
        let bg = this.add.image(gWidth/2, gHeight/2, "splash-bg")
        bg.setScale(Utils.getScaleFit(bg))
        
        // --- buttons ---
        let buttonTextConfig = {
            fontFamily: "avenir-bold",
            align: "center",
            fontSize: 70,
            color: "#fff",
            stroke: "#fff",
            strokeThickness: 0
        }

        let playButton = new ButtonImage({
            scene: this,
            x:gWidth*(0.5),
            y:gHeight*(0.8 - 0.05),
            scale: 1,
            image: "splash-button-play",
            text: DATA.text.SplashScene.buttonPlay,
            textConfig: buttonTextConfig,
            clickFunction: ()=> { 
                this.scene.start("LevelSelectionScene")
                this.scene.stop()
            }
        })
        buttonTextConfig.fontSize = 32

        let howToPlayButton = new ButtonImage({
            scene: this,
            x:gWidth*(0.5),
            y:gHeight*(0.8 + 0.05),
            scale: 1,
            image: "splash-button-how-to-play",
            text: DATA.text.SplashScene.buttonHowToPlay,
            textConfig: buttonTextConfig,
            clickFunction: ()=> { 
                game.scene.start("HelpScene", { parentScene: this})
            }
        })

        //keyboard
        this.input.keyboard.once("keydown-SPACE", ()=>{
            this.scene.start("LevelSelectionScene")
            this.scene.stop()
        })
    }
}