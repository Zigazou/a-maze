class MazeApp {
    constructor(maze) {
        this.maze = maze
    }

    run(rawGrid, gWidth, sWidth) {
        customElements.whenDefined("a-maze").then(() => {
            this.engine = new MazeEngine(this.maze)
            this.engine.loadBackground(rawGrid, gWidth, sWidth).then(() => {
                this.engine.initHero(26, 0, 9, 9)
                document.getElementById("joystick").addEventListener(
                    "joystick-move", e => this.engine.moveHero(e.detail)
                )
            })
        })
    }
}
