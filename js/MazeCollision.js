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
var characterSize = 50;
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
var size = 7;
var maze, mazeMesh;
var distance = 100,
   entranceXidx = 1,
   entranceZidx = size-1;
   exitXidx = size-1,
   entranceX = -300+(size-1)*100,
   entranceZ = -200;


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
  container = document.createElement( 'div' );
  document.body.appendChild( container );

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
  box.add( camera );


  // Build the renderer
  renderer = new THREE.WebGLRenderer( { antialias: true } );

  var element = renderer.domElement;
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( element );

  // Build the controls.
  controls = new THREE.OrbitControls( camera, element );
  controls.enablePan = false;
  controls.enableZoom = true;
  // controls.autoRotate = true;
  controls.maxDistance = 1000; // Set our max zoom out distance (mouse scroll)
  controls.minDistance = 60; // Set our min zoom in distance (mouse scroll)
  controls.target.copy( new THREE.Vector3( 0, 0, 0 ) );

  // document.addEventListener( 'mousedown', onDocumentMouseDown, false );
  // document.addEventListener('mousemove', handleMouseMove, false);
  document.onkeydown = handleKeyDown;

}


function handleKeyDown(keyEvent){
//https://javascript.info/keyboard-events


  if (keyEvent.key == "ArrowRight") {
    // box.position.x -= playerSpeed;
    movements.push(new THREE.Vector3(box.position.x - playerSpeed, box.position.y, box.position.z));
  }
  else if (keyEvent.key == "ArrowLeft") {
    // box.position.x += playerSpeed;
    movements.push(new THREE.Vector3(box.position.x + playerSpeed, box.position.y, box.position.z));
  }

  if (keyEvent.key == "ArrowDown") {
    // box.position.z -= playerSpeed;
    movements.push(new THREE.Vector3(box.position.x, box.position.y, box.position.z - playerSpeed));
  }
  else if (keyEvent.key == "ArrowUp") {
    // box.position.z += playerSpeed;
    movements.push(new THREE.Vector3(box.position.x, box.position.y, box.position.z  + playerSpeed));
  }

}

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
    var posX = location.position.x;
    var posZ = location.position.z;
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

    // Update the main position.
    location.position.x = location.position.x + ( moveDistance * ( diffX / distance )) * multiplierX;
    location.position.z = location.position.z + ( moveDistance * ( diffZ / distance )) * multiplierZ;

    // If the position is close we can call the movement complete.
    if (( Math.floor( location.position.x ) <= Math.floor( newPosX ) + 1.5 &&
          Math.floor( location.position.x ) >= Math.floor( newPosX ) - 1.5 ) &&
        ( Math.floor( location.position.z ) <= Math.floor( newPosZ ) + 1.5 &&
          Math.floor( location.position.z ) >= Math.floor( newPosZ ) - 1.5 )) {
      location.position.x = Math.floor( location.position.x );
      location.position.z = Math.floor( location.position.z );

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

  renderer.render( scene, camera );

  // Don't let the camera go too low.
  if ( camera.position.y < 10 ) {
    camera.position.y = 10;
  }

  // If any movement was added, run it!
  if ( movements.length > 0 ) {
    move( box, movements[ 0 ] );
  }


  if ( collisions.length > 0 && enableCollisions) {
    detectCollisions(box);
  }

  controls.update();
}

/**
 * Animate the scene.
 */
function animate() {
  requestAnimationFrame(animate);
  update();
  render();
  // box.updateMatrixWorld( true );
  // bbox.copy( box.geometry.boundingBox ).applyMatrix4( box.matrixWorld)
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
  // var geometry = new THREE.CylinderGeometry( characterSize, characterSize, characterSize );
  var geometry = new THREE.BoxBufferGeometry( characterSize, characterSize, characterSize );
  // var geometry = new THREE.CylinderBufferGeometry( characterSize/2, characterSize/2, characterSize );
  var material = new THREE.MeshPhongMaterial({ color: 0x7a6f50 });
  box = new THREE.Mesh( geometry, material );
  //box is always placed right next to entrance
  box.position.y = characterSize/2;
  box.position.x = entranceX-100;
  box.position.z = entranceZ;
  // box.rotation.z = radians(90);
  rotationPoint.add( box );
  // rotationPoint.rotation.set(radians(-90));

  // bbox = new THREE.Box3().setFromObject(box);
  // helper = new THREE.Box3Helper( bbox, 0xffff00 );
  // scene.add(helper);


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
  var geometry = new THREE.DodecahedronGeometry( characterSize );
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
	reset: function() { resetSphere() }
};

var shapeColor = gui.addColor( parameters, 'color' ).name('Color (Diffuse)').listen();
var collisionsDetected = gui.add(parameters, 'collisions').name('Collisions Enabled').listen();

shapeColor.onChange(function(value) // onFinishChange
{   box.material.color.setHex( value.replace("#", "0x") );   });

collisionsDetected.onChange(function(value)
{   enableCollisions = !enableCollisions; });
