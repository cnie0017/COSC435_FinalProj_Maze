//An object to stores the information of the current game

var game = { //default
   levelNum:1,
   size: 11,
   levelSwitching:false,
   timer:20,


   goToNextLevel:function(){
      if (this.levelNum > 2){//default: 3 levels in total
         //game ends, show ending page
         //clearScene(true);
         this.resetGame();
         endGameDisplay(true);
      }
      else{// go to next level
         //this.levelSwitching = false;
         this.levelNum += 1;
         this.size += 4;
         this.timer += 10;
         size = this.size;
         if (this.levelNum == 2) {
           fall();
         }
         else if (this.levelNum == 3) {
           winter();
         }

         resetLevel();
      }
   },
   resetGame:function(){
      this.levelNum = 1;
      this.size = 11;
      this.levelSwitching = false;
      this.timer = 20;
   }
}
