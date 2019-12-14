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
// Track all objects and collisions.
var objects = [];

// Track click intersects.
// Set mouse and raycaster.
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

// Store movements.
var movements = [];
var playerSpeed = 15;
var bbox;
var helper;
//maze generation

// var size = 13;
var size = game.level.maze.size;
var maze, mazeMesh;
var distance = 100,
   entranceXidx = 1,
   entranceZidx = size-1;
   exitXidx = size-2, //fixed exit
   exitZidx = 0,
   entranceX = -300+(size-1)*100,
   entranceZ = -200;

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
var green = 0x44aa44;
var yellow = 0xead516;
var blue = 0x2194ce;

/**
 * Run initial setup function and loop through rendering.
 */
init();
animate();




function createScene(){
  // Build the container
  // container = document.createElement( 'div' );
  container = document.getElementById('world');

  // Create the scene.
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xccddff );
  scene.fog = new THREE.Fog( 0xccddff, 3000, 5000 );

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

  // Move the camera away from the center of the scene.
  camera.position.z = -600;
  camera.position.y = 500;
  camera.position.x = 400;
  // camera.rotation.x = radians(45);
  // console.log(camera.rotation.x);
  // scene.add( camera );



  createCharacter();
  createFloor();
  createMaze();
  placePowerUps();

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
  // controls.autoRotate = true;
  controls.maxDistance = 1000; // Set our max zoom out distance (mouse scroll)
  controls.minDistance = 60; // Set our min zoom in distance (mouse scroll)
  // controls.target.copy( new THREE.Vector3( 0, 0, 0 ) );
  controls.target.copy( box.threegroup.position );
  controls.update();

  document.onkeydown = handleKeyDown;

  // var axis = new THREE.AxesHelper(3000);
  // scene.add(axis);
}

function createLights(){
  // Ambient lights.
  var ambient = new THREE.AmbientLight( 0xffffff );
  scene.add( ambient );

  // var directional = new THREE.DirectionalLight('rgb(255,255,255)', 1);
  // directional.position.set(5, 3, 7);
  // directional.lookAt(scene.position);
  // scene.add( directional );

  // Add hemisphere lighting.
  var hemisphereLight = new THREE.HemisphereLight( 0xdddddd, 0x000000, 0.5 );
  scene.add( hemisphereLight );
}


/**
 * Initializer function.
 */
function init() {
  createScene();
  createLights();
  setTimer(40);
  // initParticles();
}

var keys = {
  right: function(){
    camera.position.x - playerSpeed;
    movements.push(new THREE.Vector3(box.threegroup.position.x - playerSpeed, box.threegroup.position.y, box.threegroup.position.z));
    box.threegroup.rotation.y = radians(180);
    controls.target.copy(box.threegroup.position);
    controls.update();
  },
  left: function(){
    movements.push(new THREE.Vector3(box.threegroup.position.x + playerSpeed, box.threegroup.position.y, box.threegroup.position.z));
    box.threegroup.rotation.y = radians(0);
    controls.target.copy(box.threegroup.position);
    controls.update();
  },
  down: function(){
    movements.push(new THREE.Vector3(box.threegroup.position.x, box.threegroup.position.y, box.threegroup.position.z - playerSpeed));
    box.threegroup.rotation.y = radians(90);
    controls.target.copy(box.threegroup.position);
    controls.update();
  },
  up: function(){
    movements.push(new THREE.Vector3(box.threegroup.position.x, box.threegroup.position.y, box.threegroup.position.z  + playerSpeed));
    box.threegroup.rotation.y = radians(270);
    controls.target.copy(box.threegroup.position);
    controls.update();
  }
}


function handleKeyDown(keyEvent){
//https://javascript.info/keyboard-events


  if (keyEvent.key == "ArrowRight") {
    if (!reverse & !stunned){ keys.right.call(); }
    else if (reverse){ keys.left.call(); }
  }
  else if (keyEvent.key == "ArrowLeft") {
    if (!reverse & !stunned){ keys.left.call(); }
    else if (reverse){ keys.right.call(); }
  }

  if (keyEvent.key == "ArrowDown") {
    if (!reverse & !stunned){ keys.down.call(); }
    else if (reverse){ keys.up.call(); }
  }
  else if (keyEvent.key == "ArrowUp") {
    if (!reverse & !stunned){ keys.up.call(); }
    else if (reverse){ keys.down.call(); }
  }

}

// function listenForPlayerMovement() {
//
//     // A key has been pressed
//     var onKeyDown = function(event) {
//
//     switch (event.keyCode) {
//
//       case 38: // up
//       case 87: // w
//         moveForward = true;
//         break;
//
//       case 37: // left
//       case 65: // a
//         moveLeft = true;
//         break;
//
//       case 40: // down
//       case 83: // s
//         moveBackward = true;
//         break;
//
//       case 39: // right
//       case 68: // d
//         moveRight = true;
//         break;
//     }
//   };

//   // A key has been released
//     var onKeyUp = function(event) {
//
//     switch (event.keyCode) {
//
//       case 38: // up
//       case 87: // w
//         moveForward = false;
//         break;
//
//       case 37: // left
//       case 65: // a
//         moveLeft = false;
//         break;
//
//       case 40: // down
//       case 83: // s
//         moveBackward = false;
//         break;
//
//       case 39: // right
//       case 68: // d
//         moveRight = false;
//         break;
//     }
//   };
//
//   // Add event listeners for when movement keys are pressed and released
//   document.addEventListener('keydown', onKeyDown, false);
//   document.addEventListener('keyup', onKeyUp, false);
// }

/**
 * Event that fires upon mouse down.
 */
// function onDocumentMouseDown( event, bypass = false ) {
//   event.preventDefault();
//
//   // Detect which mouse button was clicked.
//   if ( event.which == 3 ) {
//     stopMovement();
//     // Grab the coordinates.
//     mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
//     mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
//
//     // Use the raycaster to detect intersections.
//     raycaster.setFromCamera( mouse, camera );
//
//     // Grab all objects that can be intersected.
//     var intersects = raycaster.intersectObjects( objects );
//     if ( intersects.length > 0 ) {
//       movements.push(intersects[ 0 ].point);
//     }
//   }
// }

/**
 * Stop character movement.
 */
function stopMovement() {
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
  if(game.levelSwitch){
    game.goToLevel(game.targetLevel);

  }
 camera.updateProjectionMatrix();
}

/**
 * Render the scene.
 */
function render() {
  renderer.render( scene, camera );
  // console.log(particleGroup);

  // If any movement was added, run it!
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
  // box.updateMatrixWorld( true );
  // bbox.copy( box.geometry.boundingBox ).applyMatrix4( box.matrixWorld)
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
  // controls.getObject().translateX(playerVelocity.x * delta);
  // controls.getObject().translateZ(playerVelocity.z * delta);
  controls.object.translateX(playerVelocity.x * delta);
  controls.object.translateZ(playerVelocity.z * delta);
}

function CreateMazeMesh(maze) {
	 console.log("size is",size);
    //to be changed later
	 // var randExitZidx = Math.floor(Math.random()*size);
	 for (var i = 0; i < maze.size; i++) {
		  for (var j = 0; j < maze.size; j++) {
			  var mazeObj = maze[i][j];
				if (mazeObj) {
           if (i == entranceXidx && j==entranceZidx){//entrance
              createTree(entranceX,entranceZ,blue);
              maze[i][j-1] = true;
           }
           else if (i == exitXidx && j == exitZidx){//exit
             //exit location = (-300+exitZidx*distance, -300+exitXidx*distance)
             createTree(-300+j*distance, -300+i*distance, yellow, "exit");
           }
           else{
             createTree(-300+j*distance,-300+i*distance,green);
           }
        }
      }
    }
}


function createMaze() {
  maze = game.level.maze;
  mazeMesh = CreateMazeMesh(maze);
}

// var pclock, coffee, goose, can, student;
// TODO: modify so that iterations of powerups can be placed
// perhaps create an array or dictionary of the powerups and pass in index to calculateCollisionPoints


function placePowerUps(iterations=1){
  // POWER UPS
  for (let i = 0; i < iterations; i++){
    //clock
    let pclock = new Clock();
    pclock.threegroup.scale.set(0.35,0.35,0.35);
    pclock.threegroup.position.y = 40;
    powerUps.push(pclock);
    placePowerUp(pclock, "clock");

    //coffee
    let coffee = new Coffee();
    coffee.threegroup.scale.set(0.4,0.4,0.4);
    coffee.threegroup.position.y = 10;
    powerUps.push(coffee);
    placePowerUp(coffee, "coffee");

    // POWER DOWNS

    //goose
    let goose = new Goose();
    goose.threegroup.scale.set(0.3,0.3,0.3);
    goose.threegroup.position.y = 10;
    powerUps.push(goose);
    placePowerUp(goose, "goose");

    //can
    let can = new Can();
    can.threegroup.scale.set(0.4,0.4,0.4);
    can.threegroup.position.y = 10;
    powerUps.push(can);
    placePowerUp(can, "can");

    //student
    let student = new Student();
    student.threegroup.scale.set(0.3,0.3,0.3);
    powerUps.push(student);
    placePowerUp(student, "student");
  }
}

function placePowerUp(powerup, type){
  let placed = false;
  while (!placed){
    let r1 = Math.floor(Math.random() * size);
    let r2 = Math.floor(Math.random() * size);


    if (!maze[r1][r2]){
      // console.log(maze[r1][r2]);
      // console.log(r1,r2);
      powerup.threegroup.position.x = -300+r2*distance;
      powerup.threegroup.position.z = -300+r1*distance;

      maze[r1][r2] = true;

      rotationPoint.add( powerup.threegroup );
      placed = true;
    }
  }
  calculateCollisionPoints(powerup.threegroup, powerup.threegroup.scale, type, powerup);
}

// TODO: object pool or dispose of objects rather than changing position

var stunned, reverse;
// powerup actions
function clockPower(obj){
  // give extra time
  obj.threegroup.position.set(0,-1000,0);
  timer.pause();
  setTimeout(function(){ timer.start(); }, 5000);
}

function coffeePower(obj){
  // increase character speed
  obj.threegroup.position.set(0,-1000,0);
  playerSpeed += 10;
  setTimeout(function(){ playerSpeed -=10; }, 5000);
}

// powerdown actions
function goosePower(obj){
  // stun character
  obj.threegroup.position.set(0,-1000,0);
  stunned = true;
  controls.enablePan = false;
  setTimeout(function(){ stunned = false; controls.enablePan = true; }, 5000);
}

function canPower(obj){
  // reverse keys temporarily
  obj.threegroup.position.set(0,-1000,0);
  reverse = true;
  // controls.keys = {
  //     LEFT: 39, //right arrow
  //     UP: 40, // down arrow
  //     RIGHT: 37, // left arrow
  //     BOTTOM: 38 // up arrow
  // };
  setTimeout(function(){ reverse = false;
  //     controls.keys = {
  //     LEFT: 37, //left arrow
  //     UP: 38, // up arrow
  //     RIGHT: 39, // right arrow
  //     BOTTOM: 40 // down arrow
  // };
  }, 5000);
}

function studentPower(obj){
  // randomly relocate character OR send back to start
  obj.threegroup.position.set(0,-1000,0);
  box.threegroup.position.y = characterSize * 2.5; //TODO: feet are sticking through floor
  box.threegroup.position.x = entranceX-100;
  box.threegroup.position.z = entranceZ - characterSize/2;

  controls.target.copy( box.threegroup.position );
  controls.update();
}



/**
 * Create the main character.
 */
function createCharacter() {
  box = new Deer();
  box.threegroup.scale.x = characterSize;
  box.threegroup.scale.y = characterSize;
  box.threegroup.scale.z = characterSize;
  // box = new THREE.Mesh( geometry, material );
  //box is always placed right next to entrance
  box.threegroup.position.y = characterSize * 2.5; //TODO: feet are sticking through floor
  box.threegroup.position.x = entranceX-100;
  box.threegroup.position.z = entranceZ - characterSize/2;

  rotationPoint.add( box.threegroup );
  // box.threegroup.add( camera );
  // rotationPoint.add(camera);
}

/**
 * Create the floor of the scene.
 */
function createFloor() {
  var geometry = new THREE.PlaneBufferGeometry( 100000, 100000 );
  var material = new THREE.MeshToonMaterial( {color: 0x336633} );
  var plane = new THREE.Mesh( geometry, material );
  plane.rotation.x = -1 * Math.PI/2;
  plane.position.y = 0;
  scene.add( plane );
  objects.push( plane );
}


/**
 * Create a happy little tree.
 */
function createTree( posX, posZ, treeColor, type = "tree" ) {
  // Set some random values so our trees look different.
  // var randomScale = ( Math.random() * 3 ) + 0.8;
  var randomScale = 1; //I don't want the scale to be random right now
  var randomRotateY = Math.PI/( Math.floor(( Math.random() * 32) + 1 ));

  // Create the tree top.
  var geometry = new THREE.DodecahedronGeometry( treeSize );
  var material = new THREE.MeshPhongMaterial({ color: treeColor });
  var treeTop = new THREE.Mesh( geometry, material );

  treeTop.position.set(posX, characterSize/2, posZ);
  treeTop.scale.x = treeTop.scale.y = treeTop.scale.z = randomScale;
  treeTop.rotation.y = randomRotateY;
  scene.add( treeTop );


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

// var shapeColor = gui.addColor( parameters, 'color' ).name('Color (Diffuse)').listen();
var collisionsDetected = gui.add(parameters, 'collisions').name('Collisions Enabled').listen();
var toggleControls = gui.add(parameters, 'controls').name('OrbitControls Enabled').listen();
// shapeColor.onChange(function(value) // onFinishChange
// {   box.material.color.setHex( value.replace("#", "0x") );   });
var snow = gui.add(parameters, 'snow').name('Snow Enabled').listen();
var leaves = gui.add(parameters, 'leaves').name('Leaves Enabled').listen();

collisionsDetected.onChange(function(value)
{   enableCollisions = !enableCollisions; });

snow.onChange(function(value)
{
  snowEnabled = !snowEnabled;
  console.log(snowEnabled);
  initParticles('snow');
 });

leaves.onChange(function(value)
{
  leavesEnabled = !leavesEnabled;
  console.log(leavesEnabled);
  initParticles('leaves');
})


// TODO: add particle effects
//
// toggleControls.onChange(function(value)
// {   toggleControls = !toggleControls; });
