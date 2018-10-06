(function(urlstring) {
    const mazeApp = new MazeApp(document.querySelector("a-maze"))

    let mazeURL = "maze-01"

    if(urlstring) {
        const url = new URL(urlstring)
        const param = url.searchParams.get("maze");
        if(param) mazeURL = "mazes/" + param + ".json"
    }

    mazeApp.run(mazeURL).then(() => window.location.href = "index.html")
}) (window.location.href)
