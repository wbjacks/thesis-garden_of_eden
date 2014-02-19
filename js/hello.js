// Render func
function render() {
    requestAnimationFrame(render);

    // Doood this cube moves
    cube.rotation.x += 0.05;
    cube.rotation.y += 0.05;
    renderer.render(scene, camera);

}

// Construct scene, camera, and renderer
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75,
    window.innerWidth / window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// HELLO IS A CUBE GUYS BUILD IT HERE
var geometry = new THREE.CubeGeometry(50,50,50);
var material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

// Add light
var light = new THREE.PointLight(0xFFFFFF);
light.position.x = 10;
light.position.y = 30;
light.position.z = 120;
scene.add(light);

camera.position.z = 300;

// Render
render();
