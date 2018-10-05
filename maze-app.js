class MazeApp {
    constructor(maze) {
        this.maze = maze
        this.gameMap = undefined
    }

    run(gameMapURL) {
        Promise.all([
            customElements.whenDefined("a-maze"),
            customElements.whenDefined("mess-age"),
            customElements.whenDefined("joy-stick")
        ])
        .then(() => fetch(gameMapURL, { method: "get" }))
        .then(response => response.json())
        .then(gameMap => {
            this.gameMap = gameMap
            this.message = document.getElementById("message")

            this.maze.setAttribute("cell-size", this.gameMap.tilewidth)
            this.maze.setAttribute("tiles-url", this.gameMap.tilesets[0].image)

            this.engine = new MazeEngine(this.maze, this.message)

            return this.engine.loadMap(this.gameMap)
        })
        .then(() => {
            this.engine.initHero(2909, 18, 14)
            document.getElementById("joystick").addEventListener(
                "joystick-move", e => this.engine.moveHero(e.detail)
            )
        })
    }
}
