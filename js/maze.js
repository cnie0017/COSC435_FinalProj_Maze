function generateMaze(dimension) {

    function iterate(field, x, y) {
        field[x][y] = false;
        while(true) {
            directions = [];
            if(x > 1 && field[x-2][y] == true) {
                directions.push([-1, 0]);
            }
            if(x < field.dimension - 2 && field[x+2][y] == true) {
                directions.push([1, 0]);
            }
            if(y > 1 && field[x][y-2] == true) {
                directions.push([0, -1]);
            }
            if(y < field.dimension - 2 && field[x][y+2] == true) {
                directions.push([0, 1]);
            }
            if(directions.length == 0) {
                return field;
            }
            dir = directions[Math.floor(Math.random()*directions.length)];
            field[x+dir[0]][y+dir[1]] = false;
            field = iterate(field, x+dir[0]*2, y+dir[1]*2);
        }
    }

    // Initialize the field.
    var field = new Array(dimension);
    field.dimension = dimension;
    for(var i = 0; i < dimension; i++) {
        field[i] = new Array(dimension);
        for (var j = 0; j < dimension; j++) {
            field[i][j] = true;
        }
    }

    // Gnerate the maze recursively.
    field = iterate(field, 1, 1);

    return field;

}

function CreateMazeMesh(maze) {
    console.log("size is",size);
    //to be changed later
      for (var i = 0; i < maze.dimension; i++) {
          for (var j = 0; j < maze.dimension; j++) {
              var mazeObj = maze[i][j];
              if (mazeObj) {
          if (i == entranceXidx && j==entranceZidx){//entrance
            createTree(entranceX,entranceZ,blue);
            maze[i+1][j] = true;
          }
          else if (i == exitXidx && j == exitZidx){//exit
            //exit location = (-300+exitZidx*distance, -300+exitXidx*distance)
            createTree(-300+j*distance,-300+i*distance,yellow);
          }
          else{
            createTree(-300+j*distance,-300+i*distance,green);
          }
        }
      }
     }
  }
