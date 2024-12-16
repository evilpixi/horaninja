class LevelEndScene extends Phaser.Scene {
    constructor() {
        super("LevelEndScene")

        this.parentScene
        this.collected
        this.win
        this.levelData
        this.level
    }

    init(data) {
        this.parentScene = data.parent
        this.collected = this.parentScene.collected
        this.levelData = this.parentScene.levelData
        this.level = this.parentScene.level
    }

    create() {
        // for all
        this.scene.bringToTop()
        this.parentScene.scene.stop()
        let fruits = this.parentScene.fruitNames
        let bonus = this.parentScene.bonusNames

        // calculate if win
        let win = 
            //this.collected.character >= this.levelData.character.need &&
            this.collected[fruits[0]] >= this.levelData.fruits.find(f => f.type == fruits[0]).need &&
            this.collected[fruits[1]] >= this.levelData.fruits.find(f => f.type == fruits[1]).need &&
            this.collected[fruits[2]] >= this.levelData.fruits.find(f => f.type == fruits[1]).need
        let bonusCollected = 
            this.collected[bonus[0]] >= this.levelData.bonuses.find(b => b.type == bonus[0]).amount &&
            this.collected[bonus[1]] >= this.levelData.bonuses.find(b => b.type == bonus[1]).amount 
        console.log("win:",win, this.collected)
        let stars = 0
        if (win) {
            stars++
            if (this.collected.character >= this.levelData.character.need) {
                stars++
            }
            if (bonusCollected) {
                stars++
            }
        }
        // ----- DATA SAVING ----- //
        let lvl = this.level
        if (win) {
            STORE.loadGameProgress()
            if (lvl != 10) {
                STORE.save("level_" + (lvl+1) + "_available", 1)
            }

            if (DATA.progress["level-" + lvl].stars < stars ) {
                STORE.save("level_" + lvl + "_stars", stars)
            }
            if (DATA.progress["level-" + lvl].score < this.parentScene.score ) {
                STORE.save("level_" + lvl + "_score", this.parentScene.score)
            }
            //if (DATA.progress)

            
            // site
            let bonus1 = STORE.load("level_" + lvl + "_")
            if (DATA.siteProgress["level-" + lvl + "_" + DATA.levelData["level-" + lvl].bonuses[0].type]) {

            }
        }


        //if (this.)
        //this.add.rectangle(gWidth/2,gHeight/2,gWidth,gHeight, 0x000000, 0.8).setOrigin(0.5)
        

        let textFormat = {
            fontFamily: "avenir-bold",
            fontSize: 55,
            color: "#fff",
            stroke: "#000",
            strokeThickness: 8,
            align: "center"
        }
        
        this.add.image(gWidth/2, gHeight*0.56, "ui-paper-medium")
        this.add.image(gWidth/2, gHeight*0.15, "ui-title")
        
        this.add.text(gWidth/2+3, 
            gHeight*0.132+3,
            win ? DATA.text.LevelEndScene.titleWin : DATA.text.LevelEndScene.titleLost,
            {
                fontFamily: "avenir-bold",
                align: "center",
                fontSize: 70,
                color: "#432918",
                stroke: "#432918",
                strokeThickness: 7
            }).setOrigin(0.5)
        this.add.text(gWidth/2, 
            gHeight*0.132,
            win ? DATA.text.LevelEndScene.titleWin : DATA.text.LevelEndScene.titleLost,
            {
                fontFamily: "avenir-bold",
                align: "center",
                fontSize: 70,
                color: "#fff",
                stroke: "#432918",
                strokeThickness: 7
            }).setOrigin(0.5)
        /*Utils.generateTitleText(this, 
            gWidth/2, 
            gHeight*0.132, 
            win ? DATA.text.LevelEndScene.titleWin : DATA.text.LevelEndScene.titleLost,
            70)*/
        
        if (win) {
            this.add.image(gWidth*0.12, gHeight*0.85, "level-end-finn")
        }
        else {
            this.add.image(gWidth*0.205, gHeight*0.86, "level-end-ice-king")
        }



        if (!win && this.parentScene.frozenLost) {
            textFormat.color = "#FFF803"
            textFormat.fontSize = 50
            this.add.text(gWidth/2, gHeight*0.3, 
                DATA.text.LevelEndScene.jakeCantFree,
                textFormat)
                .setOrigin(0.5)

            this.add.image(gWidth/2, gHeight*0.515, "level-end-frozen-jake")

            textFormat.color = "#fff"
            textFormat.fontSize = 45
            this.add.text(gWidth/2, gHeight*0.75, 
                DATA.text.LevelEndScene.tryAgain,
                textFormat)
                .setOrigin(0.5)
        }
        else {
            this.add.image(gWidth*0.315, gHeight*0.32, 
                "star-" + (stars >= 1 ? "win" : "lost") + "-left")
            
            this.add.image(gWidth*0.5, gHeight*0.305, 
                "star-" + (stars >= 2 ? "win" : "lost") + "-center")
                .depth = 10
    
            this.add.image(gWidth*0.685, gHeight*0.32, 
                "star-" + (stars == 3 ? "win" : "lost") + "-right")

            
            // level
            this.add.text(gWidth*0.5, gHeight*(0.41), 
            DATA.text.LevelEndScene.level + this.parentScene.level,
            textFormat)
            .setOrigin(0.5)


            // accumulate
            this.add.image(gWidth/2, gHeight*0.755, "brown-bar")
            .setScale(0.6, 1.4)

            textFormat.fontSize = 39
            textFormat.color = "#FFF803"
            textFormat.stroke = "#000"
            this.add.text(gWidth/2, gHeight*(0.755 - 0.015), 
                DATA.text.LevelEndScene.accumulate,
                textFormat)
            .setOrigin(0.5)
            this.add.text(gWidth/2, gHeight*(0.755 + 0.015), 
                this.parentScene.score + DATA.text.LevelEndScene.pts,
                textFormat)
            .setOrigin(0.5)
            textFormat.color = "#fff"

            // ----------- objects ------------
            let fruitHeight = gHeight*0.465
            let bonusHeight = gHeight*0.535
            let lvl = this.parentScene.levelData
            let atf = {
                fontFamily: "avenir-bold",
                fontSize: 36,
                color: "#fff",
                stroke: "#000",
                strokeThickness: 4
            }

            // fruits
            this.add.image(gWidth/2, fruitHeight, "brown-bar")
            lvl.fruits.forEach((fr,i) => {

                let fruitWidth = gWidth/2 + (i-1)*181
    
                this.add.image(fruitWidth, fruitHeight, "ui-fruit-" + fr.type)
                .setScale(0.79)
    
                this.add.text(fruitWidth, fruitHeight + 35, 
                    this.collected[fr.type] + "/" + fr.need, 
                    atf).setOrigin(0.5)
            })


            this.add.image(gWidth/2, bonusHeight, "brown-bar").setScale(0.8, 1)

            // character
            this.add.image(gWidth/2 - 150, bonusHeight, "ui-char-" + lvl.character.type)
            .setScale(0.85)
            this.add.text(gWidth/2 - 150, bonusHeight + 35,
                    this.collected.character + "/" + lvl.character.need, 
                    atf).setOrigin(0.5)
    
            // bonus
            lvl.bonuses.forEach((bs,i) => {

                let bonusWidth = gWidth/2 + i*150
    
                this.add.image(bonusWidth, bonusHeight, "ui-" + bs.type)
                .setScale(0.85)
    
                this.add.text(bonusWidth, bonusHeight + 35, 
                    this.collected[bs.type] + "/" + bs.amount, 
                    atf).setOrigin(0.5)
            })

            if (win) {
                // ----------- texts ------------
                let lineConst = 0.027

                // bonus
                textFormat.fontSize = 34
                textFormat.strokeThickness = 5

                this.add.text(gWidth*0.18, gHeight*(0.69 - lineConst*4), 
                DATA.text.LevelEndScene.bonus,
                textFormat)
                .setOrigin(0, 0.5)
                this.add.text(gWidth*0.82, gHeight*(0.69 - lineConst*4), 
                    "0" + DATA.text.LevelEndScene.pts,
                    textFormat)
                .setOrigin(1, 0.5)

                // combo
                this.add.text(gWidth*0.18, gHeight*(0.69 - lineConst*3), 
                DATA.text.LevelEndScene.combo,
                textFormat)
                .setOrigin(0, 0.5)
                this.add.text(gWidth*0.82, gHeight*(0.69 - lineConst*3), 
                    "0" + DATA.text.LevelEndScene.pts,
                    textFormat)
                .setOrigin(1, 0.5)

                // time
                this.add.text(gWidth*0.18, gHeight*(0.69 - lineConst*2), 
                DATA.text.LevelEndScene.time,
                textFormat)
                .setOrigin(0, 0.5)
                this.add.text(gWidth*0.82, gHeight*(0.69 - lineConst*2), 
                    "00:00",
                    textFormat)
                .setOrigin(1, 0.5)

                // current score
                this.add.text(gWidth*0.18, gHeight*(0.69 - lineConst*1), 
                DATA.text.LevelEndScene.currentScore,
                textFormat)
                .setOrigin(0, 0.5)
                this.add.text(gWidth*0.82, gHeight*(0.69 - lineConst*1), 
                    this.parentScene.score + DATA.text.LevelEndScene.pts,
                    textFormat)
                .setOrigin(1, 0.5)

                // high score
                textFormat.color = "#D741A7"
                textFormat.stroke = "#96066D"
                this.add.text(gWidth*0.18, gHeight*(0.69), 
                    DATA.text.LevelEndScene.highScore,
                    textFormat)
                .setOrigin(0, 0.5)
                this.add.text(gWidth*0.82, gHeight*(0.69), 
                    0 + DATA.text.LevelEndScene.pts,
                    textFormat)
                .setOrigin(1, 0.5)
            }
            else {
                textFormat.color = "#fff"
                textFormat.stroke = "#000"
                textFormat.strokeThickness = 6
                textFormat.fontSize = 45
                this.add.text(gWidth/2, gHeight*0.63,
                    DATA.text.LevelEndScene.timeEnd,
                    textFormat).setOrigin(0.5)
            }
        }




        // ----------- buttons ------------
        if (win) {
            new ButtonImage({
                scene: this, 
                x: gWidth*0.836, 
                y: gHeight*0.876,
                scale: 1.12,
                image: "button-play",
                clickFunction: () => {
                    this.scene.stop()
                    let nextLevel = this.parentScene.level + 1
                    this.parentScene.scene.restart({level: nextLevel})
                }
            })
        } else {
            new ButtonImage({
                scene: this, 
                x: gWidth*0.836, 
                y: gHeight*0.876,
                scale: 1.12,
                image: "button-restart",
                clickFunction: () => {
                    this.scene.stop()
                    this.parentScene.scene.restart({level: this.level, restarted: true})
                }
            })
        }
        
        new ButtonImage({
            scene: this, 
            x: gWidth*0.9, 
            y: gHeight*0.05,
            scale: 1,
            image: "button-audio",
            clickFunction: () => {
                DATA.activateAudio(!DATA.isAudioActive())
            }
        })
        
        new ButtonImage({
            scene: this, 
            x: gWidth*0.768, 
            y: gHeight*0.78,
            scale: 1.05,
            image: "button-archievements",
            clickFunction: () => {
                game.scene.start("ArchievementsScene", {parent: this})
            }
        })
        new ButtonImage({
            scene: this, 
            x: gWidth*0.648, 
            y: gHeight*0.835,
            scale: 1.05,
            image: "button-levels",
            clickFunction: () => {
                this.scene.stop()
                game.scene.start("LevelSelectionScene")
            }
        })

        //keyboard
        this.input.keyboard.once("keydown-SPACE", ()=>{
            this.scene.stop()
            this.parentScene.scene.restart()
        })

        //Utils.drawDesignLines(this)
    }
}