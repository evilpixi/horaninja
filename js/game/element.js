class Element extends Phaser.Physics.Matter.Sprite {
    constructor(data) {
        //let frozText = data.frozen ? "-frozen" : ""
        //console.log(frozText)
        let behavior
        if (DATA.fruitNames.includes(data.type)) behavior = "fruit"
        if (DATA.characterNames.includes(data.type)) behavior = "char"
        if (DATA.stickerNames.includes(data.type) ||
            DATA.accesoryNames.includes(data.type) || 
            DATA.filterNames.includes(data.type)) behavior = "bonus"
        super(data.scene.matter.world, 
              data.x, 
              data.y, 
              "game-" +behavior + "-"+ data.type + (data.frozen ? "-frozen" : ""),//frozText, 
              data.frame)

        this.scene = data.scene        
        //this.world = data.scene.world

        //console.log("game-fruit-" + data.type + data.frozen ? "-frozen" : "")
        this.type = data.type
        this.behavior = behavior
        this.body.label = behavior + "-" + this.type
        this.frozen = data.frozen || false
        this.cutted = false
        this.setScale((data.scale || 1) * (this.frozen ? 0.6 : 1))
        this.rnd = Phaser.Math.Between

        /*this.body.label = "looz"
        
        this.body.isSensor = true
        this.setCollisionGroup(2)*/
        this.scene.add.existing(this)

        //console.log(this.setBody)
        this.setBody({type: "circle", radius: 40})
        if (this.frozen) this.play("game-fruit-"+this.type+"-frozen")
    }

    shoot(shoot) {
        let sign = this.x >= gWidth/2 ? -1 : 1
        let shootConfig = shoot || {x: null, y: null}
        this.setVelocityX(shootConfig.x * sign)
        this.setVelocityY(shootConfig.y || -10 - Phaser.Math.Between(0,15))
        this.setAngularVelocity(this.rnd(5,20)*0.001 * sign)
    }

    getCutted() {
        if (this.cutted) return
        if (this.frozen) {
            // do some shit
            //console.log("FROZEN!")
            //this.scene.scene.pause()
            this.scene.matter.world.pause()
            this.scene.add.sprite(this.x, this.y, "frozen-effect")
            .setScale(1.5)
            .play("frozen-effect")
            this.scene.frozen = true
            this.scene.time.delayedCall(1000, ()=> {
                game.scene.start("FrozenMinigameScene", {parent: this.scene, fruit: this})
            })
        }
        else {
            this.cutted = true
            if (this.behavior == "fruit") {
                this.scene.score += DATA.score.fruit
                this.scene.collected[this.type]++
                this.play("game-fruit-"+this.type+"-cut")
                this.once("animationcomplete", ()=> this.destroy(), this)
            }
            else if (this.behavior == "char") {
                this.scene.score += DATA.score.character
                this.scene.collected.character++
                this.scene.tweens.add({
                    targets: this,
                    scale: 4,
                    alpha: 0,
                    duration: 500,
                    onComplete: ()=>{
                        this.destroy()
                    }
                })
            }
            else if (this.behavior == "bonus") {
                this.scene.score += DATA.score.bonus
                this.scene.collected[this.type]++
                this.scene.tweens.add({
                    targets: this,
                    scale: 4,
                    alpha: 0,
                    duration: 500,
                    onComplete: ()=>{
                        this.destroy()
                    }
                })
            }
        }
    }
}