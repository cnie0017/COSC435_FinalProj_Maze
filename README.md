# COSC435_FinalProj_Maze

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

*Bec*
* Collisions
  * Using the tutorial at http://www.bryanjones.us/article/basic-threejs-game-tutorial-part-5-collision-detection as a guide, I implemented collisions between the deer, the trees, and the powerups. For each obect other than the deer, its x and z bounds are encapsulated in an object which is pushed to a collisions array. Each time render is called, the deer's bounds are compared to each object in the collisions array. These objects also have a type: they are either a tree or a powerup. Based on which type an object is, if a deer collides with it, it is either pushed back to stay in bounds, or calls a powerup function.
* User Interface (UI)
  * I added both a timer and a maze to the UI. The timer uses EasyTimer.js to count down from a given time. The maze is an HTML table based off of Alex's maze. Each cell is filled with a different color based on whether or not there is a tree at that location. I also implemented color changes between levels to give the user an aesthetically pleasing experience.

*Noah*
* Modelling
  * Using various mesh and buffer geometries, I was able to create a goose, clock, coffee, and can, to serve as power ups and obstacles in our maze.
   * By using mesh and buffer geometries, the performance of our game has improved as the data for the models is held in buffers, reducing the cost of passing the data to the GPU.
  * Models had to be created with animations in mind, using proper positioning and Three groups for smooth, fluid animations later.
  * Models were made using the clone.() function as well for efficiency
* Animations
  * Created animations for the deer, goose, students, and powerups. I made walk animations for the deer, goose, and student, spin animations for the powerups, as well as animations for when the deer is stunned or drunk, and for when the player wins and loses.
  * All animation functions were created in cycles to be called in the loop to animate indefinitely.
  * Walking functions were created using rotations and trigonometric functions to allow geometries to rotate back and forth.
    * Each walking animation is unique but using the same speed through the globalspeedrate variable.
  * Spin functions for the powerups used Vector3 variables to allow the powerups to rotate on an axis.
  * Deer powerup functions created either stars above the Deer’s head which span in a circle, or bubbles above the Deer, which shrank and popped.
    * The models for these animations (the stars and bubbles) are part of the deer model, but are transparent. When interacting with a powerup, these the opacity of these models are changed and the animation for each (spinning for the stars and rotating and decrease in scale for the bubbles) are called, thus allowing for animations when interacting with powerups.
    
*Alex*   
* Maze Generation
  * Using Hunt-and-Kill algorithm to produce codes that can randomly generate a maze. Also considered various other algorithms such as Prim's algorithm and Kruskal's algorithm, which generate maze with many short cul-de-sacs. For the difficulty of this game, adopted the Hunt-and-Kill algorithm, which is easier to implement, and creates mazes that are suitable for our design intention.
  * Given a size, the algorithm generates a 2D array that contains boolean values indicating whether a tree or a blank should be placed within a maze. The trees compose the maze, and the blanks are the paths that the characters can be placed on. Using this 2D array, Meshes of a treetop model are created and placed at corresponding locations in the scene. The exit and entrance of the maze are fixed at the bottom left and top right, respectively, due to the way that the maze is being generated.
* Code Design and objects
  * Created a variable game in gameManager that stores the information of the game at different stages. It contains fields like levelNum, which shows the level of difficulty of this current game, ranging from 1-3, mazesize and levelswitching, which represents whether to switch to a new level.
* Level switching
  * The game has 3 levels in total, each with different difficulty level, by changing the size and number of powerups in the maze. A new levels is being triggered by the main character colliding with the exit tree. 
  * Upon collision, the levelswitching field of the game object is being set to true, then a function called goToNextLevel is being called to clear the current objects in the scene, create new objects and update the game information.
  * Instead of using Buffer.Geometry and dispose(), I simply used scene.remove to remove the objects from the scene. Considering the size and complexity of this game, it is acceptable to use this method without worrying too much about memory usage issue.
* CSS and Showing instrcutions
  * When game ends, show texts to indicate whether the player wins or not. Give credit to the authors and ask if the player wants to play again. If yes, reset the game to start from level 1.  

  
    
    

**POST-IMPLEMENTATION OBJECTIVES LIST**
* Power-Ups
  * Clock power-up was changed to pause the timer rather than add time to it, as this made much more sense with the use of the `easytimer.js` library and its built-in `pause()` function.
  * Student enemy was changed to return player to the entrance of the map rather than randomly relocate, as we intended this to be an enemy and a random relocation may have helped the player get closer to the exit.
* GUI Controls
  * GUI controls to toggle particle effects, collisions, and OrbitControls were useful to us during the development and testing phase, but we decided not to include these in our final project.
  * Particle effects are part of the difficulty of the level, so we wanted to keep these on.
  * The GUI also cluttered the screen due to the presence of the map and timer.

**REFERENCES/CREDITS**
* Online sources:
  * General three.js help (most heavily used source): https://threejs.org/docs/
  * Particle Effects - *(objective 4)*
    * https://github.com/squarefeet/ShaderParticleEngine
    * https://stemkoski.github.io/Three.js/Particle-Engine.html
  * Power-Up Implementation - *(objective 6)*
    * https://www.w3schools.com/jsref/met_win_settimeout.asp (delay settings back to normal)
  * Collisions - *(objective 5)*
    * http://www.bryanjones.us/article/basic-threejs-game-tutorial-part-5-collision-detection
  * Timer - *(objective 6)*
    * https://albert-gonzalez.github.io/easytimer.js/
  * Animating a simple hero - *(objective 7)*
    * https://codepen.io/Yakudoo/#
  * Maze generation algorithms
    * https://weblog.jamisbuck.org/2011/1/10/maze-generation  

* Fellow classmates:
  * Leo Ascenzi (help with camera)
