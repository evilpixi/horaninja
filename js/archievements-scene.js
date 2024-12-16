class ArchievementsScene extends Phaser.Scene {
    constructor() {
        super("ArchievementsScene")
        this.parentScene
    }

    init(data) {
        this.parentScene = data.parent
    }

    create() {
        this.scene.bringToTop()
        this.parentScene.scene.pause()

        this.add.rectangle(gWidth/2,gHeight/2,gWidth,gHeight, 0x000000, 0.8)

        this.add.image(gWidth/2, gHeight*0.515, "archievements-paper")
        this.add.image(gWidth/2, gHeight*0.095, "archievements-title")
        this.add.image(gWidth*0.265, gHeight*0.81, "archievements-prize")
        /*Utils.generateTitleText(this, gWidth/2 -5, gHeight*0.077, 
            DATA.text.ArchievementsScene.title, 70, "#fff")*/

        this.add.text(gWidth/2 -5+3, gHeight*0.077+3,
            DATA.text.ArchievementsScene.title,
            {
                fontFamily: "avenir-bold",
                align: "center",
                fontSize: 80,
                color: "#432918",
                stroke: "#432918",
                strokeThickness: 7
            }).setOrigin(0.5)
        this.add.text(gWidth/2 -5, gHeight*0.077,
            DATA.text.ArchievementsScene.title,
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
            x: gWidth*0.88,
            y: gHeight*0.17,
            image: "button-close",
            clickFunction: ()=>{
                this.scene.stop()
                this.parentScene.scene.resume()
            }
        })

        let textFormat = {
            fontFamily: "avenir-bold",
            fontSize: 41,
            color: "#fff",
            stroke: "#000",
            strokeThickness: 5
        }
        let countTextFormat = {
            fontFamily: "avenir-bold",
            fontSize: 32,
            color: "#fff",
            stroke: "#000",
            strokeThickness: 7
        }

        // stars
        this.add.text(gWidth*0.5, gHeight*0.22, 
            DATA.text.ArchievementsScene.stars, textFormat)
        .setOrigin(0.5)

        this.add.image(gWidth/2, gHeight*0.28, "brown-bar")
        .setScale(1.1, 1.4)

        this.add.image(gWidth/2, gHeight*0.28, "archievements-stars")
        .setScale(0.9)

        let starCount = 0
        for (let i = 1; i<=10; i++) {
            starCount += Number(STORE.load("level_" + i + "_stars"))
        }
        countTextFormat.fontSize = 45
        countTextFormat.strokeThickness = 10
        this.add.text(gWidth/2, gHeight*0.28 + 55, "x" + starCount, countTextFormat)
        .setOrigin(0, 0.5)
        countTextFormat.fontSize = 32
        countTextFormat.strokeThickness = 7



        let pos = {
            buttonConst: 115,
            titleConst: 95,
            count: {x:5, y: 30},
            s: {x: gWidth*(0.5 - 0.23), y: gHeight*0.43},
            f: {x: gWidth*(0.5 + 0.20), y: gHeight*0.43},
            c: {x: gWidth*(0.5 - 0.23), y: gHeight*0.67},
            a: {x: gWidth*(0.5 + 0.20), y: gHeight*0.67}
        }
        let cButtons = {}

        // ---------- stickers ---------- 
        this.add.text(pos.s.x, pos.s.y - pos.titleConst, 
            DATA.text.ArchievementsScene.stickers, textFormat)
        .setOrigin(0.5)

        this.add.image(pos.s.x, pos.s.y, "brown-bar")
        .setScale(0.3,0.8)
        
        let stickers = []
        DATA.stickerNames.forEach(s => {
            stickers.push([
                this.add.image(pos.s.x, pos.s.y, "ui-" + s).setScale(1.1),
                this.add.text(pos.s.x + pos.count.x, pos.s.y + pos.count.y,
                    "0/99", countTextFormat)
            ])
        })

        let stickerCarousel = new Carousel({elements: stickers})

        cButtons.sPrev = new ButtonImage({
            scene:this,
            x: pos.s.x - pos.buttonConst,
            y: pos.s.y,
            clickFunction: ()=>{ stickerCarousel.prev() },
            image: "archievements-carousel-button"
        }).setFlipX(true)
        cButtons.sNext = new ButtonImage({
            scene:this,
            x: pos.s.x + pos.buttonConst,
            y: pos.s.y,
            clickFunction: ()=> { stickerCarousel.next() },
            image: "archievements-carousel-button"
        })
        

        // ---------- filters ---------- 
        this.add.text(pos.f.x, pos.f.y - pos.titleConst, 
            DATA.text.ArchievementsScene.filters, textFormat)
        .setOrigin(0.5)

        this.add.image(pos.f.x, pos.f.y, "brown-bar")
        .setScale(0.3,0.8)

        let filters = []
        DATA.filterNames.forEach(f => {
            filters.push([
                this.add.image(pos.f.x, pos.f.y, "ui-" + f).setScale(1.1),
                this.add.text(pos.f.x + pos.count.x, pos.f.y + pos.count.y,
                    "0/99", countTextFormat)
            ])
        })

        /*let filterCarousel = new Carousel({elements: filters})

        cButtons.fPrev = new ButtonImage({
            scene:this,
            x: pos.f.x - pos.buttonConst,
            y: pos.f.y,
            clickFunction: ()=> { filterCarousel.prev },
            image: "archievements-carousel-button"
        }).setFlipX(true)
        cButtons.fNext = new ButtonImage({
            scene:this,
            x: pos.f.x + pos.buttonConst,
            y: pos.f.y,
            clickFunction: ()=> { filterCarousel.next },
            image: "archievements-carousel-button"
        })*/
            
        let blackTextFormat = {
            fontFamily: "avenir-bold",
            color: "#000",
            align: "center",
            fontSize: 30
        }

        // ---------- characters ---------- 
        this.add.text(pos.c.x, pos.c.y - pos.titleConst, 
            DATA.text.ArchievementsScene.characters, textFormat)
        .setOrigin(0.5)

        this.add.image(pos.c.x, pos.c.y, "brown-bar")
        .setScale(0.3,0.8)

        let characters = []
        DATA.characterNames.forEach(c => {
            characters.push([
                this.add.image(pos.c.x, pos.c.y, "ui-char-" + c).setScale(1.3),
                this.add.text(pos.c.x + pos.count.x, pos.c.y + pos.count.y,
                    "0/99", countTextFormat)
            ])
        })

        let characterCarousel = new Carousel({elements: characters})
        cButtons.cPrev = new ButtonImage({
            scene:this,
            x: pos.c.x - pos.buttonConst,
            y: pos.c.y,
            clickFunction: ()=> { characterCarousel.prev()},
            image: "archievements-carousel-button"
        }).setFlipX(true)
        cButtons.cNext = new ButtonImage({
            scene:this,
            x: pos.c.x + pos.buttonConst,
            y: pos.c.y,
            clickFunction: ()=> { characterCarousel.next()},
            image: "archievements-carousel-button"
        })
            


        // ---------- accesories ---------- 
        this.add.text(pos.a.x, pos.a.y - pos.titleConst, 
            DATA.text.ArchievementsScene.accesories, textFormat)
        .setOrigin(0.5)

        this.add.image(pos.a.x, pos.a.y, "brown-bar")
        .setScale(0.3,0.8)

        let accesories = []
        DATA.accesoryNames.forEach(a => {
            accesories.push([
                this.add.image(pos.a.x, pos.a.y, "ui-" + a).setScale(1.2),
                this.add.text(pos.a.x + pos.count.x, pos.a.y + pos.count.y,
                    "0/99", countTextFormat)
            ])
        })

        let accesoryCarousel = new Carousel({elements: accesories})

        cButtons.cPrev = new ButtonImage({
            scene:this,
            x: pos.a.x - pos.buttonConst,
            y: pos.a.y,
            clickFunction: ()=> {accesoryCarousel.prev()},
            image: "archievements-carousel-button"//,
            //clickFunction: a
        }).setFlipX(true)
        cButtons.cNext = new ButtonImage({
            scene:this,
            x: pos.a.x + pos.buttonConst,
            y: pos.a.y,
            clickFunction: ()=> {accesoryCarousel.next()},
            image: "archievements-carousel-button"
        })
            




        // album
        this.add.text(gWidth/2, gHeight*0.5, 
            DATA.text.ArchievementsScene.album, blackTextFormat)
        .setOrigin(0.5)
        
        new ButtonImage({
            scene: this,
            x: gWidth/2,
            y: gHeight*0.54,
            image: "button-social",
            text: DATA.text.ArchievementsScene.here,
            textConfig: textFormat,
            clickFunction: ()=>{}
        })

        // profile
        this.add.text(gWidth*0.7, gHeight*0.76, 
            DATA.text.ArchievementsScene.profile, blackTextFormat)
        .setOrigin(0.5)
        
        new ButtonImage({
            scene: this,
            x: gWidth*0.7,
            y: gHeight*0.8,
            image: "button-social",
            text: DATA.text.ArchievementsScene.here,
            textConfig: textFormat,
            clickFunction: ()=>{}
        })


        //Utils.drawDesignLines(this)
    }
}