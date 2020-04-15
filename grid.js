class Grid {
    constructor(
        isRandom = false,
        height,
        width,
        threshold,
        liveSlotMinLiveNeighboursToKeepAlive,
        liveSlotMaxLiveNeighboursToKeepAlive,
        deadSlotMinLiveNeighboursToBringToLife,
        deadSlotMaxLiveNeighboursToBringToLife
    ) {
        this.height = height;
        this.width = width;
        this.threshold = threshold;
        this.liveSlotMinLiveNeighboursToKeepAlive = liveSlotMinLiveNeighboursToKeepAlive;
        this.liveSlotMaxLiveNeighboursToKeepAlive = liveSlotMaxLiveNeighboursToKeepAlive;
        this.deadSlotMinLiveNeighboursToBringToLife = deadSlotMinLiveNeighboursToBringToLife;
        this.deadSlotMaxLiveNeighboursToBringToLife = deadSlotMaxLiveNeighboursToBringToLife;

        this.grid = Array(height);
        for (var row = 0; row < this.height; row++) {
            this.grid[row] = [];
        }

        if (isRandom) {
            this.createRandomGrid();
        }
    }

    createRandomGrid() {
        for (var row = 0; row < this.height; row++) {
            for (var column = 0; column < this.width; column++) {
                var randomNumber = Math.random();
                this.grid[row][column] = randomNumber < this.threshold ? true : false;
            }
        }
    }

    static iterate(g) {
        var newGrid = new Grid(
            false,
            g.height,
            g.width,
            g.threshold,
            g.liveSlotMinLiveNeighboursToKeepAlive,
            g.liveSlotMaxLiveNeighboursToKeepAlive,
            g.deadSlotMinLiveNeighboursToBringToLife,
            g.deadSlotMaxLiveNeighboursToBringToLife);



        for (var row = 0; row < newGrid.height; row++) {
            for (var column = 0; column < newGrid.width; column++) {
                newGrid.grid[row][column] = g.iterateCell(row, column);
            }
        }
        return newGrid;
    }

    getNeighbour(row, column) {

        var neighbourValue;
        try {
            neighbourValue = this.grid[row][column];
        }
        catch {
            neighbourValue = false;
        }

        return neighbourValue;
    }

    getNumberOfLiveNeighbours(row, column) {
        var ans = 0;

        if (this.getNeighbour(row - 1, column - 1)) {
            ans += 1
        }

        if (this.getNeighbour(row - 1, column)) {
            ans += 1
        }

        if (this.getNeighbour(row - 1, column + 1)) {
            ans += 1
        }

        if (this.getNeighbour(row, column - 1)) {
            ans += 1
        }

        if (this.getNeighbour(row, column + 1)) {
            ans += 1
        }

        if (this.getNeighbour(row + 1, column - 1)) {
            ans += 1
        }

        if (this.getNeighbour(row + 1, column)) {
            ans += 1
        }

        if (this.getNeighbour(row + 1, column + 1)) {
            ans += 1
        }
        return ans;
    }

    iterateCell(row, column) {
        var liveNeighbours = this.getNumberOfLiveNeighbours(row, column);
        var isCellAlive = this.grid[row][column];

        // live slots handling
        if (isCellAlive) {
            if (liveNeighbours >= this.liveSlotMinLiveNeighboursToKeepAlive && liveNeighbours <= this.liveSlotMaxLiveNeighboursToKeepAlive) {
                return true;
            }
            return false;
        }
        // dead slots handling
        if (liveNeighbours >= this.deadSlotMinLiveNeighboursToBringToLife && liveNeighbours <= this.deadSlotMaxLiveNeighboursToBringToLife) {
            return true;
        }

        return false;
    }

    flatten() {
        var ans = Array();

        for (var row = 0; row < this.height; row++) {
            for (var column = 0; column < this.width; column++) {
                ans.push(this.grid[row][column]);
            }
        }

        return ans;
    }
}