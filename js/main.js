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
    renderer.render(scene, camera);
    controls.update();

}

// Use three.js to initialize scene, camera, and renderer...
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75,
    window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 50;
camera.position.y = -100;
camera.lookAt(new THREE.Vector3(0,0,0));
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Construct terrain
Terrain.build(scene, camera);

// Add controls
controls = new THREE.OrbitControls(camera);


// Render
render();
