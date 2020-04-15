// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
let ctx = null;
const tileW = 35, tileH = 35;
const mapW = 20, mapH = 20;
let settings = {};
let stopLoop = false;
var g;

window.onload = function () {
    ctx = document.getElementById('game').getContext("2d");
};

window.onbeforeunload = function () {
    ctx = document.getElementById('game').getContext("2d");
};

function pause() {
    stopLoop = !stopLoop;
    let pauseButton = document.getElementById("pauseButton");
    pauseButton.value = stopLoop ? "Continue" : "Pause";
    if (!stopLoop) {
        startLoop();
    }
}


function setInfoWindowTextOpacity(opacity) {
    document.getElementById('infoWindowText').style.opacity = opacity;
}

function setInfoWindowTextValue(text) {
    document.getElementById('infoWindowText').innerText = text;
}

function start() {
    var height = 20;
    var width = 20;
    var threshold = 0.33;
    var liveSlotMinLiveNeighboursToKeepAlive = 2;
    var liveSlotMaxLiveNeighboursToKeepAlive = 3;
    var deadSlotMinLiveNeighboursToBringToLife = 3;
    var deadSlotMaxLiveNeighboursToBringToLife = 3;

    g = new Grid(
        true,
        height,
        width,
        threshold,
        liveSlotMinLiveNeighboursToKeepAlive,
        liveSlotMaxLiveNeighboursToKeepAlive,
        deadSlotMinLiveNeighboursToBringToLife,
        deadSlotMaxLiveNeighboursToBringToLife);

    initializeNewGame();
    getSettingsFromForm();
    startLoop();

    return;

    function initializeNewGame() {
        setInfoWindowTextOpacity(0);
        setInfoWindowTextValue("");
        isGameFinished = false;
        stopLoop = false;
        let pauseButton = document.getElementById("pauseButton");
        pauseButton.value = "Pause";
    }

    function getSettingsFromForm() {
        let threshold = Number(document.getElementById("threshold").value);
        if (threshold == null || threshold < 0 || threshold > 100) {
            alert("Must be between 0-100");
            return;
        }
        settings['threshold'] = threshold;

        let liveSlotMinLiveNeighboursToKeepAlive = Number(document.getElementById("liveSlotMinLiveNeighboursToKeepAlive").value);
        if (liveSlotMinLiveNeighboursToKeepAlive == null || liveSlotMinLiveNeighboursToKeepAlive < 0 || liveSlotMinLiveNeighboursToKeepAlive > 8) {
            alert("Must be between 0-8");
            return;
        }
        settings['liveSlotMinLiveNeighboursToKeepAlive'] = liveSlotMinLiveNeighboursToKeepAlive;

        let liveSlotMaxLiveNeighboursToKeepAlive = Number(document.getElementById("liveSlotMaxLiveNeighboursToKeepAlive").value);
        if (liveSlotMaxLiveNeighboursToKeepAlive == null || liveSlotMaxLiveNeighboursToKeepAlive < 0 || liveSlotMinLiveNeighboursToKeepAlive > 8) {
            alert("Must be between 0-8");
            return;
        }
        settings['liveSlotMaxLiveNeighboursToKeepAlive'] = liveSlotMaxLiveNeighboursToKeepAlive;

        let deadSlotMinLiveNeighboursToBringToLife = Number(document.getElementById("deadSlotMinLiveNeighboursToBringToLife").value);
        if (deadSlotMinLiveNeighboursToBringToLife == null || deadSlotMinLiveNeighboursToBringToLife < 0 || deadSlotMinLiveNeighboursToBringToLife > 8) {
            alert("Must be between 0-8");
            return;
        }
        settings['deadSlotMinLiveNeighboursToBringToLife'] = deadSlotMinLiveNeighboursToBringToLife;

        let deadSlotMaxLiveNeighboursToBringToLife = Number(document.getElementById("deadSlotMaxLiveNeighboursToBringToLife").value);
        if (deadSlotMaxLiveNeighboursToBringToLife == null || deadSlotMaxLiveNeighboursToBringToLife < 0 || deadSlotMaxLiveNeighboursToBringToLife > 8) {
            alert("Must be between 0-8");
            return;
        }
        settings['deadSlotMaxLiveNeighboursToBringToLife'] = deadSlotMaxLiveNeighboursToBringToLife;
    }
}


function drawGame(g) {
    if (ctx == null) {
        return false;
    }

    fillCanvasWithGameMap(g.flatten());


    function fillCanvasWithGameMap(gameMap) {
        for (let y = 0; y < mapH; ++y) {
            for (let x = 0; x < mapW; ++x) {
                if (gameMap[((y * mapW) + x)]) {
                    ctx.fillStyle = "#ccffcc";
                } else {
                    ctx.fillStyle = "#000000";
                }

                ctx.fillRect(x * tileW, y * tileH, tileW, tileH);
            }
        }
    }
}



function nextStep() {
    if (!stopLoop) {
        pause();
    }
    drawGame(g);
    g = Grid.iterate(g);
}

function startLoop() {
    if (!stopLoop) {
        setTimeout(() => {
            drawGame(g);
            newGrid = Grid.iterate(g);

            if (JSON.stringify(g.grid) === JSON.stringify(newGrid.grid)) {
                setInfoWindowTextOpacity(1);
                setInfoWindowTextValue("Game Finished");
                return;
            } else {
                g = newGrid;
                startLoop();
            }
        }, 100);
    }
}

