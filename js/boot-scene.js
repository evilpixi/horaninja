class BootScene extends Phaser.Scene {
    constructor() {
        super({
            key:"BootScene",
            pack: {
                files: [
                    { type: "image", key: "boot-bg", url: "assets/images/boot-scene/boot-bg.png"},
                    { type: "image", key: "boot-bar", url: "assets/images/boot-scene/boot-bar.png"},
                    { type: "image", key: "boot-fill", url: "assets/images/boot-scene/boot-fill.png"}
                ]
            }
        })

        this.graphics = {}
    }

    init() {
        //game.scene.add("BootShowScene", BootShowScene)
        //game.scene.start("BootShowScene")
    }
    preload() {
        // graphics in the scene
        this.graphics.bg = this.add.image(gWidth/2, gHeight/2, "boot-bg")
        //this.graphics.bg.setScale(gWidth/this.graphics.bg.graphics)
        this.graphics.bg.setScale(Utils.getScaleFit(this.graphics.bg))
        this.graphics.bar = this.add.image(gWidth/2, gHeight*0.7, "boot-bar")
        this.graphics.fill = this.add.image(gWidth/2 -this.graphics.bar.width/2 + 17,
            gHeight*0.7-8, 
            "boot-fill").setOrigin(0, 0.5).setScale(0)

        this.load.on("progress", (value)=> {
            this.graphics.fill.setScale(value*0.9, 1)
        })
        // --- Hjson ---
        this.load.text("game-text", "js/game-text.hjson")
        this.load.text("level-data", "js/game/level-data.hjson")

        // jake images
        this.load.atlas("jake-stand", "assets/game/jake-stand.png", "assets/game/jake-stand.json")
        this.load.image("jake-head", "assets/game/jake-head.png")
        this.load.image("jake-stele", "assets/game/jake-stele.png")
        this.load.image("jake-stele-circ", "assets/game/jake-stele-circ.png")

        this.load.spritesheet("frozen-effect", "assets/game/frozen-effect.png", {frameWidth: 490, frameHeight: 445})

        // fruit
        for (var i=0; i<DATA.fruitNames.length; i++) {
            this.load.spritesheet('game-fruit-'+ DATA.fruitNames[i], "assets/game/fruit/game-fruit-"+DATA.fruitNames[i]+".png", {frameWidth: 417, frameHeight: 136})
            this.load.spritesheet('game-fruit-'+ DATA.fruitNames[i]+ "-frozen", "assets/game/fruit/game-fruit-"+DATA.fruitNames[i]+"-frozen.png", {frameWidth: 1280/5, frameHeight: 293})
        }

        // char
        for (var i=0; i<DATA.characterNames.length; i++) {
            //this.load.spritesheet('game-char-'+ DATA.characterNames[i], "assets/game/char/game-char-"+DATA.characterNames[i]+".png", {frameWidth: 129, frameHeight: 133})
            this.load.image('game-char-'+ DATA.characterNames[i], "assets/game/char/game-char-"+DATA.characterNames[i]+".png", {frameWidth: 129, frameHeight: 133})
        }

        // bonus
        for (var i=0; i<DATA.stickerNames.length; i++) {
            //this.load.spritesheet('game-bonus-'+ DATA.stickerNames[i], "assets/game/bonus/game-bonus-"+DATA.stickerNames[i]+".png", {frameWidth: 128, frameHeight: 130})
            this.load.image('game-bonus-'+ DATA.stickerNames[i], "assets/game/bonus/game-bonus-"+DATA.stickerNames[i]+".png")//, {frameWidth: 128, frameHeight: 130})
        }
        for (var i=0; i<DATA.filterNames.length; i++) {
            //this.load.spritesheet('game-bonus-'+ DATA.stickerNames[i], "assets/game/bonus/game-bonus-"+DATA.stickerNames[i]+".png", {frameWidth: 128, frameHeight: 130})
            this.load.image('game-bonus-'+ DATA.filterNames[i], "assets/game/bonus/game-bonus-"+DATA.filterNames[i]+".png")//, {frameWidth: 128, frameHeight: 130})
        }
        for (var i=0; i<DATA.accesoryNames.length; i++) {
            //this.load.spritesheet('game-bonus-'+ DATA.stickerNames[i], "assets/game/bonus/game-bonus-"+DATA.stickerNames[i]+".png", {frameWidth: 128, frameHeight: 130})
            this.load.image('game-bonus-'+ DATA.accesoryNames[i], "assets/game/bonus/game-bonus-"+DATA.accesoryNames[i]+".png")//, {frameWidth: 128, frameHeight: 130})
        }

        for (let i=1; i<=10; i++) {
            this.load.image("bg-level-" + i, "assets/backgrounds/bg-level-" + i + ".jpg")
        }

        for (let i=3; i>0; i--) {
            this.load.image("game-countdown-"+i, "assets/game/game-countdown-" + i + ".png")
        }

        //------------------------------------------------------------------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------------------------------------------------------------------

        // ---------------------------- UI ----------------------------
        //this.load.atlas("box", "assets/images/common-ui/ui-box.png", "assets/images/common-ui/ui-box.json")
        this.loadResources("assets/images/ui/", [            
            "button-back", 
            "button-audio", 
            "button-pause",
            "button-close",
            "button-play",
            "button-carousel",
            "pointer-carousel",
            "ui-bg", "ui-cloud",
            "ui-paper-small",
            "ui-paper-medium",
            "ui-paper-pause",
            "ui-cloud-popup",
            "ui-title",
            "button-restart",
            "button-levels",
            "button-archievements",
            "brown-bar"
        ])

        // ---------------------------- splash scene ----------------------------
        this.loadResources("assets/images/splash-scene/", [
            "splash-bg", 
            "splash-button-play", 
            "splash-button-how-to-play"
        ])

        // ---------------------------- help scene ----------------------------
        this.loadResources("assets/images/help-scene/", [
            "help-1", "help-2", "help-3", "help-4"
        ])

        // ---------------------------- level selection scene ----------------------------
        this.loadResources("assets/images/level-selection-scene/", [
            "level-selection-lumpy-space-princess",
            "level-button",
            "level-button-locked",
            "level-locked",
            "level-star-off",
            "level-star-on"
        ])


        let elementsList = []
        // ---------------------------- pre level scene ----------------------------
        DATA.fruitNames.forEach(fr => elementsList.push("ui-fruit-" + fr))
        DATA.characterNames.forEach(ch => elementsList.push("ui-char-" + ch))
        DATA.accesoryNames.forEach(ac => elementsList.push("ui-" + ac))
        DATA.filterNames.forEach(fi => elementsList.push("ui-" + fi))
        DATA.stickerNames.forEach(st => elementsList.push("ui-" + st))
        this.loadResources("assets/images/ui-elements/", elementsList)


        // ---------------------------- pre level scene ----------------------------
        this.loadResources("assets/images/prelevel-scene/", [
            "prelevel-ice-king",
            "prelevel-bar"
        ])


        // ---------------------------- options scene ----------------------------
        this.loadResources("assets/images/options-scene/", [
            "button-opt-archievements",
            "button-opt-restart",
            "button-opt-melody",
            "button-opt-sfx",
            "button-opt-play",
            "button-opt-help",
            "button-opt-levels"
        ])


        // ---------------------------- level end scene ----------------------------
        this.loadResources("assets/images/level-end-scene/", [
            "star-win-left",
            "star-win-center",
            "star-win-right",
            "star-lost-left",
            "star-lost-center",
            "star-lost-right",
            "level-end-ice-king",
            "level-end-finn",
            "level-end-frozen-jake"
        ])

        // ---------------------------- frozen minigame scene ----------------------------
        this.loadResources("assets/images/frozen-minigame-scene/", [
            "frozen-minigame-indicator",
            "frozen-minigame-pointer",
            "frozen-minigame-title"
        ])
        this.load.atlas("frozen-minigame-jake", 
            "assets/images/frozen-minigame-scene/frozen-minigame-jake.png", 
            "assets/images/frozen-minigame-scene/frozen-minigame-jake.json")
        
        // ---------------------------- archievements scene ----------------------------
        this.loadResources("assets/images/archievements-scene/", [
            "archievements-paper",
            "archievements-carousel-button",
            "archievements-title",
            "archievements-prize",
            "archievements-stars",
            "button-social"
        ])

    }

    create() {

        DATA.levelData = Hjson.parse(this.cache.text.get("level-data"))
        DATA.text = Hjson.parse(this.cache.text.get("game-text"))

        STORE.loadGameProgress()

        this.anims.create({
            key: "jake-stand",
            frames: this.anims.generateFrameNames("jake-stand", {
                prefix: "jake-stand",
                end: 3
            }),
            yoyo: true,
            frameRate: 9,
            repeat: -1
        })

        DATA.fruitNames.forEach(fr => {
            this.anims.create({
                key: "game-fruit-" + fr + "-cut",
                frames: this.anims.generateFrameNumbers("game-fruit-"+ fr, {start: 1, end: 5}),
                frameRate: 17,
                repeat: 0
            })
            this.anims.create({
                key: "game-fruit-" + fr + "-frozen",
                frames: this.anims.generateFrameNumbers("game-fruit-"+ fr + "-frozen", {start: 0, end: 4}),
                frameRate: 5,
                repeatDelay: 300,
                repeat: -1
            })
        })

        this.anims.create({
            key: "frozen-jake-stand",
            frames: this.anims.generateFrameNames("frozen-minigame-jake", {
                prefix: "frozen-jake-stand",
                end: 1
            }),
            frameRate: 9,
            repeat: 0
        })
        this.anims.create({
            key: "frozen-jake-a",
            frames: this.anims.generateFrameNames("frozen-minigame-jake", {
                prefix: "frozen-jake-a",
                end: 2
            }),
            frameRate: 20,
            repeat: -1
        })
        this.anims.create({
            key: "frozen-jake-b",
            frames: this.anims.generateFrameNames("frozen-minigame-jake", {
                prefix: "frozen-jake-b",
                end: 2
            }),
            frameRate: 20,
            repeat: -1
        })
        this.anims.create({
            key: "frozen-jake-c",
            frames: this.anims.generateFrameNames("frozen-minigame-jake", {
                prefix: "frozen-jake-c",
                end: 2
            }),
            frameRate: 20,
            repeat: -1
        })
        this.anims.create({
            key: "frozen-jake-escape",
            frames: this.anims.generateFrameNames("frozen-minigame-jake", {
                prefix: "frozen-jake-escape",
                end: 2
            }),
            frameRate: 15,
            repeat: 0
        })

        this.anims.create({
            key: "frozen-effect",
            frames: this.anims.generateFrameNumbers("frozen-effect", {
                start: 0,
                end: 5
            }),
            frameRate: 16,
            repeat: 0
        })

        // --- fonts ---
        this.load.script('webfont', 'lib/webfont.js')
        let element = document.createElement('style')
        document.head.appendChild(element)
        let sheet = element.sheet
        let styles
        styles = '@font-face { font-family: "nunito"; src: url("assets/fonts/nunito-regular.ttf") format("opentype"); }\n'
        sheet.insertRule(styles, 0)
        styles = '@font-face { font-family: "trash-hand"; src: url("assets/fonts/trash-hand.ttf") format("opentype"); }\n'
        sheet.insertRule(styles, 0)
        styles = '@font-face { font-family: "a-hint-of-sass"; src: url("assets/fonts/a-hint-of-sass.ttf") format("opentype"); }\n'
        sheet.insertRule(styles, 0)
        styles = '@font-face { font-family: "sunnxooo"; src: url("assets/fonts/sunnxooo.otf") format("opentype"); }\n';
        sheet.insertRule(styles, 0)
        styles = '@font-face { font-family: "lubalin-graph"; src: url("assets/fonts/lubalin-graph-bold-bt.ttf") format("opentype"); }\n';
        sheet.insertRule(styles, 0)
        styles = '@font-face { font-family: "avenir-reg"; src: url("assets/fonts/avenir-next-rounded-std-reg.otf") format("opentype"); }\n';
        sheet.insertRule(styles, 0)
        styles = '@font-face { font-family: "avenir-bold"; src: url("assets/fonts/avenir-next-rounded-std-bold.otf") format("opentype"); }\n';
        sheet.insertRule(styles, 0)

        WebFont.load({
            custom: {
                families: [ 
                    'nunito', 
                    'trash-hand', 
                    'sunnxooo', 
                    "avenir-bold",
                    "avenir-reg",
                    'a-hint-of-sass', 
                    'lubalin-graph' ]
            }, 
            active: ()=> {
                this.tweens.add({
                    targets: [this.graphics.fill],
                    duration: 300,
                    scale: 1,
                    onComplete: ()=> {
                        this.scene.sendToBack()
                        this.graphics.bg2 = this.add.image(gWidth/2, gHeight/2, "ui-bg")

                        this.graphics.cloud1 = this.add.image(
                            Phaser.Math.Between(-100,0),
                            gHeight/2 + Phaser.Math.Between(-300,300),
                            "ui-cloud"
                        )
                        this.graphics.cloud2 = this.add.image(
                            Phaser.Math.Between(-100,0),
                            gHeight/2 + Phaser.Math.Between(-500,100),
                            "ui-cloud"
                        )
                        this.graphics.bg2.setScale(Utils.getScaleFit(this.graphics.bg2))
                        this.graphics.cloud1.setScale(Phaser.Math.Between(4,7)/10)
                        this.graphics.cloud2.setScale(Phaser.Math.Between(1,3)/10)
                        this.graphics.activateBackground = true

                        
                        game.scene.start("SplashScene")
                    }
                })
            }
        })
    }

    update() {
        if (!this.graphics.activateBackground) return
        this.graphics.cloud1.x += 0.2
        this.graphics.cloud2.x += 0.12
        if (this.graphics.cloud1.x > gWidth+300) {
            this.graphics.cloud1.x = -200
            this.graphics.cloud1.y = gHeight/2 + Phaser.Math.Between(-300,300)
            this.graphics.cloud1.setScale(Phaser.Math.Between(4,7)/10)
        }
        if (this.graphics.cloud2.x > gWidth+300) {
            this.graphics.cloud2.x = -200
            this.graphics.cloud2.y = gHeight/2 + Phaser.Math.Between(-500,100)
            this.graphics.cloud2.setScale(Phaser.Math.Between(1,3)/10)
        }
    }

    loadResources(folder, resourceArray, extension=".png") {
        resourceArray.forEach(r => {
            this.load.image(r, folder + r.toLowerCase() + extension)
        })
    }
}