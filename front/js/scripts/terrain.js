// Scripts generates and renders topography using MPD and brownian noise
// TODO:
//  + Move render function to its own file
//  + Figure out how to properly pass stuff between scripts
//  + Figure out how I want to represent terrain data- array of elevations?
//      grayscale image heightmap? Currently using test_height.json
//
//  REFERENCES:
//  http://blog.thematicmapping.org/2013/10/terrain-building-with-threejs.html

// Render func
function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);

}

// Constants
var MAP_LENGTH = 100;
var MAP_HEIGHT = 100;
var MAP_RESOLUTION = 1; // length units per square (or triangle pair)

// Test files...
//var height_array = require('./test_height.json');
// Hack ew
var height_array = [];
for (var i = 0; i < 10000; i++) {
    height_array[i] = Math.floor(Math.random()*11);

}

// Construct scene, camera, and renderer
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75,
    window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 50;
camera.position.y = -100;
camera.lookAt(new THREE.Vector3(0,0,0));
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Geometry for floor is a plane with specified resolution
var map_geometry = new THREE.PlaneGeometry(MAP_HEIGHT, MAP_LENGTH,
        (MAP_HEIGHT-1) / MAP_RESOLUTION, (MAP_LENGTH-1) / MAP_RESOLUTION);
map_geometry.computeFaceNormals();
map_geometry.computeVertexNormals();


// Add height data to geometry
var i;
for (i = 0; i < map_geometry.vertices.length; i++) {
    map_geometry.vertices[i].z = height_array[i];

}

// Build material
var material = new THREE.MeshPhongMaterial({
      color: 0xdddddd, 
      wireframe: true
});

// Construct plane and add to scene
var plane = new THREE.Mesh(map_geometry, material);
plane.castShadow = true;
plane.reveiveShadow = true;
scene.add(plane);

// Add lights
scene.add(new THREE.AmbientLight(0x111111));

var light = new THREE.DirectionalLight(0xffffff, 1);
light.shadowCameraVisible = true;
light.position.set(0,300,100);
scene.add(light);

// Render
render();
