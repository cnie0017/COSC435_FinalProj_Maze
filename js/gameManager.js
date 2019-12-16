//An object to stores the information of the current game

var game = { //default
   levelNum:1,
   size: 11,
   paused: false,
   started: false,
   levelSwitching:false,
   timer:40,


   goToNextLevel:function(){
      console.log(this.levelNum);
      if (this.levelNum > 2){//default: 3 levels in total
         //game ends, show ending page
         console.log("END");
         clearScene(true);
         clearTable();
         hideTimer();
         endGameDisplay();
      }
      else{// go to next level
         this.levelSwitching = false;
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

   }
}
