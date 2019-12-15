function generateMaze(size) {
    //var size = [11,15,19];
    // console.log(levelNum-1);
    // var size = sizes[levelNum-1];
    // console.log("size is", size);
    function iterate(maze, x, y) {
        maze[x][y] = false;
        while(true) {
            directions = [];
            if(x > 1 && maze[x-2][y] == true) {
                directions.push([-1, 0]);
            }
            if(x < maze.size - 2 && maze[x+2][y] == true) {
                directions.push([1, 0]);
            }
            if(y > 1 && maze[x][y-2] == true) {
                directions.push([0, -1]);
            }
            if(y < maze.size - 2 && maze[x][y+2] == true) {
                directions.push([0, 1]);
            }
            if(directions.length == 0) {
                return maze;
            }
            dir = directions[Math.floor(Math.random()*directions.length)];
            maze[x+dir[0]][y+dir[1]] = false;
            maze = iterate(maze, x+dir[0]*2, y+dir[1]*2);
        }
    }
    console.log(size);

    // Initialize the maze.
    console.log(size);
    var maze = new Array(size);
    maze.size = size;
    console.log("maze size is", maze.size);
    for(var i = 0; i < size; i++) {
        maze[i] = new Array(size);
        for (var j = 0; j < size; j++) {
            maze[i][j] = true;
        }
    }

    // Gnerate the maze recursively.
    maze = iterate(maze, 1, 1);

    return maze;

}


