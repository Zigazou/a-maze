class MazeApp {
    constructor(maze) {
        this.maze = maze
        this.gameMap = undefined
        this.engine = undefined
        this.message = undefined
        this.score = undefined
    }

    run(gameMapURL) {
        return Promise.all([
            customElements.whenDefined("a-maze"),
            customElements.whenDefined("mess-age"),
            customElements.whenDefined("score-board"),
            customElements.whenDefined("joy-stick")
        ])
        .then(() => fetch(gameMapURL, { method: "get" }))
        .then(response => response.json())
        .then(gameMap => {
            this.gameMap = gameMap
            this.message = document.getElementById("message")
            this.score = document.getElementById("score")

            this.maze.setAttribute("cell-size", this.gameMap.tilewidth)
            this.maze.setAttribute("tiles-url", this.gameMap.tilesets[0].image)

            this.engine = new MazeEngine(this.maze, this.message, this.score)

            document.getElementById("joystick").addEventListener(
                "joystick-move", e => this.engine.moveHero(e.detail)
            )

            return this.engine.loadMap(this.gameMap)
        })
    }
}
