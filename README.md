# COSC435_FinalProj_Maze

make sure to include:
List of references updated: all the sources you used, working URL, with indication for which objective numbers you use the code from the tutorial, github source
Post-implementation objectives list (keep the one we agreed on) but have another
one if needed to highlight and explain another technique you used to solve the objective differently. Make clear how your initial choice fell short and why your alternate initiative
may be satisfactory
Also indicate
which browser to use to run your project
which keys activate which features, mouse motion activates object, camera, hits and so on
where to download your entire code
It is your responsibility to not change the git after the deadline for a couple of week. (Use another branch)

**OUR GAME: Colgate Darwin Thinking Path Maze**
* Code can be downloaded at https://github.com/zhua0017/COSC435_FinalProj_Maze
* Chrome browser on a localhost was predominantly used to run this project
* Keys to activate features:
  * up / down / left / right arrows move character accordingly, as well as the camera


**TECHNICAL COMPONENTS**

*Mary*
* Power-Up Implementation
  * Power-up models from the `models.js` file are randomly placed on the map
    * In order to do this, I used the `maze` variable, which is an array of arrays representing the maze with indices as x and z values. If a particular x and z value of the array is marked `true`, this indicates that an item has been placed there.
    * When the deer was created, I marked this as `true` so that a power-up would not spawn at the same point as the hero.
    * To place a power-up, a random x and z value between 0 and the size of the map are chosen; if the maze array at those indices is marked `false` the power-up is placed, and that position is changed to `true`. If that position was already `true`, another random x and z value are chosen until a valid position is chosen.
  * Each power-up has a different effect on the character
    * Collision detection differentiates between a bush (hero cannot walk through this) and power-ups (which will not stop the hero from forward movement)
    * Each power-up uses a different collision type, and when this type is detected in the collisions it removes the collision box for that power-up and calls a function in the main game file which removes the power-up from the play area and implements the corresponding effect
    * Effects are reversed using setTimeout to return the character back to its original settings after a set number of milliseconds
      * Coffee: speeds up the player; playerSpeed (which controls how far the player moves at a time) is incremented temporarily
      * Clock: pauses the timer; this uses the timer from the `myTimer.js` file and pauses it with a built-in function from `easytimer.js`
      * Goose: player is stunned; sets a `stunned` boolean value to `true`, which flags the keys not to allow character movement
      * Beer: motion keys are reversed; sets a `reverse` boolean value to `true`, which flags the keys to move in the opposite direction
        * I created a `keys` object which contains functions for `right`, `left`, `down`, and `up`; when movement is updated, the opposite function is called to move the player (i.e. key up would trigger the `down` function)
      * Student: returns the player back to the start of the maze; this resets the character's position to its start position, and resets the camera to its original position
* Particle Effects
  * Our project requires particle effects in the form of snow and falling leaves; in order to accomplish this, I found a three.js particle engine online under stemkoski's GitHub page
    * I took these effects and adapted them to what we had envisioned for the project (snow was already implemented, but leaves were not); this involved changing values such as particle acceleration, velocity, position, color, and size.
    * However, this version of particle effects was not compatible with the latest version of three.js
  * squarefeet on GitHub had a later version of a particle engine; I borrowed the `initParticles()` function from its `activeMultiplier.html` code and adapted this such that the values corresponded to the values that I had assigned in the previous particle engine, but on a larger scale for our game.

**POST-IMPLEMENTATION OBJECTIVES LIST**
*

**REFERENCES/CREDITS**
* Online sources:
  * General three.js help (most heavily used source): https://threejs.org/docs/
  * Particle Effects:
    * https://github.com/squarefeet/ShaderParticleEngine
    * https://stemkoski.github.io/Three.js/Particle-Engine.html
  * Power-Up Implementation (delay settings back to normal): https://www.w3schools.com/jsref/met_win_settimeout.asp
* Fellow classmates:
  * Leo Ascenzi (help with camera)
