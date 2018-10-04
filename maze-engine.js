class MazeEngine {
    constructor(maze) {
        this.background = [[]]
        this.objects = []
        this.maze = maze
        this.hero = { x: 0, y: 0 }
    }

    loadBackground(rawGrid, gridWidth, sheetWidth) {
        const sketchGrid = rawGrid.reduce((all, one, i) => {
            const ch = Math.floor(i / gridWidth)
            all[ch] = [].concat(all[ch] || [], one)
            return all
        }, [])

        // Convert the grid sketch to a grid suitable for AMaze.
        const grid = sketchGrid.map(row => {
            return row.map(offset => {
                offset--
                return {
                    x: offset % sheetWidth,
                    y: Math.floor(offset / sheetWidth),
                    offset: offset
                }
            })
        })

        this.background = grid

        return this.maze.loadGrid(grid)
    }

    initHero(srcCol, srcRow, col, row) {
        this.maze.defineHero(srcCol, srcRow)
        this.moveHero(col, row)
    }

    moveHero(dir, y) {
        const directions = {
            "up": { x: 0, y: -1 },
            "down": { x: 0, y: 1 },
            "left": { x: -1, y: 0 },
            "right": { x: 1, y: 0 }
        }

        const nx = directions[dir] ? this.hero.x + directions[dir].x : dir
        const ny = directions[dir] ? this.hero.y + directions[dir].y : y

        try {
            if(this.background[ny][nx].offset < 27) {
                this.maze.moveHero(nx, ny).lighten(nx, ny)
                this.hero.x = nx
                this.hero.y = ny
            }
        } catch {}
    }
}