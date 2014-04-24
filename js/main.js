// Main file, calls rendering (which build the scene from called generation
// scripts) and runs the scene through the render() function
//
// TODO:
//  + Finish terrain
//  + Finish trees
//  + Add user controls (in another module?)

// Render func
function render() {
    requestAnimationFrame(render);
    //renderer.render(sky, sky_cam);
    renderer.render(scene, camera);

    var time = performance.now();

    // Check if on an object
    controls.isOnObject(false);
    ray.ray.origin.copy(controls.getObject().position);
    ray.ray.origin.y -= 7;

    // ray works but check pointerlock source for isOnObject and compare to FPC

    var intersections = ray.intersectObject(floor);

    if ( intersections.length > 0 ) {
        var distance = intersections[0].distance;
        if (distance > 0 && distance <= CAMERA_HEIGHT) {
            controls.isOnObject(true);
            var pos = controls.getObject().position;
            pos.setY(pos.y + (CAMERA_HEIGHT - distance));

        }
    }
    controls.update(time-lastTime);
    lastTime = time;

}

var CAMERA_HEIGHT = 10;


// Use three.js to initialize scene, camera, and renderer...
var scene = new THREE.Scene();
//var sky = new THREE.Scene(); // honestly not sure why I need this
var camera = new THREE.PerspectiveCamera(75,
    window.innerWidth / window.innerHeight, 0.1, 10000);
//camera.position.set(100,100,-100);
//camera.lookAt(new THREE.Vector3(Terrain.length/2, Terrain.height/2,0));
/*
var sky_cam = new THREE.PerspectiveCamera( 75,
    window.innerWidth / window.innerHeight, 0.1, 10000);
*/

var axis = new THREE.AxisHelper(20);
scene.add(axis);

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Add light
//var light = new THREE.AmbientLight(0xffffff);
//scene.add(light);
var light = new THREE.DirectionalLight(0xffffff, 0.5);
light.position.set(0,800,0);
scene.add(light);

// Add fog
//scene.fog = new THREE.FogExp2(0x996633, 0.008);

// Generate Skybox
var urls = [
    'img/sky/px.png',
    'img/sky/nx.png',
    'img/sky/py.png',
    'img/sky/ny.png',
    'img/sky/pz.png',
    'img/sky/nz.png'

];

var sky_map = THREE.ImageUtils.loadTextureCube(urls);
sky_map.format = THREE.RGBFormat;

var sky_shader = THREE.ShaderLib['cube'];
sky_shader.uniforms['tCube'].value = sky_map;

var skybox_mat = new THREE.ShaderMaterial({
    fragmentShader: sky_shader.fragmentShader,
    vertexShader: sky_shader.vertexShader,
    uniforms: sky_shader.uniforms,
    depthWrite: true,
    side: THREE.BackSide

});

var skybox_mesh = new THREE.Mesh(new THREE.CubeGeometry(10000, 10000, 10000), skybox_mat);

scene.add(skybox_mesh);

// Construct terrain
var terrain = new Terrain(5);
var floor = terrain.build();
scene.add(floor);

// Add controls
var controls = new THREE.PointerLockControls(camera);
//var controls = new THREE.OrbitControls(camera);
var control_obj = controls.getObject();
control_obj.position.y = 50;
scene.add(control_obj);

var lastTime = performance.now();

ray = new THREE.Raycaster();
ray.ray.direction.set(0, -1, 0);
ray.near = 1;
ray.far = 100;

// Render
render();
