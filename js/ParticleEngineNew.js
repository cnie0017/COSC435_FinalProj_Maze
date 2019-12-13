var particleGroup;
var emitter;

function initParticles(style='snow') {

    if (style == 'snow')
    {
      particleGroup = new SPE.Group({
          texture: {
              value: THREE.ImageUtils.loadTexture('./images/snowflake.png')
          }
      });

      emitter = new SPE.Emitter({
        maxAge: {
            value: 2
        },
        position: {
            value: new THREE.Vector3(0, 400, 0),
            spread: new THREE.Vector3( 5000, 500, 5000 )
        },

        acceleration: {
            value: new THREE.Vector3(0, -10, 0),
            spread: new THREE.Vector3( 10, 0, 10 )
        },

        velocity: {
            value: new THREE.Vector3(0, -60, 0),
            spread: new THREE.Vector3(50, 20, 50)
        },

        color: {
            value: [ new THREE.Color('white'), new THREE.Color('white') ]
        },

        size: {
            value: 10
        },

        particleCount: 2000,
        activeMultiplier: 1
      });
    }
    else if (style == 'leaves')
    {
      particleGroup = new SPE.Group({
          texture: {
              value: THREE.ImageUtils.loadTexture('./images/leaf.png')
          }
      });

      emitter = new SPE.Emitter({
        maxAge: {
            value: 2
        },
        position: {
            value: new THREE.Vector3(0, 400, 0),
            spread: new THREE.Vector3( 5000, 500, 5000 )
        },

        acceleration: {
            value: new THREE.Vector3(0, -10, 0),
            spread: new THREE.Vector3( 50, 20, 50 )
        },

        velocity: {
            value: new THREE.Vector3(0, -60, 0),
            spread: new THREE.Vector3(50, 20, 50)
        },

        color: {
            value: [ new THREE.Color('red'), new THREE.Color('red') ]
        },

        size: {
            value: 40
        },

        particleCount: 1000,
        activeMultiplier: 1
        });
      }

    particleGroup.addEmitter( emitter );
    scene.add( particleGroup.mesh );

    // document.querySelector('.numParticles').textContent =
    //     'Total particles: ' + emitter.particleCount;
    //
    // document.querySelector( '.alive-value' ).addEventListener( 'change', function( e ) {
    //     emitter.activeMultiplier = +this.value;
    // }, false );
}
