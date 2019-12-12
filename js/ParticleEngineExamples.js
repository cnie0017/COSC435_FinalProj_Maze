/**
* @author Lee Stemkoski   http://www.adelphi.edu/~stemkoski/
*/

/*
	Particle Engine options:

	positionBase   : new THREE.Vector3(),
	positionStyle : Type.CUBE or Type.SPHERE,
	// for Type.CUBE
	positionSpread  : new THREE.Vector3(),
	// for Type.SPHERE
	positionRadius  : 10,

	velocityStyle : Type.CUBE or Type.SPHERE,
	// for Type.CUBE
	velocityBase       : new THREE.Vector3(),
	velocitySpread     : new THREE.Vector3(),
	// for Type.SPHERE
	speedBase   : 20,
	speedSpread : 10,

	accelerationBase   : new THREE.Vector3(),
	accelerationSpread : new THREE.Vector3(),

	particleTexture : THREE.ImageUtils.loadTexture( 'images/star.png' ),

	// rotation of image used for particles
	angleBase               : 0,
	angleSpread             : 0,
	angleVelocityBase       : 0,
	angleVelocitySpread     : 0,
	angleAccelerationBase   : 0,
	angleAccelerationSpread : 0,

	// size, color, opacity
	//   for static  values, use base/spread
	//   for dynamic values, use Tween
	//   (non-empty Tween takes precedence)
	sizeBase   : 20.0,
	sizeSpread : 5.0,
	sizeTween  : new Tween( [0, 1], [1, 20] ),

	// colors stored in Vector3 in H,S,L format
	colorBase   : new THREE.Vector3(0.0, 1.0, 0.5),
	colorSpread : new THREE.Vector3(0,0,0),
	colorTween  : new Tween( [0.5, 2], [ new THREE.Vector3(0, 1, 0.5), new THREE.Vector3(1, 1, 0.5) ] ),
	opacityBase   : 1,
	opacitySpread : 0,
	opacityTween  : new Tween( [2, 3], [1, 0] ),

	blendStyle    : THREE.NormalBlending (default), THREE.AdditiveBlending
	particlesPerSecond : 200,
	particleDeathAge   : 2.0,
	emitterDeathAge    : 60
*/

Examples =
{


	// (1) build GUI for easy effects access.
	// (2) write ParticleEngineExamples.js
	//
	snow :
	{
		positionStyle    : Type.CUBE,
		positionBase     : new THREE.Vector3( 0, 200, 0 ),
		positionSpread   : new THREE.Vector3( 500, 0, 500 ),

		velocityStyle    : Type.CUBE,
		velocityBase     : new THREE.Vector3( 0, -60, 0 ),
		velocitySpread   : new THREE.Vector3( 50, 20, 50 ),
		accelerationBase : new THREE.Vector3( 0, -10,0 ),

		angleBase               : 0,
		angleSpread             : 720,
		angleVelocityBase       :  0,
		angleVelocitySpread     : 60,

		particleTexture : THREE.ImageUtils.loadTexture( 'images/snowflake.png' ),

		sizeTween    : new Tween( [0, 0.25], [1, 10] ),
		colorBase   : new THREE.Vector3(0.66, 1.0, 0.9), // H,S,L
		opacityTween : new Tween( [2, 3], [0.8, 0] ),

		particlesPerSecond : 200,
		particleDeathAge   : 4.0,
		emitterDeathAge    : 60
	},

	rain :
	{
		positionStyle    : Type.CUBE,
		positionBase     : new THREE.Vector3( 0, 200, 0 ),
		positionSpread   : new THREE.Vector3( 600, 0, 600 ),

		velocityStyle    : Type.CUBE,
		velocityBase     : new THREE.Vector3( 0, -400, 0 ),
		velocitySpread   : new THREE.Vector3( 10, 50, 10 ),
		accelerationBase : new THREE.Vector3( 0, -10,0 ),

		particleTexture : THREE.ImageUtils.loadTexture( 'images/raindrop2flip.png' ),

		sizeBase    : 8.0,
		sizeSpread  : 4.0,
		colorBase   : new THREE.Vector3(0.66, 1.0, 0.7), // H,S,L
		colorSpread : new THREE.Vector3(0.00, 0.0, 0.2),
		opacityBase : 0.6,

		particlesPerSecond : 1000,
		particleDeathAge   : 1.0,
		emitterDeathAge    : 60
	},

	leaves :
	{
		positionStyle    : Type.CUBE,
		positionBase     : new THREE.Vector3( 0, 200, 0 ),
		positionSpread   : new THREE.Vector3( 500, 0, 500 ),

		velocityStyle    : Type.CUBE,
		velocityBase     : new THREE.Vector3( 0, -60, 0 ),
		velocitySpread   : new THREE.Vector3( 50, 20, 50 ),
		accelerationBase : new THREE.Vector3( 0, -10,0 ),

		angleBase               : 0,
		angleSpread             : 720,
		angleVelocityBase       :  0,
		angleVelocitySpread     : 60,

		particleTexture : THREE.ImageUtils.loadTexture( 'images/leaf.png' ),

		sizeTween    : new Tween( [0, 0.25], [20, 50] ),
		colorBase   : new THREE.Vector3(0.66, 1.0, 0.9), // H,S,L
		// opacityTween : new Tween( [2, 3], [0.8, 0] ),

		particlesPerSecond : 20,
		particleDeathAge   : 4.0,
		emitterDeathAge    : 60
	}

}
