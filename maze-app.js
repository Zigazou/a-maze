customElements.whenDefined("a-maze").then(() => {
    const maze = document.querySelector("a-maze")
    const gridSketch = [
        "XXXXXXXXXXXXXXXXXXXX",
        "X   X X X X X X    X",
        "XXX X         X X XX",
        "X X X XXXXXXX   X  X",
        "X X X       XXX XX X",
        "X X XXXXXXX   X XXXX",
        "X X     X.XXXXX    X",
        "X XXX X X..   XXX  X",
        "X     X ..X X      X",
        "X XXXXXX XX XXXXXX X",
        "X X   X   X X    X X",
        "X X X X X     XX X X",
        "X X X   X XXXXXXXX X",
        "X X X X   X        X",
        "XXXXXXXXXXXXXXXXXXXX"
    ]

    // Conversion table between the grid sketch and the tile sheet.
    const tiles = {
        'X': { x: 3, y: 4 },
        ' ': { x: 3, y: 0 },
        '.': { x: 7, y: 1 }
    }

    // Convert the grid sketch to a grid suitable for AMaze.
    const grid = gridSketch.map(row => {
        return row.match(/./g).map(character => tiles[character])
    })

    maze.loadGrid(grid)
        .loadSprites("tilesheet.png", 128, 128)
        .then(() => {
            // Handles every move.
            const move = (x, y) => {
                if(gridSketch[y].substr(x, 1) !== 'X') {
                    maze.moveHero(x, y).lighten(x, y)
                }
            }

            // Starting position of the hero.
            maze.defineHero(13, 0)
                .moveHero(9, 7)
                .lighten(9, 7)

            // Listen to arrow keys.
            document.addEventListener("keydown", e => {
                switch(e.keyCode) {
                    case 38:
                        move(maze.heroCol, maze.heroRow - 1)
                        break
                    case 37:
                        move(maze.heroCol - 1, maze.heroRow)
                        break
                    case 39:
                        move(maze.heroCol + 1, maze.heroRow)
                        break
                    case 40:
                        move(maze.heroCol, maze.heroRow + 1)
                        break
                }
            })

            // Listen to direction buttons.
            document.getElementById("up").addEventListener(
                "click", () => move(maze.heroCol, maze.heroRow - 1)
            )

            document.getElementById("left").addEventListener(
                "click", () => move(maze.heroCol - 1, maze.heroRow)
            )

            document.getElementById("right").addEventListener(
                "click", () => move(maze.heroCol + 1, maze.heroRow)
            )

            document.getElementById("down").addEventListener(
                "click", () => move(maze.heroCol, maze.heroRow + 1)
            )
        })
})
