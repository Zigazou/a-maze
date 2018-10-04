customElements.whenDefined("a-maze").then(() => {
    const maze = document.querySelector("a-maze")
    const rawGrid = [109, 111, 111, 111, 111, 111, 111, 112, 111, 111, 111, 111, 112, 111, 111, 111, 111, 111, 221, 117, 138, 1, 1, 1, 1, 1, 1, 115, 1, 1, 1, 1, 138, 1, 1, 1, 1, 1, 143, 247, 138, 1, 313, 282, 285, 1, 1, 1, 1, 312, 1, 1, 115, 1, 196, 1, 141, 1, 1, 138, 138, 1, 1, 1, 1, 1, 313, 282, 282, 284, 281, 1, 1, 1, 1, 1, 138, 1, 142, 140, 138, 1, 313, 282, 281, 1, 1, 1, 1, 1, 309, 1, 109, 111, 111, 111, 140, 1, 1, 138, 138, 1, 1, 1, 307, 282, 282, 282, 283, 282, 308, 1, 138, 1, 1, 1, 139, 114, 1, 138, 138, 1, 141, 1, 1, 1, 1, 1, 286, 1, 1, 1, 138, 1, 141, 1, 138, 1, 1, 138, 138, 1, 139, 111, 111, 111, 110, 1, 1, 1, 142, 111, 140, 1, 138, 1, 136, 111, 111, 140, 138, 1, 115, 1, 1, 1, 139, 111, 110, 1, 1, 1, 115, 1, 138, 1, 1, 1, 1, 138, 138, 1, 1, 1, 141, 1, 115, 1, 115, 1, 141, 1, 1, 1, 139, 111, 111, 114, 1, 138, 139, 111, 111, 111, 140, 1, 1, 1, 1, 1, 138, 1, 141, 1, 138, 1, 1, 1, 1, 138, 138, 1, 1, 1, 139, 111, 111, 111, 110, 1, 115, 1, 138, 1, 138, 1, 142, 110, 1, 138, 138, 1, 141, 1, 138, 1, 1, 1, 138, 1, 1, 1, 138, 1, 138, 1, 1, 138, 1, 138, 138, 1, 136, 111, 137, 1, 141, 1, 139, 111, 114, 1, 138, 1, 136, 111, 111, 137, 1, 138, 138, 1, 1, 1, 1, 1, 138, 1, 115, 1, 1, 1, 138, 1, 1, 1, 1, 1, 1, 138, 138, 1, 142, 111, 111, 111, 140, 1, 1, 1, 142, 111, 113, 111, 112, 111, 111, 114, 1, 138, 138, 1, 1, 1, 1, 1, 138, 1, 141, 1, 1, 1, 1, 1, 115, 1, 1, 1, 1, 138, 138, 1, 1, 131, 1, 1, 138, 1, 136, 111, 111, 111, 114, 1, 1, 1, 142, 111, 111, 140, 138, 1, 1, 1, 1, 1, 138, 1, 1, 1, 1, 1, 1, 1, 141, 1, 1, 1, 1, 138, 136, 111, 111, 111, 111, 111, 113, 111, 111, 111, 111, 111, 111, 111, 113, 111, 111, 111, 111, 137]

    const sketchGrid = rawGrid.reduce((all, one, i) => {
        const ch = Math.floor(i / 20)
        all[ch] = [].concat(all[ch] || [], one)
        return all
    }, [])

    // Convert the grid sketch to a grid suitable for AMaze.
    const grid = sketchGrid.map(row => {
        return row.map(offset => {
            offset--
            return {
                x: offset % 27,
                y: Math.floor(offset / 27),
                offset: offset
            }
        })
    })

    maze.loadGrid(grid)
        .then(() => {
            // Handles every move.
            const move = (x, y) => {
                if(grid[y][x].offset < 27) {
                    maze.moveHero(x, y).lighten(x, y)
                }
            }

            // Starting position of the hero.
            maze.defineHero(26, 0)
                .moveHero(9, 9)
                .lighten(9, 9)

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
