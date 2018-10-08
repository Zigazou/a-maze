class MazeEngine {
    constructor(maze, message, score) {
        this.gameMap = {}
        this.walls = [[]]
        this.objects = []
        this.maze = maze
        this.message = message
        this.score = score
        this.hero = {
            x: 0,
            y: 0,
            health: 100,
            attack: 10,
            defense: 0,
            treasure: 0
        }

        this.score.setScore("health", this.hero.health)
        this.score.setScore("attack", this.hero.attack)
        this.score.setScore("defense", this.hero.defense)
        this.score.setScore("wealth", this.hero.treasure)

        this.showingMessage = false

        this.endGame = undefined
    }

    loadMap(gameMap) {
        this.gameMap = gameMap
        const sheetWidth = gameMap.tilesets[0].columns
        const layers = {
            "background": undefined,
            "decor": undefined,
            "objects": undefined,
            "walls": undefined
        }

        if(gameMap.properties) {
            gameMap.properties.forEach(
                property => gameMap.properties[property.name] = property
            )
        }

        gameMap.layers.forEach(layer => {
            if(layer.name in layers) {
                if(layer.name === "objects") {
                    layers[layer.name] = MazeEngine.convertObjects(
                        layer.objects, sheetWidth
                    )
                } else {
                    layers[layer.name] = MazeEngine.convertRawGrid(
                        layer.data, layer.width, sheetWidth
                    )
                }
            }
        })

        this.walls = layers.walls
        this.objects = layers.objects

        this.maze.loadGrid(
            layers.background,
            layers.decor,
            layers.objects,
            layers.walls
        ).then(() => {
            if(this.gameMap.properties.darkness.value === false) {
                this.maze.revealMap()
            }

            this.initHero(
                this.gameMap.properties.herosprite.value,
                this.gameMap.properties.startx.value,
                this.gameMap.properties.starty.value
            )
        })

        return new Promise((resolve, reject) => {
            this.endGame = value => resolve(value)
        })
    }

    initHero(offset, col, row) {
        const srcCol = offset % this.gameMap.tilesets[0].columns
        const srcRow = Math.floor(offset / this.gameMap.tilesets[0].columns)

        this.maze.defineHero(srcCol, srcRow)
        this.moveHero(col, row)
    }

    moveHero(dir, y) {
        if(this.showingMessage) return

        const directions = {
            "up": { x: 0, y: -1 },
            "down": { x: 0, y: 1 },
            "left": { x: -1, y: 0 },
            "right": { x: 1, y: 0 }
        }

        const nx = directions[dir] ? this.hero.x + directions[dir].x : dir
        const ny = directions[dir] ? this.hero.y + directions[dir].y : y

        if(this.walls[ny][nx].offset < 0) {
            const object = this.objectAt(nx, ny)

            if(object && object.visible) {
                const callbackName = "handleObject" + object.type
                if(callbackName in this) this[callbackName](object)
            } else {
                this.changePosition(nx, ny)
            }
        }
    }

    changePosition(x, y) {
        this.maze.moveHero(x, y).switchOffTheLight().lighten(x, y)
        this.hero.x = x
        this.hero.y = y
    }

    deleteObject(object) {
        this.objects.find((o, index) => {
            if(o === object) {
                this.objects.splice(index, 1)
                return true
            }

            return false
        })
    }

    objectAt(x, y) {
        return this.objects.find(object => object.x === x && object.y === y)
    }

    handleObjectedible(object) {
        this.showingMessage = true
        this.message.showMessage(
            "You eat some…",
            object.name,
            "Your health increases"
        ).then(() => {
            this.deleteObject(object)
            this.hero.health += object.properties.health.value
            this.score.setScore("health", this.hero.health)
            this.maze.drawObjects()
            this.changePosition(object.x, object.y)
            this.showingMessage = false
        })
    }

    handleObjectinedible(object) {
        this.showingMessage = true
        this.message.showMessage(
            "You eat some…",
            object.name,
            "Your health decreases"
        ).then(() => {
            this.deleteObject(object)
            this.hero.health -= object.properties.health.value
            this.score.setScore("health", this.hero.health)
            this.maze.drawObjects()
            this.changePosition(object.x, object.y)
            this.showingMessage = false
        })
    }

    handleObjectshow(object) {
        const objectIDs = MazeEngine.toList(object.properties.object.value)
        const targets = this.objects.filter(o => objectIDs.indexOf(o.id) >= 0)

        if(targets.length !== 0) {
            targets.forEach(object => object.visible = true)
            this.maze.drawObjects()
        }

        this.changePosition(object.x, object.y)
    }

    handleObjecthide(object) {
        const objectIDs = MazeEngine.toList(object.properties.object.value)
        const targets = this.objects.filter(o => objectIDs.indexOf(o.id) >= 0)

        if(targets.length !== 0) {
            targets.forEach(object => object.visible = false)
            this.maze.drawObjects()
        }

        this.changePosition(object.x, object.y)
    }

    handleObjectshowmap(object) {
        this.maze.revealMap()
        this.changePosition(object.x, object.y)
    }

    handleObjecthidemap(object) {
        this.maze.hideMap()
        this.changePosition(object.x, object.y)
    }

    handleObjectweapon(object) {
        this.showingMessage = true
        this.message.showMessage(
            "You found…",
            object.name,
            "Your attack increases"
        ).then(() => {
            this.hero.attack += object.properties.attack.value
            this.score.setScore("attack", this.hero.attack)
            this.deleteObject(object)
            this.maze.drawObjects()
            this.changePosition(object.x, object.y)
            this.showingMessage = false
        })
    }

    handleObjectsecret(object) {
        this.showingMessage = true
        this.message.showMessage(
            object.properties.title.value,
            object.properties.subject.value,
            object.properties.description.value
        ).then(() => {
            this.deleteObject(object)
            this.maze.drawObjects()
            this.changePosition(object.x, object.y)
            this.showingMessage = false
        })
    }

    handleObjectprotection(object) {
        this.showingMessage = true
        this.message.showMessage(
            "You found…",
            object.name,
            "Your defense increases"
        ).then(() => {
            this.hero.defense += object.properties.defense.value
            this.score.setScore("defense", this.hero.defense)
            this.deleteObject(object)
            this.maze.drawObjects()
            this.changePosition(object.x, object.y)
            this.showingMessage = false
        })
    }

    handleObjecttreasure(object) {
        this.showingMessage = true
        this.message.showMessage(
            "You found…",
            object.name,
            "You are richer"
        ).then(() => {
            this.hero.treasure += object.properties.fortune.value
            this.score.setScore("wealth", this.hero.treasure)
            this.deleteObject(object)
            this.maze.drawObjects()
            this.changePosition(object.x, object.y)
            this.showingMessage = false
        })
    }

    handleObjectteleport(object) {
        const destination = this.objects.find(
            o => o.id === object.properties.destination.value
        )

        this.changePosition(destination.x, destination.y)
    }

    handleObjectwin(object) {
        this.message.showMessage(
            object.properties.title.value,
            object.properties.subject.value,
            object.properties.description.value
        ).then(() => this.endGame())
    }

    handleObjectquestion(object) {
        let success = false

        this.showingMessage = true

        this.message.showQuestion(
            "A right answer open the way",
            object.properties.question.value,
            [
                object.properties.choice0.value,
                object.properties.choice1.value,
                object.properties.choice2.value,
                object.properties.choice3.value
            ]
        ).then(answer => {
            if(answer === object.properties.answer.value) {
                success = true
                return this.message.showMessage(
                    "You have given...",
                    "The right answer!",
                    "I will clear the way."
                )
            } else {
                return this.message.showMessage(
                    "You have given...",
                    "The wrong answer!",
                    "Come to me later when you figure the right answer."
                )
            }
        }).then(() => {
            if(success) {
                this.deleteObject(object)
                this.maze.drawObjects()
                this.changePosition(object.x, object.y)
            }

            this.showingMessage = false
        })
    }
}

MazeEngine.toList = function(value) {
    return value.toString().split(',').map(a => parseInt(a))
}

MazeEngine.convertObjects = function(objects, sheetWidth) {
    return objects.map(object => {
        const coords = MazeEngine.offsetToCoordinates(object.gid, sheetWidth)
        object.offset = coords.offset
        object.srcX = coords.x
        object.srcY = coords.y
        object.x = object.x / object.width
        object.y = object.y / object.height - 1

        if(object.properties) {
            object.properties.forEach(
                property => object.properties[property.name] = property
            )
        }

        return object
    })
}

MazeEngine.offsetToCoordinates = function(offset, sheetWidth) {
    offset--
    return {
        x: offset % sheetWidth,
        y: Math.floor(offset / sheetWidth),
        offset: offset
    }
}

MazeEngine.offsetsToCoordinates = function(offsets, sWidth) {
    return offsets.map(offset => MazeEngine.offsetToCoordinates(offset, sWidth))
}

MazeEngine.convertRawGrid = function(rawGrid, gridWidth, sheetWidth) {
    return rawGrid.reduce((all, one, i) => {
        // Converts the 1 dimensional array to a 2 dimensional array.
        const ch = Math.floor(i / gridWidth)
        all[ch] = [].concat(all[ch] || [], one)
        return all
    }, []).map(row => MazeEngine.offsetsToCoordinates(row, sheetWidth))
}
