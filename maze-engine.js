class MazeEngine {
    constructor(maze, message) {
        this.gameMap = {}
        this.walls = [[]]
        this.objects = []
        this.maze = maze
        this.message = message
        this.hero = { x: 0, y: 0 }
        this.showingMessage = false
    }

    loadMap(gameMap) {
        this.gameMap = gameMap
        const sheetWidth = gameMap.tilesets[0].columns
        const layers = {
            "background": undefined,
            "objects": undefined,
            "walls": undefined
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

        return this.maze.loadGrid(
            layers.background, layers.objects, layers.walls
        )
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

    objectAt(x, y) {
        return this.objects.find(object => object.x === x && object.y === y)
    }

    handleObjectfood(object) {
        this.showingMessage = true
        this.message.showMessage(
            "You eat some…",
            object.name,
            "Your health increases"
        ).then(() => {
            object.visible = false
            this.maze.drawObjects()
            this.changePosition(object.x, object.y)
            this.showingMessage = false
        })
    }

    handleObjectattack(object) {
        this.showingMessage = true
        this.message.showMessage(
            "You found…",
            object.name,
            "Your attack increases"
        ).then(() => {
            object.visible = false
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
                object.visible = false
                this.maze.drawObjects()
                this.changePosition(object.x, object.y)
            }

            this.showingMessage = false
        })
    }
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