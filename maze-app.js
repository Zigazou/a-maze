/**
 * @file maze-app.js
 * @author Frédéric BISSON <zigazou@free.fr>
 * @version 1.0
 *
 * MazeApp has the responsibility to initialize the Maze zone, run the Maze
 * engine and run a map.
 */

/**
 * MazeApp has the responsibility to initialize the Maze zone, run the Maze
 * engine and run a map.
 */
class MazeApp {
    /**
     * Create a Maze application.
     *
     * @param {AMaze} maze 
     */
    constructor(maze) {
        /**
         * The AMaze tag that will be used to draw the game.
         * @member {AMaze} maze
         * @private
         */
        this.maze = maze

        /**
         * The game map, a structure generated by Tiled and modified by the game
         * engine.
         * @member {Object}
         * @private
         */
        this.gameMap = undefined

        /**
         * The game engine responsible of applying the game rules.
         * @member {MazeEngine}
         * @private
         */
        this.engine = undefined

        /**
         * The MessAge tag that will be used to display message and question to
         * the player.
         * @member {MessAge}
         * @private
         */
        this.message = undefined

        /**
         * The ScoreBoard tag that will be used to display the current score of
         * the player.
         * @member {ScoreBoard}
         * @private
         */
        this.score = undefined
    }

    /**
     * Load a game map at a specified URL and run the game.
     * @param {string} gameMapURL 
     * @returns {Promise}
     */
    run(gameMapURL) {
        // Ensures that every need custom elements has been defined.
        return Promise.all([
            customElements.whenDefined("a-maze"),
            customElements.whenDefined("mess-age"),
            customElements.whenDefined("score-board"),
            customElements.whenDefined("joy-stick")
        ])
        .then(() => fetch(gameMapURL, { method: "get" }))
        .then(response => response.json())
        .then(gameMap => {
            // Initializes the AMaze custom element and run the Maze Engine.
            this.gameMap = gameMap
            this.message = document.getElementById("message")
            this.score = document.getElementById("score")

            this.maze.setAttribute("cell-size", this.gameMap.tilewidth)
            this.maze.setAttribute("tiles-url", this.gameMap.tilesets[0].image)

            this.engine = new MazeEngine(this.maze, this.message, this.score)

            // Listen to the Joystick and transfers command to the engine.
            document.getElementById("joystick").addEventListener(
                "joystick-move", e => this.engine.moveHero(e.detail)
            )

            // Let the engine to the rest.
            return this.engine.loadMap(this.gameMap)
        })
    }
}
