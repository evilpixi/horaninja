class PrelevelScene extends Phaser.Scene
{
    constructor()
    {
        super("PrelevelScene")

        this.parentScene

    }
    init (data)
    {
        this.parentScene = data.parent
    }

    create ()
    {
        let lvl = this.parentScene.levelData
        this.scene.bringToTop()
        this.add.rectangle(gWidth / 2, gHeight / 2, gWidth, gHeight, 0x000000, 0.8).setOrigin(0.5)
        this.parentScene.scene.pause()

        this.add.image(gWidth / 2, gHeight * 0.15, "ui-title")
        /*Utils.generateTitleText(this, 
            gWidth/2, 
            gHeight*0.116, 
            DATA.text.PrelevelScene.title1,
            42)
        Utils.generateTitleText(this, 
            gWidth/2, 
            gHeight*0.147, 
            DATA.text.PrelevelScene.title2,
            42)*/

        this.add.text(gWidth / 2 + 3,
            gHeight * 0.116 + 3,
            DATA.text.PrelevelScene.title1,
            {
                fontFamily: "avenir-bold",
                align: "center",
                fontSize: 52,
                color: "#432918",
                stroke: "#432918",
                strokeThickness: 7
            }).setOrigin(0.5)
        this.add.text(gWidth / 2,
            gHeight * 0.117,
            DATA.text.PrelevelScene.title1,
            {
                fontFamily: "avenir-bold",
                align: "center",
                fontSize: 52,
                color: "#fff",
                stroke: "#432918",
                strokeThickness: 7
            }).setOrigin(0.5)

        this.add.text(gWidth / 2 + 3,
            gHeight * 0.147 + 3,
            DATA.text.PrelevelScene.title2,
            {
                fontFamily: "avenir-bold",
                align: "center",
                fontSize: 52,
                color: "#432918",
                stroke: "#432918",
                strokeThickness: 7
            }).setOrigin(0.5)
        this.add.text(gWidth / 2,
            gHeight * 0.147,
            DATA.text.PrelevelScene.title2,
            {
                fontFamily: "avenir-bold",
                align: "center",
                fontSize: 52,
                color: "#fff",
                stroke: "#432918",
                strokeThickness: 7
            }).setOrigin(0.5)


        this.add.image(gWidth / 2, gHeight / 2, "ui-cloud-popup")

        new ButtonImage({
            scene: this,
            x: gWidth * 0.8,
            y: gHeight * 0.75,
            image: "button-play",
            scale: 1,
            clickFunction: () =>
            {
                this.scene.stop()
                this.parentScene.scene.resume()
            }
        })

        this.add.image(gWidth * 0.26, gHeight * 0.82, "prelevel-ice-king")

        let fruitHeight = gHeight * 0.48
        let bonusHeight = gHeight * 0.58
        this.add.image(gWidth / 2, fruitHeight, "prelevel-bar").setScale(1.1, 1)
        this.add.image(gWidth / 2, bonusHeight, "prelevel-bar")


        // -------------  texts ---------------
        let titlesTextFormat = {
            fontFamily: "avenir-bold",
            fontSize: 70,
            align: "center",
            color: "#000",
            stroke: "#000",
            strokeThickness: 3
        }

        // level X
        this.add.text(gWidth / 2 + 2, gHeight * 0.285 + 2,
            DATA.text.PrelevelScene.level + this.parentScene.level, titlesTextFormat)
            .setOrigin(0.5)

        titlesTextFormat.color = "#FFCD00"
        this.add.text(gWidth / 2, gHeight * 0.285,
            DATA.text.PrelevelScene.level + this.parentScene.level, titlesTextFormat)
            .setOrigin(0.5)


        // level name
        titlesTextFormat.fontSize = 50

        titlesTextFormat.color = "#000"
        this.add.text(gWidth / 2 + 1, gHeight * 0.325 + 1,
            lvl.levelName, titlesTextFormat).setOrigin(0.5)

        titlesTextFormat.color = "#FFCD00"
        this.add.text(gWidth / 2, gHeight * 0.325,
            lvl.levelName, titlesTextFormat).setOrigin(0.5)


        // level objetive
        titlesTextFormat.color = "#000"
        this.add.text(gWidth / 2 + 1, gHeight * 0.39 + 1,
            DATA.text.PrelevelScene.objetive, titlesTextFormat).setOrigin(0.5)

        titlesTextFormat.color = "#FFF803"
        this.add.text(gWidth / 2, gHeight * 0.39,
            DATA.text.PrelevelScene.objetive, titlesTextFormat).setOrigin(0.5)


        // level remember
        titlesTextFormat.color = "#BEB0E1"
        titlesTextFormat.stroke = "#706B8E"
        titlesTextFormat.fontSize = 35
        this.add.text(gWidth / 2, gHeight * 0.65,
            DATA.text.PrelevelScene.remember, titlesTextFormat).setOrigin(0.5)


        // ---------------- Level Elements --------------------
        let atf = {
            fontFamily: "avenir-bold",
            fontSize: 36,
            color: "#fff",
            stroke: "#000",
            strokeThickness: 4
        }

        lvl.fruits.forEach((fr, i) =>
        {

            let fruitWidth = gWidth / 2 + (i - 1) * 185

            this.add.image(fruitWidth, fruitHeight, "ui-fruit-" + fr.type)

            this.add.text(fruitWidth, fruitHeight + 60, "x" + fr.need, atf).setOrigin(0.5)
        })


        this.add.image(gWidth / 2 - 162, bonusHeight, "ui-char-" + lvl.character.type)
        this.add.text(gWidth / 2 - 162, bonusHeight + 50, "x" + lvl.character.need, atf).setOrigin(0.5)


        lvl.bonuses.forEach((bs, i) =>
        {
            console.log(bs, i)
            let bonusWidth = gWidth / 2 + i * 162

            this.add.image(bonusWidth, bonusHeight, "ui-" + bs.type)

            this.add.text(bonusWidth, bonusHeight + 50, bs.amount + "/99", atf).setOrigin(0.5)
        })

        //keyboard
        this.input.keyboard.once("keydown-SPACE", () =>
        {
            this.scene.stop()
            this.parentScene.scene.resume()
        })
    }
}