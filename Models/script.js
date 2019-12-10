//THREEJS RELATED VARIABLES

var scene,
    camera,
    controls,
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane,
    shadowLight,
    backLight,
    light,
    renderer,
    container;

//SCENE
var floor;

//SCREEN VARIABLES

var HEIGHT,
  	WIDTH,
    windowHalfX,
  	windowHalfY,
    mousePos = {x:0,y:0};


//INIT THREE JS, SCREEN AND MOUSE EVENTS

function init(){
  scene = new THREE.Scene();
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 60;
  nearPlane = 1;
  farPlane = 2000;
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane);
  camera.position.x = -300;
  camera.position.z = 1000;
  camera.position.y = 300;
  camera.lookAt(new THREE.Vector3(0,0,0));
  renderer = new THREE.WebGLRenderer({alpha: true, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(WIDTH, HEIGHT);
  renderer.shadowMapEnabled = true;

  container = document.getElementById('world');
  container.appendChild(renderer.domElement);

  windowHalfX = WIDTH / 2;
  windowHalfY = HEIGHT / 2;

  window.addEventListener('resize', onWindowResize, false);
  document.addEventListener('mousemove', handleMouseMove, false);
  document.addEventListener('touchstart', handleTouchStart, false);
	document.addEventListener('touchend', handleTouchEnd, false);
	document.addEventListener('touchmove',handleTouchMove, false);

  controls = new THREE.OrbitControls( camera, renderer.domElement);

}

function onWindowResize() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  windowHalfX = WIDTH / 2;
  windowHalfY = HEIGHT / 2;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
}

function handleMouseMove(event) {
  mousePos = {x:event.clientX, y:event.clientY};
}

function handleTouchStart(event) {
  if (event.touches.length > 1) {
    event.preventDefault();
		mousePos = {x:event.touches[0].pageX, y:event.touches[0].pageY};
  }
}

function handleTouchEnd(event) {
    mousePos = {x:windowHalfX, y:windowHalfY};
}

function handleTouchMove(event) {
  if (event.touches.length == 1) {
    event.preventDefault();
		mousePos = {x:event.touches[0].pageX, y:event.touches[0].pageY};
  }
}

function createLights() {
  light = new THREE.HemisphereLight(0xffffff, 0xffffff, .5)

  shadowLight = new THREE.DirectionalLight(0xffffff, .8);
  shadowLight.position.set(200, 200, 200);
  shadowLight.castShadow = true;
  shadowLight.shadowDarkness = .2;

  backLight = new THREE.DirectionalLight(0xffffff, .4);
  backLight.position.set(-100, 200, 50);
  backLight.shadowDarkness = .1;
  backLight.castShadow = true;

  scene.add(backLight);
  scene.add(light);
  scene.add(shadowLight);
}

var greyMat = new THREE.MeshLambertMaterial ({
  color: 0x696969,
  shading:THREE.FlatShading
});
var whiteMat = new THREE.MeshLambertMaterial ({
  color: 0xffffff,
  shading: THREE.FlatShading
});
var blackMat = new THREE.MeshLambertMaterial ({
  color: 0x000000,
  shading: THREE.FlatShading
});
var brownMat = new THREE.MeshLambertMaterial ({
  color: 0x665846,
  shading: THREE.FlatShading
});
var lightBlueMat = new THREE.MeshLambertMaterial ({
  color: 0x7f7fff,
  shading:THREE.FlatShading
});
var blueMat = new THREE.MeshLambertMaterial ({
  color: 0x0000ff,
  shading:THREE.FlatShading
});
var lightBrownMat = new THREE.MeshLambertMaterial ({
  color: 0xd2b48c,
  shading:THREE.FlatShading
});
var offWhiteMat = new THREE.MeshLambertMaterial ({
  color: 0xb3aa94,
  shading: THREE.FlatShading
});
var lightGreyMat = new THREE.MeshLambertMaterial ({
  color: 0xb2b2b2,
  shading:THREE.FlatShading
});
var darkBrownMat = new THREE.MeshLambertMaterial ({
  color: 0xa8551e,
  shading:THREE.FlatShading
});

//Goose
Goose = function(){

  this.threegroup = new THREE.Group();

  //BODY
  var bodyGeom = new THREE.BoxGeometry(100, 85, 100);
  this.bodyGoose = new THREE.Mesh(bodyGeom, brownMat);
  this.bodyGoose.position.y = 65;

  this.tail = new THREE.Group();
  var tailGeom = new THREE.CylinderGeometry(57, 57, 100, 3);
  this.tailGoose = new THREE.Mesh(tailGeom, brownMat);
  this.tailGoose.position.y = 51;
  this.tailGoose.position.x = -50;
  this.tailGoose.rotation.x = Math.PI/2;
  this.tailGoose.rotation.y = Math.PI/3;

  this.frontBody = new THREE.Group();
  var frontBodyGeom = new THREE.CylinderGeometry(57, 57, 100, 3);
  this.frontBodyGoose = new THREE.Mesh(frontBodyGeom, brownMat);
  this.frontBodyGoose.position.y = 79;
  this.frontBodyGoose.position.x = 50;
  this.frontBodyGoose.rotation.x = Math.PI/2;
  //this.frontBodyGoose.rotation.y = ((4 * Math.PI)/6);

  this.threegroup.add(this.bodyGoose);
  this.threegroup.add(this.tailGoose);
  this.threegroup.add(this.frontBodyGoose);

  //WINGS
  this.wings = new THREE.Group();

  var wingGeom = new THREE.CylinderGeometry(70,70, 10, 3);

  this.wingLeft = new THREE.Mesh(wingGeom, brownMat);
  this.wingLeft.position.y = 60;
  this.wingLeft.position.x = 10;
  this.wingLeft.position.z = 60;

  this.wingRight = this.wingLeft.clone();
  this.wingRight.position.z = -this.wingLeft.position.z;
  this.wingRight.rotation.y = -Math.PI/3;

  this.wings.add(this.wingLeft);
  this.wings.add(this.wingRight);
  this.threegroup.add(this.wings);

  //NECK AND HEAD
  var neckGeom = new THREE.BoxGeometry(50, 75, 50);
  this.neckGoose = new THREE.Mesh(neckGeom, blackMat);
  this.neckGoose.position.y = 145;
  this.neckGoose.position.x = 73;

  var headGeom = new THREE.BoxGeometry(80, 60, 60);
  this.headGoose = new THREE.Mesh(headGeom, blackMat);
  this.headGoose.position.y = 200;
  this.headGoose.position.x = 80;

  this.threegroup.add(this.neckGoose);
  this.threegroup.add(this.headGoose);

  //BEAK
  this.face = new THREE.Group();
  var beakGeom = new THREE.CylinderGeometry(25, 25, 50, 3);
  this.beakGoose = new THREE.Mesh(beakGeom, greyMat);
  this.beakGoose.position.y = 185;
  this.beakGoose.position.x = 120;
  this.beakGoose.rotation.x = Math.PI/2;
  this.beakGoose.rotation.y = ((4 * Math.PI)/4);

  // // EYES
  var eyeGeom = new THREE.BoxGeometry(10,20,5);

  this.leftEye = new THREE.Mesh(eyeGeom, whiteMat);
  this.leftEye.position.x = 100;
  this.leftEye.position.y = 200;
  this.leftEye.position.z = 30;

  this.rightEye = new THREE.Mesh(eyeGeom, whiteMat);
  this.rightEye.position.x = 100;
  this.rightEye.position.y = 200;
  this.rightEye.position.z = -30;

  this.face.add(this.beakGoose);
  this.face.add(this.leftEye);
  this.face.add(this.rightEye);

  //NECK STRIPE
  var stripeGeom = new THREE.BoxGeometry(50,20,1);

  this.leftStripe = new THREE.Mesh(stripeGeom, whiteMat);
  this.leftStripe.position.x = 73;
  this.leftStripe.position.y = 170;
  this.leftStripe.position.z = 25;

  this.rightStripe = new THREE.Mesh(stripeGeom, whiteMat);
  this.rightStripe.position.x = 73;
  this.rightStripe.position.y = 170;
  this.rightStripe.position.z = -25;

  this.face.add(this.leftStripe);
  this.face.add(this.rightStripe);
  this.threegroup.add(this.face);


  //LEGS
  this.rightLeg = new THREE.Group();
  this.leftLeg = new THREE.Group();
  var legGeom = new THREE.BoxGeometry(40, 90, 20);

  this.leg1 = new THREE.Mesh(legGeom, brownMat);
  this.leg1.position.y = 20;
  this.leg1.position.x = 10;
  this.leg1.position.z = 20;

  this.leg2 = new THREE.Mesh(legGeom, brownMat);
  this.leg2.position.y = 20;
  this.leg2.position.x = 10;
  this.leg2.position.z = -20;

  var footGeom = new THREE.BoxGeometry(70, 20, 30);

  this.foot1 = new THREE.Mesh(footGeom, blackMat);
  this.foot1.position.y = -20;
  this.foot1.position.x = 20;
  this.foot1.position.z = 20;

  this.foot2 = new THREE.Mesh(footGeom, blackMat);
  this.foot2.position.y = -20;
  this.foot2.position.x = 20;
  this.foot2.position.z = -20;

  this.rightLeg.add(this.leg1);
  this.leftLeg.add(this.leg2);
  this.rightLeg.add(this.foot1);
  this.leftLeg.add(this.foot2);
  this.threegroup.add(this.rightLeg);
  this.threegroup.add(this.leftLeg);

  // light stuff
  // this.threegroup.traverse( function ( object ) {
	// 	if ( object instanceof THREE.Mesh ) {
	// 		object.castShadow = true;
	// 		object.receiveShadow = true;
	// 	}
	// } );

}

Clock = function(){

  this.threegroup = new THREE.Group();

  this.base = new THREE.Group();
  var baseGeom = new THREE.CylinderGeometry(100, 100, 10, 32);
  this.base1 = new THREE.Mesh(baseGeom, lightBlueMat);
  var faceGeom = new THREE.CylinderGeometry(90, 90, 1, 32);
  this.face = new THREE.Mesh(faceGeom, whiteMat);
  this.face.position.y = 5;

  this.base.add(this.face);
  this.base.add(this.base1);
  this.threegroup.add(this.base);

  this.hands = new THREE.Group();
  var bigHandGeom = new THREE.BoxGeometry(10, 1, 80);
  this.bigHand = new THREE.Mesh(bigHandGeom, blackMat);
  this.bigHand.position.y = 6;
  this.bigHand.position.x = 15;
  this.bigHand.position.z = -25;
  this.bigHand.rotation.y = 100;
  var smallHandGeom = new THREE.BoxGeometry(10, 1, 50);
  this.smallHand = new THREE.Mesh(smallHandGeom, blackMat);
  this.smallHand.position.y = 6;
  this.smallHand.position.x = -12;
  this.smallHand.position.z = -11;
  this.smallHand.rotation.y = -50;

  this.hands.add(this.bigHand);
  this.hands.add(this.smallHand);
  this.threegroup.add(this.hands);

}

Can = function(){

  var baseTexture = THREE.ImageUtils.loadTexture("keystonelabel.jpg");

  this.threegroup = new THREE.Group();

  this.base = new THREE.Group();
  var baseGeom = new THREE.CylinderGeometry(50, 50, 120, 32);
  this.middleBase = new THREE.Mesh(baseGeom, blueMat);
  this.middleBase.position.y = 100;

  var bottomBaseGeom = new THREE.CylinderGeometry(50, 40, 20, 32);
  this.bottomBase = new THREE.Mesh(bottomBaseGeom, blueMat);
  this.bottomBase.position.y = 30;
  var topBaseGeom = new THREE.CylinderGeometry(40, 50, 20, 32);
  this.topBase = new THREE.Mesh(topBaseGeom, blueMat);
  this.topBase.position.y = 170;

  var topGeom = new THREE.CylinderGeometry(38, 38, 1, 32);
  this.top = new THREE.Mesh(topGeom, lightGreyMat);
  this.top.position.y = 180;

  //add tab thingy

  this.base.add(this.middleBase);
  this.base.add(this.bottomBase);
  this.base.add(this.topBase);
  this.base.add(this.top);
  this.threegroup.add(this.base);

}

Coffee = function(){

  this.threegroup = new THREE.Group();

  this.cup = new THREE.Group();
  var cupGeom = new THREE.CylinderGeometry(50, 40, 120, 32);
  this.cup = new THREE.Mesh(cupGeom, whiteMat);
  this.cup.position.y = 60;
  this.threegroup.add(this.cup);

  this.lid = new THREE.Group();
  var lidGeom = new THREE.CylinderGeometry(45, 55, 15, 32);
  this.lid = new THREE.Mesh(lidGeom, blackMat);
  this.lid.position.y = 120;
  this.threegroup.add(this.lid);

  this.sleeve = new THREE.Group();
  var sleeveGeom = new THREE.CylinderGeometry(50, 45, 50, 32);
  this.sleeve = new THREE.Mesh(sleeveGeom, lightBrownMat);
  this.sleeve.position.y = 60;
  this.threegroup.add(this.sleeve);
}

Deer = function() {

  this.threegroup = new THREE.Group();

  this.leggroup1 = new THREE.Group();
  this.leggroup2 = new THREE.Group();
  this.tailgroup = new THREE.Group();

   this.threegroup.add( new THREE.Mesh(
      new THREE.BoxGeometry(3.9,1.9,1.9),
      darkBrownMat
   ));

   var tail = new THREE.Mesh(
     new THREE.BoxGeometry(0.5,1,0.5),
     darkBrownMat
   );
   tail.position.x = -1.9;
   tail.position.y = 1.25;
   tail.rotation.set(0,0,0.25);
   this.tailgroup.add(tail);

   var leg1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.5,3,0.5),
      darkBrownMat
   );
   leg1.position.x = -1.7;
   leg1.position.y = -1.5;
   leg1.position.z = -.7;
   this.leggroup1.add(leg1);

   var leg2 = leg1.clone();
   leg2.position.z = -leg1.position.z;
   this.leggroup2.add(leg2);

   var leg3 = leg1.clone();
   leg3.position.x = -leg1.position.x;
   leg3.position.z = -leg1.position.z;
   this.leggroup1.add(leg3);

   var leg4 = leg1.clone();
   leg4.position.x = -leg1.position.x;
   this.leggroup2.add(leg4);

   var hoof1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.5,0.3,0.5),
      blackMat
   );
   hoof1.position.x = -1.7;
   hoof1.position.y = -3.15;
   hoof1.position.z = -0.7;
   this.leggroup1.add(hoof1);

   var hoof2 = hoof1.clone();
   hoof2.position.z = -hoof1.position.z;
   this.leggroup2.add(hoof2);

   var hoof3 = hoof1.clone();
   hoof3.position.x = -hoof1.position.x;
   hoof3.position.z = -hoof1.position.z;
   this.leggroup1.add(hoof3);

   var hoof4 = hoof1.clone();
   hoof4.position.x = -hoof1.position.x;
   this.leggroup2.add(hoof4);


// TODO: hierarchical modeling for head/neck etc to move with arrow keys?
// ----------- HEAD PIECES -----------
   var neck = new THREE.Mesh(
     new THREE.BoxGeometry(0.8,1.5,0.8),
     darkBrownMat
   );
   neck.position.x = 1.8;
   neck.position.y = 1.2;
   neck.rotation.set(0,0,-0.4);
   this.threegroup.add(neck);

   var head = new THREE.Mesh(
     new THREE.BoxGeometry(1.3,1.1,1.3),
     darkBrownMat
   );
   head.position.x = 2.2;
   head.position.y = 2;
   this.threegroup.add(head);

   var eye1 = new THREE.Mesh(
     new THREE.BoxGeometry(0.15,0.15,0.01),
     blackMat
   );
   eye1.position.x = 2.3;
   eye1.position.y = 2.15;
   eye1.position.z = 0.65;
   this.threegroup.add(eye1);

   var eye2 = eye1.clone();
   eye2.position.z = -eye1.position.z;
   this.threegroup.add(eye2);

   var snout = new THREE.Mesh(
     new THREE.BoxGeometry(0.8,0.65,0.8),
     darkBrownMat
   );
   snout.position.x = 2.8;
   snout.position.y = 1.8;
   this.threegroup.add(snout);

   var nose = new THREE.Mesh(
     new THREE.BoxGeometry(0.3,0.65,0.8),
     blackMat
   );
   nose.position.x = 3.35;
   nose.position.y = 1.8;
   this.threegroup.add(nose);

   // TODO: possibly change to be a cylinder but with 3 faces (aka a triangular prism)
   var ear1 = new THREE.Mesh(
     new THREE.BoxGeometry(0.3,1,0.45),
     darkBrownMat
   );
   ear1.position.x = 1.5;
   ear1.position.y = 2.65;
   ear1.position.z = 0.5;
   ear1.rotation.set(0.2,0,0.4);
   this.threegroup.add(ear1);

   var ear2 = ear1.clone();
   ear2.position.z = -ear1.position.z;
   ear2.rotation.set(-0.2,0,0.4);
   this.threegroup.add(ear2);

   this.threegroup.add(this.tailgroup);
   this.threegroup.add(this.leggroup1);
   this.threegroup.add(this.leggroup2);

   // var antler1 = new THREE.Mesh(
   //   new THREE.ConeGeometry(0.15,0.8,0.45),
   //   this.offWhiteMat
   // );
   // antler1.position.x = 2;
   // antler1.position.y = 2.8;
   // antler1.position.z = 0.25;
   // this.threegroup.add(antler1);
   //
   // var antler2 = antler1.clone();
   // antler2.position.z = -antler2.position.z;
   // this.threegroup.add(antler2);
// ----------- END HEAD PIECES -----------
}

function createFloor(){
  floor = new THREE.Mesh(new THREE.PlaneBufferGeometry(1000,1000), new THREE.MeshBasicMaterial({color: 0xa5f9aa}));
  floor.rotation.x = -Math.PI/2;
  floor.position.y = -33;
  floor.receiveShadow = true;
  scene.add(floor);
}

function createGoose(){
  Goose = new Goose();
  Goose.threegroup.position.x = 0;
  scene.add(Goose.threegroup);
}

function createClock(){
  Clock = new Clock();
  Clock.threegroup.position.y = 70;
  Clock.threegroup.rotation.x = Math.PI/3 ;
  scene.add(Clock.threegroup);
}

function createCan(){
  Can = new Can();
  Can.threegroup.rotation.x = Math.PI / 16 ;
  scene.add(Can.threegroup);
}

function createCoffee(){
  Coffee = new Coffee();
  Coffee.threegroup.rotation.x = Math.PI / 16 ;
  scene.add(Coffee.threegroup);
}

function createDeer(){
  deer = new Deer();
  deer.threegroup.position.x = 0;
  deer.threegroup.position.y = 100;
  deer.threegroup.scale.set(40,40,40);
  scene.add(deer.threegroup);
}

function loop(){
  var tempHA = (mousePos.x-windowHalfX)/200;
  var tempVA = (mousePos.y - windowHalfY)/200;
  var userHAngle = Math.min(Math.max(tempHA, -Math.PI/3), Math.PI/3);
  var userVAngle = Math.min(Math.max(tempVA, -Math.PI/3), Math.PI/3);

  render();
  requestAnimationFrame(loop);
}

function render(){
  controls.update();
  renderer.render(scene, camera);
}

init();
createLights();
createFloor();
// createGoose();
// createClock();
// createCan();
// createCoffee();
createDeer();
loop();
