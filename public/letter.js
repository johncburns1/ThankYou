//AxisHelper
var xAxis = new THREE.Vector3(1,0,0);
var yAxis = new THREE.Vector3(0,1,0);
var zAxis = new THREE.Vector3(0,0,1);

//clock, keyboard, and distance.  These are going to help us with making the robot walk
var clock = new THREE.Clock();
var keyboard = new KeyboardState();
var distance = 0;
var mesh = null;

//the objects
var _ship, sun, moon, laser, star, tattoin, jupiter, redplanet, rain1, rain2;

//all of the bounding boxes
var ship_bound, sun_bound, moon_bound, laser_bound, star_bound, tattoin_bound, jupiter_bound, redplanet_bound,
rain1_bound, rain2_bound;

//for the audio
var audioLoader, sound1, listener;

//fillScene
function fillScene() {

	//initialize scene
	scene = new THREE.Scene();

	scene.fog = new THREE.Fog( 0x808080, 2000, 4000 );

	// LIGHTS

	scene.add( new THREE.AmbientLight( 0xffccff ), 10);

	var light = new THREE.DirectionalLight( 0xff33ff, 0.9 );
	light.position.set( 200, 500, 500 );
	scene.add( light );

	light = new THREE.DirectionalLight( 0xff33ff, 0.9 );
	light.position.set( -200, -100, -400 );
	scene.add( light );

	light = new THREE.DirectionalLight( 0xff751a, 0.9);
	light.position.set(-100, 0, 0);
	scene.add(light);

	light = new THREE.DirectionalLight(0x6699ff, .8);
	light.position.set( 1000, -100, 100 );
	scene.add(light);

	light = new THREE.DirectionalLight(0xffff1a, .7);
	light.position.set( -50,-500,-100 );
	scene.add(light);

	light = new THREE.DirectionalLight(0xff4d4d, .8);
	light.position.set(500,500,-500);
	scene.add(light);

	light = new THREE.DirectionalLight(0x0066ff, .7);
	light.position.set(-350, -400, 400);
	scene.add(light);

	//call drawSpace
 drawSpace();
}

function drawSpace() {

	//just some materials
	var sun_material  = new THREE.MeshPhongMaterial();
	sun_material.map = THREE.ImageUtils.loadTexture('images/sun.jpg');
	sun_material.bumpMap = THREE.ImageUtils.loadTexture('images/sbmap.jpg');
	sun_material.specularMap = THREE.ImageUtils.loadTexture('images/sun.jpg');
	sun_material.bumpScale = 1.0;
	sun_material.specular = new THREE.Color('red');

	//just some materials
	var moon_material  = new THREE.MeshPhongMaterial();
	moon_material.map = THREE.ImageUtils.loadTexture('images/plutomap.jpg');
	moon_material.bumpMap = THREE.ImageUtils.loadTexture('images/plutobump1k.jpg');
	moon_material.specularMap = THREE.ImageUtils.loadTexture('images/plutomap.jpg');
	moon_material.bumpScale = 1.0;
	moon_material.specular = new THREE.Color('gray');

	var jupiter_material  = new THREE.MeshPhongMaterial();
	jupiter_material.map = THREE.ImageUtils.loadTexture('images/jupiter.png');
	jupiter_material.bumpMap = THREE.ImageUtils.loadTexture('images/jupiterbumpmap.jpg');
	jupiter_material.specularMap = THREE.ImageUtils.loadTexture('images/jupiter.png');
	jupiter_material.bumpScale = 1.0;
	jupiter_material.specular = new THREE.Color('purple');

	var rain1_material = new THREE.MeshPhongMaterial();
	rain1_material.map = THREE.ImageUtils.loadTexture('images/rainbowplanet.png');
	rain1_material.bumpMap = THREE.ImageUtils.loadTexture('images/rainbowplanet.png');
	rain1_material.specularMap = THREE.ImageUtils.loadTexture('images/rainbowplanet.png');
	rain1_material.bumpScale = 1.0;
	rain1_material.specular = new THREE.Color('blue');

	var rain2_material = new THREE.MeshPhongMaterial();
	rain2_material.map = THREE.ImageUtils.loadTexture('images/rainbow.jpg');
	rain2_material.bumpMap = THREE.ImageUtils.loadTexture('images/bumpmap.jpg');
	rain2_material.specularMap = THREE.ImageUtils.loadTexture('images/rainbow.jpg');
	rain2_material.bumpScale = 1.0;
	rain2_material.specular = new THREE.Color('blue');

	var redplanet_material = new THREE.MeshPhongMaterial();
	redplanet_material.map = THREE.ImageUtils.loadTexture('images/redplanet.jpg');
	redplanet_material.bumpMap = THREE.ImageUtils.loadTexture('images/redplanet.jpg');
	redplanet_material.specularMap = THREE.ImageUtils.loadTexture('images/redplanet.jpg');
	redplanet_material.bumpScale = 1.0;
	redplanet_material.specular = new THREE.Color('red');

	var tattoin_material = new THREE.MeshPhongMaterial();
	tattoin_material.map = THREE.ImageUtils.loadTexture('images/tattoin.jpg');
	tattoin_material.bumpMap = THREE.ImageUtils.loadTexture('images/tattoinbumpmap.jpg');
	tattoin_material.specularMap = THREE.ImageUtils.loadTexture('images/tattoin.jpg');
	tattoin_material.bumpScale = 1.0;
	tattoin_material.specular = new THREE.Color('orange');

	var star_material = new THREE.MeshPhongMaterial();
	star_material.map = THREE.ImageUtils.loadTexture('images/starmap.jpg');
	star_material.bumpMap = THREE.ImageUtils.loadTexture('images/starmap.jpg');
	star_material.specularMap = THREE.ImageUtils.loadTexture('images/starmap.jpg');
	star_material.bumpScale = 1.0;
	star_material.specular = new THREE.Color('orange');

	var laser_material = new THREE.MeshPhongMaterial();
	laser_material.map = THREE.ImageUtils.loadTexture('images/lasers.jpg');
	laser_material.bumpMap = THREE.ImageUtils.loadTexture('images/sbmap.jpg');
	laser_material.specularMap = THREE.ImageUtils.loadTexture('images/lasers.jpg');
	laser_material.bumpScale = 1.0;
	laser_material.specular = new THREE.Color('blue');

	//draw the skySphere that is going to be space
	var skyGeo = new THREE.SphereGeometry(1000, 100, 100);
	var material = new THREE.MeshPhongMaterial({map: new THREE.ImageUtils.loadTexture('images/stars.jpg')});
	var sky = new THREE.Mesh(skyGeo, material);
	sky.material.side = THREE.BackSide;
	scene.add(sky);

	//add the spaceship from the .json files
	_ship = new THREE.Object3D();
	_ship.position.set(0,0,0);
	_ship.rotateOnAxis(xAxis, -Math.PI/2);

	var loader = new THREE.JSONLoader();
	loader.load('ship.json', function(geometry, materials) {
			mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
			mesh.scale.x = mesh.scale.y = mesh.scale.z = 3;
			_ship.add(mesh);
	});

	//create and add the sun
	sun = new THREE.Object3D();
	var sunGeo  = new THREE.SphereGeometry(1, 32, 32);
	var sunMesh = new THREE.Mesh(sunGeo, sun_material);
	sun.add(sunMesh);
	sun.scale.set(50,50,50);
	sun.position.set(200, 0, 0);

	moon = new THREE.Object3D();
	var moonGeo = new THREE.SphereGeometry(.5,32,32);
	var moonMesh = new THREE.Mesh(moonGeo, moon_material);
	moon.add(moonMesh);
	moon.scale.set(40,40,40);
	moon.position.set(-200, -100, -400);


	jupiter = new THREE.Object3D();
	var jupGeo = new THREE.SphereGeometry(2,32,32);
	var jupMesh = new THREE.Mesh(jupGeo, jupiter_material);
	jupiter.add(jupMesh);
	jupiter.scale.set(45,45,45);
	jupiter.position.set( -1000, -75, 2  );

	rain1 = new THREE.Object3D();
	var rain1Geo  = new THREE.SphereGeometry(1, 32, 32);
	var rain1Mesh = new THREE.Mesh(rain1Geo, rain1_material);
	rain1.add(rain1Mesh);
	rain1.scale.set(50,50,50);
	rain1.position.set(-400,-400,-400);

	rain2 = new THREE.Object3D();
	var rain2Geo  = new THREE.SphereGeometry(2, 32, 32);
	var rain2Mesh = new THREE.Mesh(rain2Geo, rain2_material);
	rain2.add(rain2Mesh);
	rain2.scale.set(25,25,25);
	rain2.position.set(50,500,100);

	redplanet = new THREE.Object3D();
	var redplanetGeo  = new THREE.SphereGeometry(2, 32, 32);
	var redplanetMesh = new THREE.Mesh(redplanetGeo, redplanet_material);
	redplanet.add(redplanetMesh);
	redplanet.scale.set(15,15,15);
	redplanet.position.set(-500,-500,500);

	tattoin = new THREE.Object3D();
	var tattoinGeo  = new THREE.SphereGeometry(2, 32, 32);
	var tattoinMesh = new THREE.Mesh(tattoinGeo, tattoin_material);
	tattoin.add(tattoinMesh);
	tattoin.scale.set(55,55, 55);
	tattoin.position.set(300, 200, 600);

	star = new THREE.Object3D();
	var starGeo  = new THREE.SphereGeometry(2, 32, 32);
	var starMesh = new THREE.Mesh(starGeo, star_material);
	star.add(starMesh);
	star.scale.set(30,30, 30);
	star.position.set(350, 400, -400);

	laser = new THREE.Object3D();
	var laserGeo  = new THREE.SphereGeometry(2, 32, 32);
	var laserMesh = new THREE.Mesh(laserGeo, laser_material);
	laser.add(laserMesh);
	laser.scale.set(15,15, 15);
	laser.position.set(-500,500,500);

	//add bounds
	ship_bound = new THREE.Box3();
	sun_bound = new THREE.Box3();
	moon_bound = new THREE.Box3();
	jupiter_bound = new THREE.Box3();
	laser_bound = new THREE.Box3();
	star_bound = new THREE.Box3();
	tattoin_bound = new THREE.Box3();
	redplanet_bound = new THREE.Box3();
	rain1_bound = new THREE.Box3();
	rain2_bound = new THREE.Box3();


	scene.add(_ship, sun, moon, jupiter, rain1, rain2, redplanet, tattoin, star, laser);
}

function init() {

	//dimensions of the canvas
	var canvasWidth = 800;
	var canvasHeight = 650;
	var canvasRatio = canvasWidth / canvasHeight;

	// RENDERER
	renderer = new THREE.WebGLRenderer( { antialias: true } );

	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.setSize(canvasWidth, canvasHeight);
	renderer.setClearColor( 0xAAAAAA, 1.0 );

	// CAMERA

	camera = new THREE.PerspectiveCamera( 75, canvasRatio, 1, 10000 );
	/**
	cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
	camera.position.set( 0, 25, -30 );
	cameraControls.target.set(0,0,0);
	**/

	//load the music
	listener = new THREE.AudioListener();
	audioLoader = new THREE.AudioLoader();
	sound1 = new THREE.Audio(listener);
	audioLoader.load('mac.mp3', function(buffer)
	{
		sound1.setBuffer(buffer);
		sound1.setLoop(true);
		sound1.setVolume(0.7);
		sound1.play();
	});
}

//render the gui and the canvas
function addToDOM() {
    var canvas = document.getElementById('canvas');
    canvas.appendChild(renderer.domElement);
}

//initialize step for the animation controls
var step = 3;

//animate
function animate() {

	//follow camera

	var relativeCameraOffset = new THREE.Vector3(0,-60,50);
	var cameraOffset = relativeCameraOffset.applyMatrix4( _ship.matrixWorld );
	camera.position.x = cameraOffset.x;
	camera.position.y = cameraOffset.y;
	camera.position.z = cameraOffset.z;
	camera.lookAt( _ship.position );

	//set the positions of the bounds and then check for intersection
	ship_bound.setFromObject(_ship);
	sun_bound.setFromObject(sun);
	moon_bound.setFromObject(moon);
	jupiter_bound.setFromObject(jupiter);
	rain1_bound.setFromObject(rain1);
	rain2_bound.setFromObject(rain2);
	redplanet_bound.setFromObject(redplanet);
	tattoin_bound.setFromObject(tattoin);
	star_bound.setFromObject(star);
	laser_bound.setFromObject(laser);

	//update the keyboard
	keyboard.update();

	//if W was pressed
	if(keyboard.pressed("W")) {

		//move forward in the local z direction of the object
		_ship.translateY(step);

		if(ship_bound.intersectsBox(sun_bound) ||
		ship_bound.intersectsBox(moon_bound) ||
		ship_bound.intersectsBox(jupiter_bound) ||
		ship_bound.intersectsBox(rain1_bound) ||
		ship_bound.intersectsBox(rain2_bound) ||
		ship_bound.intersectsBox(redplanet_bound) ||
		ship_bound.intersectsBox(tattoin_bound) ||
		ship_bound.intersectsBox(star_bound) ||
		ship_bound.intersectsBox(laser_bound))
		{
			var max = 5;
			var incr = 0;
			_ship.rotateOnAxis(zAxis, Math.PI)
			while( incr < max )
			{
				_ship.translateY(step);
				incr += 1;
			}
		}
	}

	//if "C" is pressed, rotate to the left around the yAxis
	else if(keyboard.pressed("A")) _ship.rotateOnAxis(zAxis, Math.PI / 36);

	//if "D" is pressed, rotate to the right around the yAxis
	else if(keyboard.pressed("D")) _ship.rotateOnAxis(zAxis, -Math.PI / 36);

	else if(keyboard.pressed("Q"))
  {
		_ship.translateZ(step/2);

		if(ship_bound.intersectsBox(sun_bound) ||
		ship_bound.intersectsBox(moon_bound) ||
		ship_bound.intersectsBox(jupiter_bound) ||
		ship_bound.intersectsBox(rain1_bound) ||
		ship_bound.intersectsBox(rain2_bound) ||
		ship_bound.intersectsBox(redplanet_bound) ||
		ship_bound.intersectsBox(tattoin_bound) ||
		ship_bound.intersectsBox(star_bound) ||
		ship_bound.intersectsBox(laser_bound))
		{
			var max = 5;
			var incr = 0;
			while( incr < max )
			{
				_ship.translateZ(-step);
				incr += 1;
			}
		}
  }
	else if(keyboard.pressed("E"))
	{
		_ship.translateZ(-step/2);

		if(ship_bound.intersectsBox(sun_bound) ||
		ship_bound.intersectsBox(moon_bound) ||
		ship_bound.intersectsBox(jupiter_bound) ||
		ship_bound.intersectsBox(rain1_bound) ||
		ship_bound.intersectsBox(rain2_bound) ||
		ship_bound.intersectsBox(redplanet_bound) ||
		ship_bound.intersectsBox(tattoin_bound) ||
		ship_bound.intersectsBox(star_bound) ||
		ship_bound.intersectsBox(laser_bound))
		{
			var max = 5;
			var incr = 0;
			while( incr < max )
			{
				_ship.translateZ(step);
				incr += 1;
			}
		}
	}

	else if(keyboard.pressed("Z")) _ship.rotateOnAxis(xAxis, -Math.PI/72);
	else if(keyboard.pressed("X")) _ship.rotateOnAxis(xAxis, Math.PI/72)
	else if(keyboard.pressed("S")) _ship.rotateOnAxis(yAxis, Math.PI/72)

	//update the keyboard after
	keyboard.update();

	//animate and call the render loop
	window.requestAnimationFrame(animate);
	render();
}

//render
function render() {

	//update camerControls, the keyboard, and get change in time
	var delta = clock.getDelta();

	//cameraControls.update(delta);
	keyboard.update();

	//render the scene
	renderer.render(scene, camera);
}

//execute
try {
  init();
  fillScene();
  addToDOM();
  animate();
} catch(error) {
    console.log("Your program encountered an unrecoverable error, can not draw on canvas. Error was:");
    console.log(error);
}
