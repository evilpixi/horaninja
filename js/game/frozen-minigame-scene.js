class FrozenMinigameScene extends Phaser.Scene {
    constructor() {
        super("FrozenMinigameScene")

        this.heat
        this.maxHeat
        this.heatPerClick
        this.timeToDefrost
        this.fruit

        this.sceneEnded = false

        this.minY = gHeight*0.605
        this.maxY = gHeight*0.42

        this.graphs = {}
    }
    init(data) {
        this.parentScene = data.parent
        this.fruit = data.fruit
    }
    reduceHeat() {
        if (!this.sceneEnded) {
            this.heat -= DATA.heatLostPerSecond/4
            if (this.heat < 0) this.heat = 0
            this.time.delayedCall(250, ()=>{
                this.reduceHeat()
            })
        }
        console.log(this.heat)
    }
    checkHeat() {
        if (this.heat >= this.maxHeat) {
            if (this.sceneEnded) return
            Object.values(this.graphs).forEach(gr => {
                gr.alpha = 0
            })
            this.graphs.play.alpha = 1
            this.graphs.play.active = 1

            let jakeWin = this.add.sprite(gWidth/2, gHeight/2, "frozen-minigame-jake")
            jakeWin.setScale(1.7)
            jakeWin.play("frozen-jake-escape")
            this.sceneEnded = true

            Utils.generateTitleText(this, gWidth*0.49, gHeight*0.27, 
                DATA.text.FrozenMinigameScene.youMadeIt,
                75, "#fcba03", "#000")
        }
    }

    create() {
        console.log("craete called")
        this.heat = 0
        this.maxHeat = DATA.maxHeat
        this.heatPerClick = DATA.heatPerClick
        this.timeToDefrost = DATA.timeToDefrost

        this.sceneEnded = false

        this.scene.bringToTop()
        this.parentScene.scene.pause()
        this.add.rectangle(gWidth/2,gHeight/2,gWidth,gHeight, 0x000000, 0.8).setOrigin(0.5)

        this.add.image(gWidth/2, gHeight*0.49, "ui-cloud-popup").setScale(1.1)
        
        this.graphs.jake = this.add.sprite(gWidth*0.35, gHeight*0.49, "frozen-minigame-jake")
        this.graphs.jake.setScale(1.8)
        this.graphs.title = this.add.image(gWidth/2, gHeight*0.28, "frozen-minigame-title")
        this.graphs.indicator = this.add.image(gWidth*0.73, gHeight*0.51, "frozen-minigame-indicator").setScale(0.95)
        this.graphs.pointer = this.add.image(gWidth*0.8, this.minY, "frozen-minigame-pointer")
        this.graphs.textDown = this.add.text(gWidth/2, gHeight*0.7, 
            DATA.text.FrozenMinigameScene.touch, {
                fontFamily: "avenir-bold",
                fontSize: 40,
                color: "#FFF803",
                stroke: "#000",
                strokeThickness: 5
            })
            .setOrigin(0.5)

        this.graphs.play = new ButtonImage({
            scene: this,
            x: gWidth*0.8,
            y: gHeight*0.75,
            scale: 1,
            image: "button-play",
            clickFunction: ()=> {
                this.scene.stop()
                this.parentScene.scene.resume()
            }
        })
        this.graphs.play.alpha = 0
        this.graphs.play.active = 0


        //Utils.drawDesignLines(this)

        this.input.on("pointerdown", ()=>{
            this.heat += DATA.heatPerClick
            this.checkHeat()
        })
        this.input.keyboard.on("keyup-SPACE", ()=>{
            this.heat += DATA.heatPerClick
            this.checkHeat()
        })
        this.time.delayedCall(DATA.timeToDefrost, ()=> {
            if (!this.sceneEnded) {
                this.scene.stop()
                this.parentScene.endByFrozen()
            }
        })

        this.reduceHeat()

        this.events.on('shutdown', ()=>{
            this.parentScene.frozen = false
            this.fruit.destroy()
            this.parentScene.matter.world.resume()
        }, this);
    }

    update() {
        this.graphs.pointer.y = this.minY + (this.maxY - this.minY)*(this.heat/this.maxHeat)

        if (this.heat == 0 ) {
            this.graphs.jake.play("frozen-jake-stand", 0)
        } 
        else if (this.heat < this.maxHeat*0.33) {
            this.graphs.jake.play("frozen-jake-a", 1)
        } 
        else if (this.heat < this.maxHeat*0.67) {
            this.graphs.jake.play("frozen-jake-b", 1)
        }
        else if (this.heat < this.maxHeat) {
            this.graphs.jake.play("frozen-jake-c", 1)
        }
    }
}