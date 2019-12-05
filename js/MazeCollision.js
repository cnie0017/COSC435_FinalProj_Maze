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
var playerSpeed = 10;
var bbox;
var helper;
//maze generation
var size = 20;
var maze, mazeMesh;
var distance = 100,
   entranceXidx = 1,
   entranceZidx = size-1;
   exitXidx = size-1,
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


//tree
var green = 0x44aa44;

/**
 * Run initial setup function and loop through rendering.
 */
init();
animate();

/**
 * Initializer function.
 */
function init() {
  // Build the container
  // container = document.createElement( 'div' );

  container = document.getElementById('world');

  // Create the scene.
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xccddff );
  scene.fog = new THREE.Fog( 0xccddff, 3000, 5000 );

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


  // // Create a rotation point.
  rotationPoint = new THREE.Object3D();
  rotationPoint.position.set( 0, 0, 0 );
  scene.add( rotationPoint );

  createCharacter();
  createFloor();
  createMaze();

  enableCollisions = true;

  // Create the camera.
  camera = new THREE.PerspectiveCamera(
    50, // Angle
    window.innerWidth / window.innerHeight, // Aspect Ratio.
    1, // Near view.
    20000 // Far view.
  );

  // Move the camera away from the center of the scene.
  camera.position.z = -300;
  camera.position.y = 100;
  camera.rotation.y = radians(90);
  scene.add( camera );

  // Flags to determine which direction the player is moving

  clock = new THREE.Clock();
  // listenForPlayerMovement();

  // Build the renderer
  renderer = new THREE.WebGLRenderer( { antialias: true } );

  var element = renderer.domElement;
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( element );

  // // Build the controls.
  controls = new THREE.OrbitControls( camera, element );
  controls.enablePan = false;
  controls.enableZoom = true;
  // controls.autoRotate = true;
  controls.maxDistance = 1000; // Set our max zoom out distance (mouse scroll)
  controls.minDistance = 60; // Set our min zoom in distance (mouse scroll)
  // controls.target.copy( new THREE.Vector3( 0, 0, 0 ) );
  controls.target.copy( box.threegroup.position);

  document.onkeydown = handleKeyDown;

}


function handleKeyDown(keyEvent){
//https://javascript.info/keyboard-events


  if (keyEvent.key == "ArrowRight") {
    // box.position.x -= playerSpeed;
    movements.push(new THREE.Vector3(box.threegroup.position.x - playerSpeed, box.threegroup.position.y, box.threegroup.position.z));
    box.threegroup.rotation.y = radians(180);
    // camera.rotation.y = radians(180);
    moveRight = true;
  }
  else if (keyEvent.key == "ArrowLeft") {
    // box.threegroup.position.x += playerSpeed;
    movements.push(new THREE.Vector3(box.threegroup.position.x + playerSpeed, box.threegroup.position.y, box.threegroup.position.z));
    box.threegroup.rotation.y = radians(0);
    // camera.rotation.y = radians(0);
    moveLeft = true;
  }

  if (keyEvent.key == "ArrowDown") {
    // box.threegroup.position.z -= playerSpeed;
    movements.push(new THREE.Vector3(box.threegroup.position.x, box.threegroup.position.y, box.threegroup.position.z - playerSpeed));
    box.threegroup.rotation.y = radians(90);
    moveBackward = true;
  }
  else if (keyEvent.key == "ArrowUp") {
    // box.threegroup.position.z += playerSpeed;
    movements.push(new THREE.Vector3(box.threegroup.position.x, box.threegroup.position.y, box.threegroup.position.z  + playerSpeed));

    box.threegroup.rotation.y = radians(270);
    moveForward = true;
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
  camera.updateProjectionMatrix();
}

/**
 * Render the scene.
 */
function render() {
  renderer.render( scene, camera );

  // If any movement was added, run it!
  if ( movements.length > 0 ) {
    move( box, movements[ 0 ] );
  }


  if ( collisions.length > 0 && enableCollisions) {
    detectCollisions(box);
  }


  // controls.update();

}

/**
 * Animate the scene.
 */
function animate() {
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
	 var randExitZidx = Math.floor(Math.random()*size);
	 for (var i = 0; i < maze.dimension; i++) {
		  for (var j = 0; j < maze.dimension; j++) {
			   var mazeObj = maze[i][j];
				if (mazeObj) {
               if (i == entranceXidx && j==entranceZidx){//entrance
                  createTree(entranceX,entranceZ,0x2194ce);
               }
               else if (i == exitXidx && j == randExitZidx){//exit
                  createTree(-300+j*distance,-300+i*distance,0xead516);
               }
               else{
                  createTree(-300+j*distance,-300+i*distance,green);
               }
            }
        }
   }
}

function createMaze() {
   maze = generateMaze(size);
   mazeMesh = CreateMazeMesh(maze);
   //original one for testing
    // for (var x = 300; x < 500; x = x + 160) {
    //   for (var z = 300; z < 700; z = z + 100) {
    //     createTree(x, z);
    //   }
    // }
    //
    // createTree(460, 700);
    // createTree(460, 800);
    // createTree(400, 800);
    // createTree(300, 800);
    //
    // for (var z = 600; z < 900; z = z + 200) {
    //   for (var x = 200; x > -100; x = x - 100) {
    //     createTree(x, z);
    //   }
    // }
    // createTree(300, 300);
    // createTree(300, 400;
    // createTree(300, 500);
    // createTree(300, 600);
    // createTree(500, 300);
    // createTree(500, 400);
    // createTree(500, 500);
    // createTree(500, 600);
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
  box.threegroup.position.y = characterSize * 2; //TODO: feet are sticking through floor
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
function createTree( posX, posZ, treeColor ) {
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

  calculateCollisionPoints( treeTop );

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
  controls: true,
	reset: function() { resetSphere() }
};

// var shapeColor = gui.addColor( parameters, 'color' ).name('Color (Diffuse)').listen();
var collisionsDetected = gui.add(parameters, 'collisions').name('Collisions Enabled').listen();
// var toggleControls = gui.add(parameters, 'controls').name('OrbitControls Enabled').listen();
// shapeColor.onChange(function(value) // onFinishChange
// {   box.material.color.setHex( value.replace("#", "0x") );   });

collisionsDetected.onChange(function(value)
{   enableCollisions = !enableCollisions; });
//
// toggleControls.onChange(function(value)
// {   toggleControls = !toggleControls; });
