class HelpScene extends Phaser.Scene {
    constructor() {
        super("HelpScene")

        this.parentScene
        this.graphics = {}
        this.carousel //= new Carousel([])
    }

    init(data) {
        this.parentScene = data.parentScene
    }

    create() {
        // for all
        this.scene.bringToTop()
        this.parentScene.scene.pause()
        this.add.rectangle(gWidth/2,gHeight/2,gWidth,gHeight, 0x000000, 0.8).setOrigin(0.5)
        
        this.graphics.back = this.add.image(gWidth/2, gHeight/2, "ui-paper-small")
        this.graphics.title = this.add.image(gWidth/2, gHeight*0.13, "ui-title")
        /*this.graphics.titleText = Utils.generateTitleText(this, 
            gWidth/2, 
            gHeight*0.115, 
            DATA.text.HelpScene.title, 50)*/


        this.add.text(gWidth/2+3, 
            gHeight*0.113+3,
            DATA.text.HelpScene.title,
            {
                fontFamily: "avenir-bold",
                align: "center",
                fontSize: 60,
                color: "#432918",
                stroke: "#432918",
                strokeThickness: 7
            }).setOrigin(0.5)
        this.add.text(gWidth/2, 
            gHeight*0.113,
            DATA.text.HelpScene.title,
            {
                fontFamily: "avenir-bold",
                align: "center",
                fontSize: 60,
                color: "#fff",
                stroke: "#432918",
                strokeThickness: 7
            }).setOrigin(0.5)

        this.graphics.close = new ButtonImage({
            scene: this, 
            x: gWidth*0.87, 
            y: gHeight*0.18,
            image: "button-close",
            clickFunction: () => {
                this.scene.stop()
                this.parentScene.scene.resume()
            }
        })
        this.graphics.audio = new ButtonImage({
            scene: this, 
            x: gWidth*0.87, 
            y: gHeight*0.05,
            image: "button-audio",
            clickFunction: () => {
                DATA.activateAudio(!DATA.isAudioActive())
            }
        })
        
        // for each page
        let pages = []
        let pageIndicators = []

        let helpTextFormat = {
            fontFamily: "nunito",
            fontStyle: "bold",
            align: "center",
            fontSize: 32,
            color: "#fff",
            stroke: "#432918",
            strokeThickness: 5
        }
        for (var i = 1; i<=4; i++) {
            let page = []

            page.push(this.add.image(gWidth/2, gHeight/2 -20, "help-"+i))

            let texts = this.add.text(gWidth/2, 
                gHeight*0.67, 
                DATA.text.HelpScene["help"+i], 
                helpTextFormat)
            
            page.push(texts.setOrigin(0.5))
            pages.push(page)

            // indicators
            pageIndicators.push(this.add.image(gWidth/2 + (i-3)*70 + 70/2,
                gHeight*0.85,
                "pointer-carousel").setScale(0.8))
        }

        // carousel
        this.carousel = new Carousel({
            elements: pages,
            autoInitialize: false
        })

        this.carousel.updateFunction = ()=>{
            if (this.carousel.before != this.carousel.active) {
                this.tweens.add({
                    targets: pageIndicators[this.carousel.before],
                    duration: 150,
                    scale: 0.8
                })
            }
            this.tweens.add({
                targets: pageIndicators[this.carousel.active],
                duration: 200,
                scale: 1.7
            })
        }

        this.carousel.initialize()

        let prevButton = new ButtonImage({
            scene: this,
            x: gWidth*0.25,
            y: gHeight*0.86,
            image: "button-carousel",
            scale: 1.1,
            clickFunction: ()=> { this.carousel.prev()}
        })
        let nextButton = new ButtonImage({
            scene: this,
            x: gWidth*0.75,
            y: gHeight*0.86,
            image: "button-carousel",
            scale: 1.1,
            clickFunction: ()=> { this.carousel.next()}
        })
        prevButton.setFlipX(true)
    }
}