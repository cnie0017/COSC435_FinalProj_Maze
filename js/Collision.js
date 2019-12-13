//http://www.bryanjones.us/article/basic-threejs-game-tutorial-part-5-collision-detection

var clz = {};
var collisions = [];
// var isPowerUpMesh = [];

/**
 * Calculates collision detection parameters.
 */
function calculateCollisionPoints( mesh, scale, isPowerUp = false, type = 'collision' ) {
  // Compute the bounding box after scale, translation, etc.

  var bbox = new THREE.Box3().setFromObject(mesh);

  var bounds = {
    type: type,
    isPowerUp: isPowerUp,
    xMin: bbox.min.x,
    xMax: bbox.max.x,
    yMin: bbox.min.y,
    yMax: bbox.max.y,
    zMin: bbox.min.z,
    zMax: bbox.max.z,
  };

  collisions.push( bounds );
  // isPowerUpMesh.push(isPowerUp);
}

/**
 * Collision detection for every solid object.
 */
function detectCollisions() {

  var bounds = {
    xMin: box.threegroup.position.x - box.threegroup.scale.x / 2,
    xMax: box.threegroup.position.x + box.threegroup.scale.x / 2,
    yMin: box.threegroup.position.y - box.threegroup.scale.y / 2,
    yMax: box.threegroup.position.y + box.threegroup.scale.y / 2,
    zMin: box.threegroup.position.z - box.threegroup.scale.z / 2,
    zMax: box.threegroup.position.z + box.threegroup.scale.z / 2,
  };

  // Run through each object and detect if there is a collision.
  for ( var index = 0; index < collisions.length; index ++ ) {
    if (collisions[ index ].type != 'collision' ) {
      if ( ( bounds.xMin <= collisions[ index ].xMax && bounds.xMax >= collisions[ index ].xMin ) &&
         ( bounds.yMin <= collisions[ index ].yMax && bounds.yMax >= collisions[ index ].yMin) &&
         ( bounds.zMin <= collisions[ index ].zMax && bounds.zMax >= collisions[ index ].zMin) ) {
            console.log("Hit a powerup!");
            //do powerup things
            // clock coffee goose can student
            if (collisions[ index ].type == 'clock'){ clockPower(); collisions[ index ] = {}; }
            if (collisions[ index ].type == 'coffee'){ coffeePower(); collisions[ index ] = {}; }
            if (collisions[ index ].type == 'goose'){ goosePower(); collisions[ index ] = {}; }
            if (collisions[ index ].type == 'can'){ canPower(); collisions[ index ] = {}; }
            if (collisions[ index ].type == 'student'){ studentPower(); collisions[ index ] = {}; }
      }
    }
    else if (collisions[ index ].type == 'collision' ) {

      if ( ( bounds.xMin <= collisions[ index ].xMax && bounds.xMax >= collisions[ index ].xMin ) &&
         ( bounds.yMin <= collisions[ index ].yMax && bounds.yMax >= collisions[ index ].yMin) &&
         ( bounds.zMin <= collisions[ index ].zMax && bounds.zMax >= collisions[ index ].zMin) ) {
        // We hit a solid object! Stop all movements.
        stopMovement();

        // Move the object in the clear. Detect the best direction to move.
        //TODO: stop jiggling/vibrating effect when

        if ( bounds.xMin <= collisions[ index ].xMax && bounds.xMax >= collisions[ index ].xMin ) {
          // Determine center then push out accordingly.
          var objectCenterX = ((collisions[ index ].xMax - collisions[ index ].xMin) / 2) + collisions[ index ].xMin;
          var playerCenterX = ((bounds.xMax - bounds.xMin) / 2) + bounds.xMin;


          // Determine the X axis push.
          if (objectCenterX > playerCenterX) {
            box.threegroup.position.x -= playerSpeed;
          } else {
            box.threegroup.position.x += playerSpeed;
          }
        }
        if ( bounds.zMin <= collisions[ index ].zMax && bounds.zMax >= collisions[ index ].zMin ) {

          var objectCenterZ = ((collisions[ index ].zMax - collisions[ index ].zMin) / 2) + collisions[ index ].zMin;
          var playerCenterZ = ((bounds.zMax - bounds.zMin) / 2) + bounds.zMin;

          // Determine the Z axis push.
          if (objectCenterZ > playerCenterZ) {
          box.threegroup.position.z -= playerSpeed;
          } else {
            box.threegroup.position.z += playerSpeed;
          }
        }
      }
    }
  }
}
