//An object to stores the information of the current game

var game = { //default

   level:new Level(1),
   paused: false,
   started: false,
   levelSwitch:false,
   //targetLevel:0,
   timeleft:100,

   update: function(){
      document.getElementById("timeleft").innerHTML = ("Timer " + this.timeleft);
   },

   pause:function(){
      this.paused = !this.paused;
      if(this.paused){
         document.getElementById("pause").innerHTML = ("PAUSED");
      }else{
         document.getElementById("pause").innerHTML = ("");
      }
   },

   goToLevel:function(n){
      if (this.level > 2){//default: 3 levels in total
         //game ends, show ending page
      }
      else{
         //this.targetLevel = n
      }
      this.levelSwitch = false;
      this.level = new Level(n);
   }
}   

   // exitLoc = (-300+exitZidx*distance, -300+exitXidx*distance)
   // if (deer collide with exitLoc){
      //game.levelSwitch = true;
   //}
