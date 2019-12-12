//An object to stores the information of different levels

class Level{ //default
    constructor(num){
        this.levelnum = num;
        this.maze;
    } 
    getMaze(){
        //level 1 - size 11
        //level 2 - size 15
        //level 3 - size 19
        return generateMaze(11+(this.levelnum -1)*4);
    }    
}   