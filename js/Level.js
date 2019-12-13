//An object to stores the information of different levels

class Level{ //default
    constructor(num){
        this.levelNum = num;
        this.maze = generateMaze(this.levelNum);
        //level 1 - size 11
        //level 2 - size 15
        //level 3 - size 19
    } 
}   