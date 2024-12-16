class LevelSelectionScene extends Phaser.Scene {
    constructor() {
        super("LevelSelectionScene")
        this.graphics = {}
    }

    create() {
        STORE.loadGameProgress()
        this.graphics.back = this.add.image(gWidth/2, gHeight*0.54, "ui-paper-small")
        this.graphics.title = this.add.image(gWidth/2, gHeight*0.167, "ui-title")
        /*this.graphics.titleText = Utils.generateTitleText(this, 
            gWidth/2, 
            gHeight*0.15, 
            DATA.text.LevelSelectionScene.title,
            60)*/

        this.add.text(gWidth/2+3, 
            gHeight*0.15+3,
            DATA.text.LevelSelectionScene.title,
            {
                fontFamily: "avenir-bold",
                align: "center",
                fontSize: 80,
                color: "#432918",
                stroke: "#432918",
                strokeThickness: 7
            }).setOrigin(0.5)
        this.add.text(gWidth/2, 
            gHeight*0.15,
            DATA.text.LevelSelectionScene.title,
            {
                fontFamily: "avenir-bold",
                align: "center",
                fontSize: 80,
                color: "#fff",
                stroke: "#432918",
                strokeThickness: 7
            }).setOrigin(0.5)
        
        new ButtonImage({
            scene: this, 
            x: gWidth*0.9, 
            y: gHeight*0.05,
            image: "button-audio",
            clickFunction: () => {
                DATA.activateAudio(!DATA.isAudioActive())
            }
        })
        new ButtonImage({
            scene: this, 
            x: gWidth*0.1, 
            y: gHeight*0.05,
            image: "button-back",
            clickFunction: () => {
                this.scene.stop()
                this.scene.start("SplashScene")
            }
        })
        new ButtonImage({
            scene: this, 
            x: gWidth*0.72, 
            y: gHeight*0.05,
            image: "button-archievements",
            clickFunction: () => {
                game.scene.start("ArchievementsScene", {parent: this})
            }
        })

        let buttonTextConfig = {
            color: "#fff",
            fontFamily: "avenir-bold",
            fontSize: 82,
            fontStyle: "bold",
            stroke: "#432918",
            strokeThickness: 12
        }
        let grid =  {
            center: {x: gWidth/2, y:gHeight/2 +50},
            side: 200,
            short: 100,
            long: 100*3
        }
        let pos = [
            "placeholder",
            { x: grid.center.x - grid.side, y: grid.center.y - grid.long},
            { x: grid.center.x, y: grid.center.y - grid.long},
            { x: grid.center.x + grid.side, y: grid.center.y - grid.long},
            { x: grid.center.x - grid.side, y: grid.center.y - grid.short},
            { x: grid.center.x, y: grid.center.y - grid.short},
            { x: grid.center.x + grid.side, y: grid.center.y - grid.short},
            { x: grid.center.x - grid.side, y: grid.center.y + grid.short},
            { x: grid.center.x, y: grid.center.y + grid.short},
            { x: grid.center.x + grid.side, y: grid.center.y + grid.short},
            { x: grid.center.x, y: grid.center.y + grid.long},
        ]
        for (var i=1; i<=10; i++) {
            let lvl = i
            if (DATA.progress["level-"+i].available == "1") {
                new ButtonImage({
                    scene: this,
                    x: pos[i].x,
                    y: pos[i].y,
                    image: "level-button",
                    clickFunction: ()=>{
                        this.scene.stop()
                        this.scene.start("GameScene", {level: lvl})
                    },
                    text: lvl,
                    textConfig: buttonTextConfig,
                    scale: 1,
                    levelButtons: true
                })

                let stars = Number(DATA.progress["level-"+i].stars)
                for (let j=0; j<=2; j++) {
                    let s = this.add.image(pos[i].x + ((j-1)*40) + 10, 
                        pos[i].y + (j==1 ? 0 : 12) + 70,
                        "level-star-" + (j < stars ? "on":"off"))
                    .setScale(j==1 ? 1.3 : 1)
                    s.depth = j==1 ? 10 : 0
                }
            }
            else {
                this.add.image(pos[i].x, pos[i].y, "level-button-locked")
                this.add.text(pos[i].x + 5, pos[i].y + 5, lvl, buttonTextConfig).setOrigin(0.5)
                this.add.image(pos[i].x + 70, pos[i].y + 70, "level-locked")
            }
        }

        this.add.image(gWidth*0.17, gHeight*0.8, "level-selection-lumpy-space-princess")


        //keyboard
        this.input.keyboard.once("keydown-SPACE", ()=>{
            this.scene.stop()
            this.scene.start("GameScene", {level: 1})
        })
        let keys = ["ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE", "ZERO"]
        for (var ii=1; ii<=10; ii++) {
            let i = ii
            this.input.keyboard.once("keydown-" + keys[i-1], ()=>{
                this.scene.stop()
                this.scene.start("GameScene", {level: i})
            })
            this.input.keyboard.once("keydown-NUMPAD-" + keys[i-1], ()=>{
                this.scene.stop()
                this.scene.start("GameScene", {level: i})
            })
        }


    }
}