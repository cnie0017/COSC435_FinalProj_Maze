
/**
 * @file
 * The main scene.
 */

/**
 * Set our global variables.
 */
var camera, // We need a camera
    scene, // The camera has to see something.
    renderer, // Render our graphics.
    controls, // Our Orbit Controller for camera magic.
    container, // Our HTML container for the program.
    rotationPoint;  // The point in which our camera will rotate around.
var characterSize = 25;
var treeSize = 50;
var outlineSize = characterSize * 0.05;
var light1, light2,light3;

var heldKeys = {right: false, up: false, down: false, left: false};

// Track click intersects.
// Set mouse and raycaster.
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

// Store movements.
var movements = [];
var visited;
// var playerSpeed = 15;
var playerSpeed = 7;

var bbox;
var helper;
//maze generation


var size = game.size;
var maze, mazeMesh;
var distance = 100,
    entranceZidx = 0,
    entranceX = 100,
    entranceZ = 0;

 var moveForward = false;
 var moveBackward = false;
 var moveLeft = false;
 var moveRight = false;

 // Velocity vector for the player
 var playerVelocity = new THREE.Vector3();

 // How fast the player will move
 var PLAYERSPEED = 800.0;

 var clock;

 // particle effects
 var particleGroup, emitter;
 var snowEnabled = false;
 var leavesEnabled = false;

 var powerUps = [];

//tree
var treeColor = 0x00471e;
var floorColor = 0x0b6011;
var yellow = 0xead516;
var blue = 0x2194ce;

/**
 * Run initial setup function and loop through rendering.
 */
init();
animate();


function resetCamera(){
  // reset camera to player position
  controls.target.copy( box.threegroup.position );
  camera.position.z = entranceZ-400;
  camera.position.y = 500;
  camera.position.x = entranceX-100;
  controls.update();
}

function createScene(){
  // Build the container
  // container = document.createElement( 'div' );
  container = document.getElementById('world');

  // Create the scene.
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xe1f9ff );
  scene.fog = new THREE.Fog( 0xe1f9ff , 3000, 5000 );

  // Create a rotation point.
  rotationPoint = new THREE.Object3D();
  rotationPoint.position.set( 0, 0, 0 );
  scene.add( rotationPoint );


  enableCollisions = true;

  // Create the camera.
  camera = new THREE.PerspectiveCamera(
     50, // Angle
     window.innerWidth / window.innerHeight, // Aspect Ratio.
     1, // Near view.
     20000 // Far view.
  );

  createCharacter();
  createFloor();
  createMaze(size);
  drawTable(size);
  placePowerUps();

  // Move the camera away from the center of the scene.
  camera.position.z = entranceZ-400;
  camera.position.y = 500;
  camera.position.x = entranceX-100;

  visited = maze.slice();

  // Flags to determine which direction the player is moving
  clock = new THREE.Clock();
  // listenForPlayerMovement();

  // Build the renderer
  renderer = new THREE.WebGLRenderer( { antialias: true } );

  var element = renderer.domElement;
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( element );

  // Build the controls.
  controls = new THREE.OrbitControls( camera, element );
  controls.enablePan = false;
  controls.screenSpacePanning = false;
  controls.enableZoom = false;
  controls.maxDistance = 1000; // Set our max zoom out distance (mouse scroll)
  controls.minDistance = 60; // Set our min zoom in distance (mouse scroll)
  controls.target.copy( box.threegroup.position );
  controls.update();

  document.onkeydown = handleKeyDown;
  document.onkeyup = handleKeyUp;

}

function createLights(){
  // Ambient lights.
  light1 = new THREE.AmbientLight( 0xffffff );
  scene.add( light1 );
  // light1.intensity = .1;


  // var directional = new THREE.DirectionalLight('rgb(255,255,255)', 1);
  // directional.position.set(5, 3, 7);
  // directional.lookAt(scene.position);
  // scene.add( directional );

  //Add hemisphere lighting.
  light2 = new THREE.HemisphereLight( 0xdddddd, 0x000000, 0.5 );
  scene.add( light2 );
  // light3 = new THREE.PointLight(0xffffff, .7);
  // light3.intensity = 1;
  // light3.position.set(0,15,20);
  // scene.add(light3);
}

function hideTexts(){
  document.getElementById("win").style.display = "none";
  document.getElementById("author").style.display = "none";
  document.getElementById("info").style.display = "none";
  document.getElementById("replay").style.display = "none";
}

function fall() {
  treeColor = 0xdb932a;
  floorColor = 0x847417;
  leavesEnabled = true;
  initParticles('leaves');
}

function winter() {
  treeColor = 0xa4ddea;
  floorColor = 0x71d1d1;
  leavesEnabled = false;
  initParticles('snow');
  snowEnabled = true;
}


/**
 * Initializer function.
 */
function init() {
  document.getElementById("level").innerHTML = "Level: "+game.levelNum;
  hideTexts();
  createScene();
  createLights();
  setTimer(game.timer);
}

var keys = {
  right: function(){
    camera.position.x - playerSpeed;
    box.threegroup.position.x -= playerSpeed;
    box.threegroup.rotation.y = radians(180);
    controls.target.copy(box.threegroup.position);
    if (!stopped){ camera.position.x -= playerSpeed; }
    controls.update();
  },
  left: function(){
    box.threegroup.position.x += playerSpeed;
    box.threegroup.rotation.y = radians(0);
    controls.target.copy(box.threegroup.position);
    if (!stopped){ camera.position.x += playerSpeed; }
    controls.update();
  },
  down: function(){
    box.threegroup.position.z -= playerSpeed;
    box.threegroup.rotation.y = radians(90);
    controls.target.copy(box.threegroup.position);
    if (!stopped){ camera.position.z -= playerSpeed; }
    controls.update();
  },
  up: function(){
    box.threegroup.position.z  += playerSpeed;
    box.threegroup.rotation.y = radians(270);
    controls.target.copy(box.threegroup.position);
    if (!stopped){ camera.position.z += playerSpeed; }
    controls.update();
  }
}


function handleKeyDown(keyEvent){
//https://javascript.info/keyboard-events
if (keyEvent.key == "ArrowRight") {
  heldKeys.right = true;
}
else if (keyEvent.key == "ArrowLeft") {
  heldKeys.left = true;
}

if (keyEvent.key == "ArrowDown") {
  heldKeys.down = true;
}
else if (keyEvent.key == "ArrowUp") {
  heldKeys.up = true;
}


}

//now it just notifies which keys are held
function handleKeyUp(keyEvent){
//https://javascript.info/keyboard-events

  if (keyEvent.key == "ArrowRight") {
    heldKeys.right = false;
  }
  else if (keyEvent.key == "ArrowLeft") {
    heldKeys.left = false;
  }

  if (keyEvent.key == "ArrowDown") {
    heldKeys.down = false;
  }
  else if (keyEvent.key == "ArrowUp") {
    heldKeys.up = false;
  }

}

//This checks each update frame what is held, allows for smooth starts
//javascript just keydown and then move has a short lag.
function updateMovement(){
  if(heldKeys.right){
    if (!reverse & !stunned){ keys.right.call(); }
    else if (reverse){ keys.left.call(); }
  }
  if(heldKeys.left){
    if (!reverse & !stunned){ keys.left.call(); }
    else if (reverse){ keys.right.call(); }
  }
  if(heldKeys.up){
    if (!reverse & !stunned){ keys.up.call(); }
    else if (reverse){ keys.down.call(); }
  }
  if(heldKeys.down){
    if (!reverse & !stunned){ keys.down.call(); }
    else if (reverse){ keys.up.call(); }
  }
}

/**
 * Stop character movement.
 */
function stopMovement() {
  // stopped = true;
  movements = [];
}

function move( location, destination, speed = playerSpeed ) {
    var moveDistance = speed;

    // Translate over to the position.
    var posX = location.threegroup.position.x;
    var posZ = location.threegroup.position.z;
    var newPosX = destination.x;
    var newPosZ = destination.z;

    // Set a multiplier just in case we need negative values.
    var multiplierX = 1;
    var multiplierZ = 1;

    // Detect the distance between the current pos and target.
    var diffX = Math.abs( posX - newPosX );
    var diffZ = Math.abs( posZ - newPosZ );
    var distance = Math.sqrt( diffX * diffX + diffZ * diffZ );

    // Use negative multipliers if necessary.
    if (posX > newPosX) {
      multiplierX = -1;
    }

    if (posZ > newPosZ) {
      multiplierZ = -1;
    }

    // Update the main threegroup.position.
    location.threegroup.position.x = location.threegroup.position.x + ( moveDistance * ( diffX / distance )) * multiplierX;
    location.threegroup.position.z = location.threegroup.position.z + ( moveDistance * ( diffZ / distance )) * multiplierZ;

    // If the threegroup.position is close we can call the movement complete.
    if (( Math.floor( location.threegroup.position.x ) <= Math.floor( newPosX ) + 1.5 &&
          Math.floor( location.threegroup.position.x ) >= Math.floor( newPosX ) - 1.5 ) &&
        ( Math.floor( location.threegroup.position.z ) <= Math.floor( newPosZ ) + 1.5 &&
          Math.floor( location.threegroup.position.z ) >= Math.floor( newPosZ ) - 1.5 )) {
      location.threegroup.position.x = Math.floor( location.threegroup.position.x );
      location.threegroup.position.z = Math.floor( location.threegroup.position.z );

      // Reset any movements.
      stopMovement();
      // Maybe move should return a boolean. True if completed, false if not.
    }
}

window.onresize = function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
};

function radians( degrees ) {
  return (degrees * Math.PI)/180;
}

/**
 * Updates to apply to the scene while running.
 */
function update() {
  // //update light3
  // light3.position.set(box.position);
  // if (game.levelSwitching){
  //   while (light3.intensity != 1){
  //     light3.intensity += 0.1;
  //     //light2.intensity += 0.1;
  //     // * (0.0 - light1.intensity);
  //   }
  // }

  updateMovement();
  camera.updateProjectionMatrix();
 // drawTable(size);
}

/**
 * Render the scene.
 */
function render() {
  renderer.render( scene, camera );
  // console.log(particleGroup);

  // If any movement was added, run it!

  if (camera.position.y < 10) {
    camera.position.y = 10;
  }

  if ( movements.length > 0 ) {
    move( box, movements[ 0 ] );
  }

  if ( collisions.length > 0 && enableCollisions) {
    detectCollisions(box);
  }

  if (particleGroup){
    if (snowEnabled || leavesEnabled){
      particleGroup.tick(clock.getDelta())
    }
  };

}

/**
 * Animate the scene.
 */
function animate() {
  // console.log(delta);
  render();
  update();
  requestAnimationFrame(animate);


  var delta = clock.getDelta();
  animatePlayer(delta);
  animateDeer(delta);
  animatePowerups(delta);
}

function animatePlayer(delta) {
  // Gradual slowdown
  playerVelocity.x -= playerVelocity.x * 10.0 * delta;
  playerVelocity.z -= playerVelocity.z * 10.0 * delta;

  if (moveForward) {
    playerVelocity.z -= PLAYERSPEED * delta;
  }
  if (moveBackward) {
    playerVelocity.z += PLAYERSPEED * delta;
  }
  if (moveLeft) {
    playerVelocity.x -= PLAYERSPEED * delta;
  }
  if (moveRight) {
    playerVelocity.x += PLAYERSPEED * delta;
  }
  if( !( moveForward || moveBackward || moveLeft ||moveRight)) {
    // No movement key being pressed. Stop movememnt
    playerVelocity.x = 0;
    playerVelocity.z = 0;
  }
  controls.object.translateX(playerVelocity.x * delta);
  controls.object.translateZ(playerVelocity.z * delta);
}
function animatePowerups(delta){
  goose.walk(delta);
  student.walk(delta);
  can.spin();
  pclock.spin();
  coffee.spin();
}
function animateDeer(delta){
  if(heldKeys.right){
    if (!stunned){ box.walk(delta); }
  }
  if(heldKeys.left){
    if (!stunned){ box.walk(delta); }
  }
  if(heldKeys.up){
    if (!reverse & !stunned){ box.walk(delta); }
  }
  if(heldKeys.down){
    if (!stunned){  box.walk(delta); }
  }
  if(stunned == true){
    box.status = "stunned";
    if(box.status == "stunned"){
      box.starMat.opacity = 1.0;
      box.stunned();
    }
  }
  else if(reverse == true){
    box.status = "drunk";
    if(box.status == "drunk"){
      box.bubbleMat.opacity = 1.0;
      box.drunk(delta);
    }
  }
  else{
    box.status == "normal";
    box.bubbleMat.opacity = 0.0;
    box.starMat.opacity = 0.0;
  }
}

function CreateMazeMesh(maze) {
	 for (var i = 0; i < maze.size; i++) {
		  for (var j = 0; j < maze.size; j++) {
			  var mazeObj = maze[i][j];
				if (mazeObj) {
           if (i == maze.size-2 && j==0){//entrance
              createTree(100,0,blue);
              maze[i][j-1] = true;
           }
           else if (i == 1 && j == maze.size-1){
             createTree(100-j*distance, -100+(maze.size-1-i)*distance, yellow, "exit");
           }
           else{
             createTree(100-j*distance,-100+(maze.size-1-i)*distance,treeColor);
           }
        }
      }
    }
}

function createMaze(n) {
  maze = generateMaze(n);
  //console.log(maze);
  mazeMesh = CreateMazeMesh(maze);
}

function placePowerUps(iterations=1){
  // POWER UPS
  for (let i = 0; i < iterations; i++){
    //clock
    pclock = new Clock();
    pclock.threegroup.scale.set(0.35,0.35,0.35);
    pclock.threegroup.position.y = 40;
    powerUps.push(pclock);
    placePowerUp(pclock, "clock");

    //coffee
    coffee = new Coffee();
    coffee.threegroup.scale.set(0.4,0.4,0.4);
    coffee.threegroup.position.y = 10;
    powerUps.push(coffee);
    placePowerUp(coffee, "coffee");

    // POWER DOWNS

    //goose
    goose = new Goose();
    goose.threegroup.scale.set(0.3,0.3,0.3);
    goose.threegroup.position.y = 10;
    powerUps.push(goose);
    placePowerUp(goose, "goose");

    //can
    can = new Can();
    can.threegroup.scale.set(0.4,0.4,0.4);
    can.threegroup.position.y = 10;
    powerUps.push(can);
    placePowerUp(can, "can");

    //student
    student = new Student();
    student.threegroup.scale.set(0.3,0.3,0.3);
    powerUps.push(student);
    placePowerUp(student, "student");
  }
}

function getDeerLocation() {
  var locX = box.threegroup.position.x;
  var locZ = box.threegroup.position.z;
  var row = Math.floor((locZ - entranceZ)/distance);
  var col = Math.floor((locX - entranceX)/distance);

  if (!visited[row][col]) {
    visited[row][col] = true;
  }
}

function placePowerUp(powerup, type){
  let placed = false;
  while (!placed){
    let r1 = Math.floor(Math.random() * size);
    let r2 = Math.floor(Math.random() * size);


    if (!maze[r1][r2]){
      powerup.threegroup.position.x = 100-r2*distance;
      powerup.threegroup.position.z = -100+(size-1-r1)*distance;

      maze[r1][r2] = true;

      rotationPoint.add( powerup.threegroup );
      placed = true;
    }
  }
  calculateCollisionPoints(powerup.threegroup, powerup.threegroup.scale, type, powerup);
}

var stunned, reverse;
// powerup actions
function clockPower(obj){
  // pause clock
  obj.threegroup.position.set(0,-1000,0);
  timer.pause();
  setTimeout(function(){ timer.start(); }, 5000);
}
var fast;
function coffeePower(obj){
  // increase character speed
  fast = true;
  obj.threegroup.position.set(0,-1000,0);
  playerSpeed += 10;
  setTimeout(function(){ playerSpeed -=10; }, 5000);
}

// powerdown actions
function goosePower(obj){
  // stun character
  obj.threegroup.position.set(0,-1000,0);
  stunned = true;
  setTimeout(function(){ stunned = false; }, 5000);
}

function canPower(obj){
  // reverse keys temporarily
  obj.threegroup.position.set(0,-1000,0);
  reverse = true;
  setTimeout(function(){ reverse = false; }, 5000);
}

function studentPower(obj){
  // randomly relocate character OR send back to start
  obj.threegroup.position.set(0,-1000,0);
  box.threegroup.position.y = characterSize * 2.5;
  box.threegroup.position.x = entranceX-100;
  box.threegroup.position.z = entranceZ - characterSize/2;

  resetCamera();
}



/**
 * Create the main character.
 */
function createCharacter() {
  box = new Deer();
  box.threegroup.scale.x = characterSize;
  box.threegroup.scale.y = characterSize;
  box.threegroup.scale.z = characterSize;
  //box is always placed right next to entrance
  box.threegroup.position.y = characterSize * 2.5;
  box.threegroup.position.x = 15;//entranceX-100;
  box.threegroup.position.z = 0;//entranceZ - characterSize/2;
  box.threegroup.rotation.y = radians(180);

  rotationPoint.add( box.threegroup );
}

/**
 * Create the floor of the scene.
 */
function createFloor() {
  var geometry = new THREE.PlaneBufferGeometry( 100000, 100000 );
  var material = new THREE.MeshToonMaterial( {color: floorColor} );
  var plane = new THREE.Mesh( geometry, material );
  plane.rotation.x = -1 * Math.PI/2;
  plane.position.y = 0;
  scene.add( plane );
  //objects.push( plane );
}


/**
 * Create a happy little tree.
 */
function createTree( posX, posZ, treeColor, type = "tree" ) {
  // Set some random values so our trees look different.
  var randomRotateY = Math.PI/( Math.floor(( Math.random() * 32) + 1 ));

  // Create the tree top.
  var geometry = new THREE.DodecahedronGeometry( treeSize );
  var material = new THREE.MeshPhongMaterial({ color: treeColor });
  var treeTop = new THREE.Mesh( geometry, material );

  treeTop.position.set(posX, characterSize/2, posZ);
  treeTop.scale.x = treeTop.scale.y = treeTop.scale.z = 1;
  treeTop.rotation.y = randomRotateY;
  rotationPoint.add( treeTop );
  //scene.add( treeTop );


  if (type == "tree") {
    calculateCollisionPoints( treeTop );
  }
  else if (type == "exit") {
    calculateCollisionPoints(treeTop, treeTop.scale, "exit" );
  }
}


gui = new dat.GUI();

parameters =
{
	x: 0, y: 30, z: 0,
	color:  "#7a6f50", // color (change "#" to "0x")
	colorA: "#000000", // color (change "#" to "0x")
	colorE: "#000033", // color (change "#" to "0x")
	colorS: "#ffff00", // color (change "#" to "0x")
			shininess: 30,
	opacity: 1,
	visible: true,
	material: "Phong",
  collisions: true,
  snow: false,
  leaves: false,
  controls: true,
	reset: function() { resetSphere() }
};

var collisionsDetected = gui.add(parameters, 'collisions').name('Collisions Enabled').listen();
var toggleControls = gui.add(parameters, 'controls').name('OrbitControls Enabled').listen();
var snow = gui.add(parameters, 'snow').name('Snow Enabled').listen();
var leaves = gui.add(parameters, 'leaves').name('Leaves Enabled').listen();

collisionsDetected.onChange(function(value)
{   enableCollisions = !enableCollisions; });

snow.onChange(function(value)
{
  snowEnabled = !snowEnabled;
  initParticles('snow');
 });

leaves.onChange(function(value)
{
  leavesEnabled = !leavesEnabled;
  initParticles('leaves');
})


/**------------------------------------Level Switch----------------------- */
function resetLevel(){
  setTimer(game.timer);
  resetRotationPoint();
  resetCollisions();

  //set new maze
<<<<<<< HEAD
  document.getElementById("level").innerHTML = "Level: "+game.levelNum;
=======
  clearTable();
  createFloor();
>>>>>>> edccc50a6210f84c71992d4e684a2e48ad2d1e4d
  createMaze(size);
  createCharacter();
  drawTable(size);
  placePowerUps();
  resetCamera();

  
  game.levelSwitching = false;
}

function resetCamera(){
  // reset camera to player position
  controls.target.copy( box.threegroup.position );
  camera.position.z = entranceZ-400;
  camera.position.y = 500;
  camera.position.x = entranceX-100;
  controls.update();

}

function resetRotationPoint(){
  clearScene(false);
  rotationPoint = new THREE.Object3D();
  rotationPoint.position.set( 0, 0, 0 );
  scene.add( rotationPoint );
}



function clearScene(endGame){
  if (endGame){
    while (scene.children.length != 0){
      scene.remove(scene.children[0]);
    }
  }
  scene.remove(rotationPoint);
}

function endGameDisplay(win){
  if (win){
    //show texts

    document.getElementById("win").style.display = "block";
    document.getElementById("author").style.display = "block";
    document.getElementById("info").style.display = "block";
    var replay = document.getElementById("replay");
    replay.style.display = "block";
    replay.onclick = function(){
      console.log("replay");
      hideTexts();
      resetLevel();
    }
    // if (replay.clicked == true){
    //   console.log("replay");
    //   return false;
    //   init();
    // }
  }
  else{
    //lose
    //youLost.style.display="block";   
  }
  //replayMessage.style.display="block";

}

// gui = new dat.GUI();
//
// parameters =
// {
// 	x: 0, y: 30, z: 0,
// 	color:  "#7a6f50", // color (change "#" to "0x")
// 	colorA: "#000000", // color (change "#" to "0x")
// 	colorE: "#000033", // color (change "#" to "0x")
// 	colorS: "#ffff00", // color (change "#" to "0x")
// 			shininess: 30,
// 	opacity: 1,
// 	visible: true,
// 	material: "Phong",
//   collisions: true,
//   snow: false,
//   leaves: false,
//   controls: true,
// 	reset: function() { resetSphere() }
// };
//
// // var shapeColor = gui.addColor( parameters, 'color' ).name('Color (Diffuse)').listen();
// var collisionsDetected = gui.add(parameters, 'collisions').name('Collisions Enabled').listen();
// var toggleControls = gui.add(parameters, 'controls').name('OrbitControls Enabled').listen();
// // shapeColor.onChange(function(value) // onFinishChange
// // {   box.material.color.setHex( value.replace("#", "0x") );   });
// var snow = gui.add(parameters, 'snow').name('Snow Enabled').listen();
// var leaves = gui.add(parameters, 'leaves').name('Leaves Enabled').listen();
//
// collisionsDetected.onChange(function(value)
// {   enableCollisions = !enableCollisions; });
//
// snow.onChange(function(value)
// {
//   snowEnabled = !snowEnabled;
//   console.log(snowEnabled);
//   initParticles('snow');
//  });
//
// leaves.onChange(function(value)
// {
//   leavesEnabled = !leavesEnabled;
//   console.log(leavesEnabled);
//   initParticles('leaves');
// })
