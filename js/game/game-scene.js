class GameScene extends Phaser.Scene
{
    constructor() 
    {
        super("GameScene")
        gs = this
        this.levelData
        this.level
        this.restarted
        this.elements
        this.waves
        this.remainingWaves
        this.remainingElements
        this.clicked = false
        this.cutLine = []
        this.pointerIsDown = false
        this.pointer
        this.debugText
        this.pool
        this.maxSize = 30
        this.maxDistance = 20
        this.beforeIndex = this.maxSize
        this.index = 0
        this.score = 0
        this.jake = {}
        this.collected = {
            character: 0
        }
        this.fruitNames
        this.bonusNames
        this.frozenLost = false
        this.frozen = false
    }
    endByFrozen ()
    {
        this.frozenLost = true
        this.scene.stop()
        game.scene.start("LevelEndScene", { parent: this })
    }

    init (data)
    {
        this.level = data.level
        this.levelData = DATA.levelData["level-" + data.level]
        this.restarted = data.restarted

        console.log(this.level, this.levelData, this.restarted)
        this.add.image(gWidth / 2, gHeight / 2, this.levelData.background)
    }

    generateElement (config) 
    {
        console.log("generating: ", config)
        let rnd = Phaser.Math.Between
        let fruit = new Element({
            scene: this,
            x: config.x || rnd(100, gWidth - 100),
            y: config.y || gHeight + 100,
            type: config.type || DATA.fruitNames[rnd(0, 6)],
            frozen: config.frozen || false,
            scale: config.scale || 1
        })
        return fruit
    }

    // #####################################################################################################
    // ############################################## CREATE ###############################################
    // #####################################################################################################
    create () 
    {
        // ------------------ world initialization ------------------

        let rnd = Phaser.Math.Between
        this.matter.set30Hz()

        if (!this.restarted) game.scene.start("PrelevelScene", { parent: this })


        let wavesCount = 0


        // generate elements
        this.frozenLost = false
        this.elements = []
        let fruitNames = []
        this.bonusNames = []
        this.levelData.fruits.forEach(fr =>
        {
            fruitNames.push(fr.type)
            for (var i = 1; i <= fr.need + fr.extra; i++) this.elements.push(fr.type)
            this.collected[fr.type] = 0
        })
        for (var i = 1; i <= (this.levelData.character.need + this.levelData.character.extra); i++)
        {
            this.elements.push(this.levelData.character.type)
        }
        this.fruitNames = fruitNames

        this.levelData.bonuses.forEach(b =>
        {
            this.bonusNames.push(b.type)
            for (var i = 1; i <= b.amount; i++) this.elements.push(b.type)
            this.collected[b.type] = 0
        })


        // generate waves
        this.waves = []
        let waveElementsCount = 0
        let wavesData = this.levelData.waves
        wavesData.forEach(w =>
        {
            wavesCount += w.amount
            waveElementsCount += (w.amount * w.pattern.reduce((a, b) => a + b))
        })

        if (this.levelData.autofill)
        {
            wavesData.push({ pattern: this.levelData.autofillWith, amount: 0, reason: "autofill" })
            while (this.elements.length > waveElementsCount)
            {
                wavesData[wavesData.length - 1].amount++
                waveElementsCount += this.levelData.autofillWith.reduce((a, b) => a + b)
            }
        }
        wavesData.forEach(wp =>
        {
            for (var i = 1; i <= wp.amount; i++)
            {
                this.waves.push(wp.pattern)
            }
        })

        // shuffle waves and elements
        function shuffleArray (array)
        {
            for (let i = array.length - 1; i > 0; i--)
            {
                let j = Math.floor(Math.random() * (i + 1))
                let aux = array[i]
                array[i] = array[j]
                array[j] = aux
            }
            return array
        }
        shuffleArray(this.waves)
        shuffleArray(this.elements)

        console.log(this.waves, this.elements)

        this.remainingWaves = this.waves.length
        this.remainingElements = this.elements.length
        this.waves.push("end")

        //this.add.rectangle(0, 0, gWidth, gHeight, 0x02D3FE).setOrigin(0)


        // ------------------ pool ------------------

        this.pool = this.add.group({
            defaultKey: 'jake-stele-circ',
            maxSize: this.maxSize
        })

        for (var i = 0; i < this.maxSize; i++)
        {
            this.pool.get(0, 0)
        }
        this.pool.children.iterate((kid, idx) =>
        {
            kid.objectIndex = idx
            kid.setScale(3)
            this.pool.killAndHide(kid)
        })


        // ------------------ jake ------------------

        this.jake.head = this.matter.add.sprite(0, 0, "jake-head")
        this.jake.head.setCircle(60)
        this.jake.head.scale = 1
        this.jake.head.body.isSensor = true
        this.jake.head.body.ignoreGravity = true
        this.jake.head.body.label = "cut"
        this.jake.head.depth = 25
        this.jake.head.alpha = 0

        this.jake.stand = this.add.sprite(gWidth / 2, gHeight / 2, "jake-stand").setScale(1)
        this.jake.stand.play("jake-stand")


        // ------------------ fruits ------------------

        let delay = this.levelData.timeBetweenWaves
        if (!delay) delay = 2000
        this.time.delayedCall(500, () =>
        {
            console.log("CALLING!")
            for (var ii = 0; ii < this.waves.length; ii++) 
            {
                // each wave
                let i = ii
                console.log("WAVE: ", i, delay, this.waves[i], this.waves[i].length)
                this.time.delayedCall(delay * (i), () =>
                {
                    console.log(this.waves[i])
                    if (this.waves[i] == "end")
                    {
                        this.time.delayedCall(1200, () =>
                        {
                            let end = game.scene.start("LevelEndScene", { parent: this })
                        }, this)
                    }
                    else 
                    {
                        for (var jj = 0; jj < this.waves[i].length; jj++)
                        {

                            // each sub wave
                            let j = jj
                            this.time.delayedCall(600 * j, () =>
                            {
                                for (var kk = 0; kk < this.waves[i][j]; kk++)
                                {

                                    // each element
                                    let k = kk
                                    let currentElement = this.elements.pop()
                                    let fr = this.generateElement({
                                        scene: this,
                                        /*x:gWidth/2,*/
                                        y: gHeight,
                                        type: currentElement,
                                        frozen: false,
                                        scale: 1.13
                                    })
                                    fr.body.label = fr.behavior
                                    fr.body.isSensor = true
                                    fr.setCollisionGroup(2)
                                    fr.shoot({
                                        y: -DATA.shootConfig.velocityY - rnd(0, 10),
                                        x: DATA.shootConfig.velocityX + rnd(0, 5)
                                    })

                                    this.remainingElements--
                                }

                            }, this)
                        }

                        // frozen fruit
                        if (rnd(1, 100) <= this.levelData.frozenProbability * 100)
                        {
                            let froz = this.generateElement({
                                scene: this,
                                /*x:gWidth/2,*/
                                y: gHeight,
                                type: fruitNames[rnd(0, 2)],
                                frozen: true
                            })
                            froz.body.label = "fruit-frozen"
                            froz.body.isSensor = true
                            froz.setCollisionGroup(2)
                            froz.shoot({
                                y: -DATA.shootConfig.velocityY - rnd(0, 5),
                                x: DATA.shootConfig.velocityX + rnd(0, 5)
                            })
                        }


                        this.remainingWaves--
                    }
                }, this)
            }
        }, this)


        // ---------------------- COLLISION --------------------------------
        this.matter.world.on('collisionstart', (event, colliderA, colliderB) =>
        {
            if (!this.pointerIsDown) return
            let image = colliderB
            let cut = colliderA
            let elementTags = ["fruit", "bonus", "char", "fruit-frozen"]
            if (elementTags.some(item => item == cut.label)) return
            image.gameObject.setVelocityY(-image.velocity.y)
            image.gameObject.getCutted()
            this.score++
            //image.cutted = true
            /*this.tweens.add({
                targets: image.gameObject,
                scale: 1.5,
                alpha: 0,
                duration: 400,
                onComplete: ()=> {
                    image.destroy()
                }
            })*/
        })


        // ------------------ pointer ------------------

        this.input.on('pointerdown', (p) =>
        {
            if (this.frozen) return
            this.pointerIsDown = true
            this.jake.head.alpha = 1
            this.jake.stand.alpha = 0
            this.jake.head.x = p.x
            this.jake.head.y = p.y
            this.pointer = p
            this.addCut(p)
        })
        this.input.on('pointermove', (p) =>
        {
            if (this.frozen) return
            if (this.pointerIsDown)
            {
                this.jake.head.x = p.x
                this.jake.head.y = p.y
            }
        })
        this.input.on('pointerup', (p) =>
        {
            if (this.frozen) return

            if (p.y < 160) return
            this.pointerIsDown = false
            this.jake.head.alpha = 0
            this.jake.stand.alpha = 1

            this.jake.stand.x = p.x
            this.jake.stand.y = p.y
            this.jake.stand.setFlipX(this.jake.stand.x >= gWidth / 2)

            this.pool.children.iterate((kid) =>
            {
                this.pool.killAndHide(kid)
            })

            this.index = 0
            this.beforeIndex = this.maxSize - 1
        })

        this.debugText = this.add.text(20, 200, "").setScale(2)

        // UI
        new ButtonImage({
            scene: this,
            x: gWidth - 115,
            y: 72,
            image: "button-pause",
            scale: 0.8,
            clickFunction: () =>
            {
                game.scene.start("OptionsScene", { parent: this })
            }
        })
        new ButtonImage({
            scene: this,
            x: gWidth - 225,
            y: 72,
            image: "button-audio",
            scale: 0.8,
            clickFunction: () =>
            {
                DATA.activateAudio(!DATA.isAudioActive())
            }
        })
        this.add.text(75 + 2, 92 + 2, "NIVEL " + this.level, {
            fontFamily: "avenir-bold",
            fontStyle: "bold",
            align: "center",
            fontSize: 42,
            color: "#432918",
            stroke: "#432918",
            strokeThickness: 7
        }).setOrigin(0, 0.5)
        this.add.text(75, 92, "NIVEL " + this.level, {
            fontFamily: "avenir-bold",
            fontStyle: "bold",
            align: "center",
            fontSize: 42,
            color: "#fff",
            stroke: "#432918",
            strokeThickness: 7
        }).setOrigin(0, 0.5)
    }

    // #####################################################################################################
    // ############################################## UPDATE ###############################################
    // #####################################################################################################

    update () 
    {
        if (this.pointerIsDown) this.addCut(this.pointer)
        this.jake.head.setFlipX(this.jake.head.x >= gWidth / 2)

        if (DATA.debug)
        {
            this.debugText.setText(
                "SCORE: " + this.score +
                "\npointerIsDown: " + this.pointerIsDown +
                "\n---" +
                /*"\nAmount: " + this.pool.countActive(true) +*/
                "\nRemaining Waves:  " + this.remainingWaves +
                "\nRemaining Fruits: " + this.remainingElements +
                "\n---" +
                "\nCollected " + this.levelData.fruits[0].type + ": " + this.collected[this.levelData.fruits[0].type] +
                "\nCollected " + this.levelData.fruits[1].type + ": " + this.collected[this.levelData.fruits[1].type] +
                "\nCollected " + this.levelData.fruits[2].type + ": " + this.collected[this.levelData.fruits[2].type] +
                "\n---" +
                "\nCollected " + this.levelData.bonuses[0].type + ": " + this.collected[this.levelData.bonuses[0].type] +
                "\nCollected " + this.levelData.bonuses[1].type + ": " + this.collected[this.levelData.bonuses[1].type] +
                "\nCollected " + this.levelData.character.type + ": " + this.collected.character +
                "\n---" +
                "")
        }
    }

    // #####################################################################################################
    // ############################################ FUNCTIONS ##############################################
    // #####################################################################################################
    addCut (p)
    {
        let cut = this.pool.get(p.x, p.y) // || this.pool.children.entries[this.index]
        if (!cut)
        {
            // kills the head
            let obj = this.pool.children.entries[this.index]
            //if (obj) this.matter.world.remove(obj.body)
            this.pool.killAndHide(obj)
            /*this.beforeIndex = this.index
            this.index++
            if (this.index > this.maxSize) this.index = 0*/
            cut = this.pool.get(p.x, p.y)
        }
        this.beforeIndex = this.index
        this.index++
        if (this.index >= this.maxSize)
        {
            this.index = 0
            /*cut.scale=7
            cut.alpha=0.5*/
        }


        let head = this.pool.children.entries[this.beforeIndex]
        let tail = this.pool.children.entries[this.index]


        //return cut
        if (cut)
        {
            cut.setActive(true)
            cut.setVisible(true)
            //this.matter.add.gameObject(cut)
        }
        this.pool.children.iterate((kid, index) =>
        {
            kid.scale = 1
            kid.alpha = 1
        })
        //console.log(this.index,siz, this.pool.children.entries.map((a,i) => {return {objectIndex: a.objectIndex, scale: i>=this.index? (i-this.index+1)*siz : (i+(this.maxSize-this.index)+1)*siz }}))
        //if (this.pool.getTotalUsed() < this.maxSize) return
        /*for (var i = this.index; i != this.beforeIndex; i==this.maxSize-1 ?  i=0 : i++) {
            let bi = i==0? this.maxSize-1 : i-1
            try {
            this.pool.children.entries[i].scale = 5*(i/this.maxSize)
            }
            catch(e) {console.log(i)}
        }*/
        let maxDistance = this.maxDistance
        if (Math.abs(head.y - p.y) > maxDistance)
        {
            head.y = head.y - p.y > 0 ? p.y + maxDistance : p.y - maxDistance
        }
        if (Math.abs(head.x - p.x) > maxDistance)
        {
            head.x = head.x - p.x > 0 ? p.x + maxDistance : p.x - maxDistance
        }


        let siz = 1 / this.maxSize
        for (var i = 0; i < this.maxSize; i++)
        {
            let indexObject = this.pool.children.entries[i]
            let beforeIndexObject = i == 0 ? this.pool.children.entries[this.maxSize - 1] : this.pool.children.entries[i - 1]

            let from = indexObject
            let to = beforeIndexObject
            if (i >= this.index)
            {
                indexObject.scale = 0.4 * (i - this.index + 1) * siz + 0.2
                indexObject.alpha = 0.8//1*(i*i-this.index+1)*siz

            } else
            {
                indexObject.scale = 0.4 * (i + (this.maxSize - this.index) + 1) * siz + 0.2
                indexObject.alpha = 0.8//1*(i+(this.maxSize-this.index)+1)*siz
            }
            //from.setAngle(Phaser.Math.Angle.Between(from.x, from.y, to.x, to.y)*(180/Math.PI))
            //gs = from

            /*if (Math.abs(from.x - to.x) < maxDistance) {
                from.x += maxDistance
            }*/


            /*let distance = Phaser.Math.Distance.Between(from.x, from.y, to.x, to.y)
            let maxDistance = 200
            if (distance < maxDistance) continue
            let angle = Phaser.Math.Angle.Between(from.x, from.y, to.x, to.y)
            let op = Math.abs(Math.sin(angle)*maxDistance)
            let ad = Math.cos(angle)*maxDistance*/
            //console.log(from.x, from.y,"vs", to.x, to.y)
            //console.log(from.x,to.x,"\n",from.y,to.y)
            //console.log([Math.floor(from.x), Math.floor(from.y)], [Math.floor(to.x), Math.floor(to.y)], [Math.floor(p.x), Math.floor(p.y)])
            /*from.x = from.x - ad
            from.y = from.y - op*/
            /*from.x = to.x + ad
            from.y = to.y + op*/
        }

        //let upPart = this.pool.
        /*let  orderedStele = this.pool.children.entries.map((k, i, a)=> {
            return a[i + this.beforeIndex] || a[i - this.maxSize - 1 ]
        })*/
        let orderedStele = []
        for (var i = this.beforeIndex; i >= 0; i--)
        {
            orderedStele.push(this.pool.children.entries[i])
        }
        for (var i = this.maxSize - 1; i >= this.index; i--)
        {
            orderedStele.push(this.pool.children.entries[i])
        }
        for (var i = 0; i < this.maxSize - 1; i++)
        {
            //if (i==) continue
            //let a=orderedStele
            let from = orderedStele[i + 1]
            let to = orderedStele[i] //|| orderedStele[0]
            if (Math.abs(from.y - to.y) > maxDistance)
            {
                //from.y = from.y - to.y > 0 ? to.y + maxDistance : to.y - maxDistance
                let d = from.y - to.y > 0 ? from.y - to.y - maxDistance : -(to.y - from.y - maxDistance)
                for (var j = i; j < this.maxSize - 1; j++)
                {
                    let f = orderedStele[j + 1]
                    let t = orderedStele[j]
                    f.y -= d
                }
            }
            if (Math.abs(from.x - to.x) > maxDistance)
            {
                let d = from.x - to.x > 0 ? from.x - to.x - maxDistance : -(to.x - from.x - maxDistance)
                for (var j = i; j < this.maxSize - 1; j++)
                {
                    let f = orderedStele[j + 1]
                    let t = orderedStele[j]
                    f.x -= d
                }
                //from.x = from.x - to.x > 0 ? to.x + maxDistance : to.x - maxDistance
            }
        }
        /*for (var i = this.beforeIndex; i != this.beforeIndex; i==this.maxSize-1 ?  i=0 : i++) {
            let bi = i==0? this.maxSize-1 : i-1
            try {
            this.pool.children.entries[i].scale = 5*(i/this.maxSize)
            }
            catch(e) {console.log(i)}
        }*/

        /*if (Math.abs(from.y - to.y) > maxDistance) {
            from.y = from.y - to.y > 0 ? to.y + maxDistance : to.y - maxDistance
        }
        if (Math.abs(from.x - to.x) > maxDistance) {
            from.x = from.x - to.x > 0 ? to.x + maxDistance : to.x - maxDistance
        }*/

        /*for (var i = 0; i != this.maxSize; i++) {
            //let bi = i==0? this.maxSize-1 : i-1
            let prev = i>=this.index
            let next 
            this.watchTo()
        }*/
        //this.index, this.pool.children.entries[this.index].setScale(5)
        /*
        else {    
            let obj = this.pool.children.entries[this.index]
            //if (obj) this.matter.world.remove(obj.body)
            this.pool.killAndHide(obj)
            this.beforeIndex = this.index
            this.index++
            if (this.index >= this.maxSize) this.index = 0
        }*/
    }
}
