function generateMaze(size) {
    // Initialize the maze.
    var maze = new Array(size);
    maze.size = size;
    for(var i = 0; i < size; i++) {
        maze[i] = new Array(size);
        for (var j = 0; j < size; j++) {
            maze[i][j] = true;
        }
    }

    //using Hunt-and-Kill algorithm to randomly create a maze
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


    // Gnerate the maze recursively.
    maze = iterate(maze, 1, 1);

    return maze;

}


