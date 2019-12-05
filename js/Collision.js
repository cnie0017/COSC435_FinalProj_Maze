//http://www.bryanjones.us/article/basic-threejs-game-tutorial-part-5-collision-detection

var collisions = [];

/**
 * Calculates collision detection parameters.
 */
function calculateCollisionPoints( mesh, scale, type = 'collision' ) {
  // Compute the bounding box after scale, translation, etc.

  var bbox = new THREE.Box3().setFromObject(mesh);

  var bounds = {
    type: type,
    xMin: bbox.min.x,
    xMax: bbox.max.x,
    yMin: bbox.min.y,
    yMax: bbox.max.y,
    zMin: bbox.min.z,
    zMax: bbox.max.z,
  };


  collisions.push( bounds );
}

/**
 * Collision detection for every solid object.
 */
function detectCollisions() {
  // Get the user's current collision area.

  // console.log(box.geometry.parameters.width);
  //
  // box.geometry.computeBoundingBox();
  // // box.geometry.boundingBox.min = (new THREE.Vector3(0, 0, 0));
  // var bbox = box.geometry.boundingBox.clone();
  // var helper = new THREE.Box3Helper( bbox, 0xffff00 );
  // scene.add(helper);
  // console.log(bbox);
  //
  // bbox = new THREE.Box3().setFromObject(box);
  // helper = new THREE.Box3Helper( bbox, 0xffff00 );
  // scene.add(helper);


  var bounds = {
    xMin: box.threegroup.position.x - box.threegroup.scale.x / 2,
    xMax: box.threegroup.position.x + box.threegroup.scale.x / 2,
    yMin: box.threegroup.position.y - box.threegroup.scale.y / 2,
    yMax: box.threegroup.position.y + box.threegroup.scale.y / 2,
    zMin: box.threegroup.position.z - box.threegroup.scale.z / 2,
    zMax: box.threegroup.position.z + box.threegroup.scale.z / 2,
  };

    //
    // //Testing out this for bounding box
    // var bounds = {
    //   xMin: bbox.min.x,
    //   xMax: bbox.max.x,
    //   yMin: bbox.min.y,
    //   yMax: bbox.max.y,
    //   zMin: bbox.min.z,
    //   zMax: bbox.max.z
    // };

  // console.log(bounds.xMin);


  // box.geometry.computeBoundingBox();


  // Run through each object and detect if there is a collision.
  for ( var index = 0; index < collisions.length; index ++ ) {

    if (collisions[ index ].type == 'collision' ) {

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
