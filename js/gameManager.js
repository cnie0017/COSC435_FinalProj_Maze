//An object to stores the information of the current game

var game = { //default
   levelNum:1,
   //level:new Level(this.levelNum),
   size: 11,
   paused: false,
   started: false,
   levelSwitching:false,
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
      // if (this.level > 2){//default: 3 levels in total
      //    //game ends, show ending page
      // }
      // else{
      //    //this.targetLevel = n
      // }
      // this.levelSwitch = false;
      // this.level = new Level(n);
      console.log("IN GOTO");
      this.levelSwitching = true;
      this.levelNum += 1;
      this.size += 4;
      size = this.size;
      //var selectedObject = scene.getObjectByName("tree");
      scene.remove(rotationPoint);
      rotationPoint = new THREE.Object3D();
      rotationPoint.position.set( 0, 0, 0 );
      scene.add( rotationPoint );
      scene.remove(maze);
      resetLevel();
   }
}

   // exitLoc = (-300+exitZidx*distance, -300+exitXidx*distance)
   // if (deer collide with exitLoc){
      //game.levelSwitch = true;
   //}
