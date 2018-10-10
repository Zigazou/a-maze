/**
 * @file play-maze.js
 * @author Frédéric BISSON <zigazou@free.fr>
 * @version 1.0
 *
 * Run a maze.
 */
(function(urlstring) {
    // Looks for the first a-maze tag.
    const mazeApp = new MazeApp(document.querySelector("a-maze"))

    // Default maze identifier.
    let mazeURL = "maze-01"

    // Looks for the "maze" parameter in the URL.
    if(urlstring) {
        const url = new URL(urlstring)
        const param = url.searchParams.get("maze");
        if(param) mazeURL = "mazes/" + param + ".json"
    }

    // Runs the maze and goes back to the index page when the game ends.
    mazeApp.run(mazeURL).then(() => window.location.href = "index.html")
}) (window.location.href)
