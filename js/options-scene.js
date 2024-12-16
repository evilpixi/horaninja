class OptionsScene extends Phaser.Scene {
    constructor() {
        super("OptionsScene", OptionsScene)

        this.parentScene
    }

    init(data) {
        this.parentScene = data.parent
    }

    create() {
        this.scene.bringToTop()
        this.parentScene.scene.pause()

        this.add.rectangle(gWidth/2,gHeight/2,gWidth,gHeight, 0x000000, 0.8)
        let bg = this.add.image(gWidth/2, gHeight/2, "ui-paper-pause")
        this.add.image(gWidth/2, gHeight*0.19, "ui-title")
        Utils.generateTitleText(this, 
            gWidth/2, 
            gHeight*0.175, 
            DATA.text.OptionsScene.title,
            60)

        let box = {
            pos: {
                centerX: gWidth/2,
                centerY: gHeight/2
            }
        }
        let n = 200
        let btn = {}
        this.add.image(box.pos.centerX, box.pos.centerY, "ui-paper-pause")

        btn.melody = new ButtonImage({
            scene: this,
            x: box.pos.centerX - n,
            y: box.pos.centerY - n/2,
            image: "button-opt-melody",
            scale: 1,
            clickFunction: ()=> {
                DATA.melodyActive = DATA.melodyActive ? 0 : 1
            }
        })
        btn.sfx = new ButtonImage({
            scene: this,
            x: box.pos.centerX,
            y: box.pos.centerY - n/2,
            image: "button-opt-sfx",
            scale: 1,
            clickFunction: ()=> { 
                DATA.sfxActive = DATA.sfxActive ? 0 : 1
            }
        })
        btn.help = new ButtonImage({
            scene: this,
            x: box.pos.centerX + n,
            y: box.pos.centerY - n/2,
            image: "button-opt-help",
            scale: 1,
            clickFunction: ()=> { 
                game.scene.start("HelpScene", {parentScene: this})
            }
        })
        btn.archievements = new ButtonImage({
            scene: this,
            x: box.pos.centerX - n,
            y: box.pos.centerY + n/2,
            image: "button-opt-archievements",
            scale: 1,
            clickFunction: ()=> {
                game.scene.start("ArchievementsScene", {parent: this})
            }
        })
        btn.levels = new ButtonImage({
            scene: this,
            x: box.pos.centerX,
            y: box.pos.centerY + n/2,
            image: "button-opt-levels",
            scale: 1,
            clickFunction: ()=> { 
                this.parentScene.scene.stop()
                this.scene.start("LevelSelectionScene")
                this.scene.stop()
            }
        })
        btn.restart = new ButtonImage({
            scene: this,
            x: box.pos.centerX + n,
            y: box.pos.centerY + n/2,
            image: "button-opt-restart",
            scale: 1,
            clickFunction: ()=> { 
                this.parentScene.scene.stop()
                this.scene.start("GameScene", {
                    level: this.parentScene.level,
                    restarted: true
                })
                this.scene.stop()
            }
        })
        btn.play = new ButtonImage({
            scene: this,
            x: box.pos.centerX + n,
            y: box.pos.centerY + n/2 + n +20,
            image: "button-opt-play",
            scale: 1,
            clickFunction: ()=> { 
                this.parentScene.scene.resume()
                this.parentScene.scene.bringToTop()
                this.scene.stop()
            }
        })
        Object.values(btn).forEach(b => {
            b.y -=25
        })

        Utils.drawDesignLines(this)
    }
}