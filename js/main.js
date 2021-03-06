// Main file, calls rendering (which build the scene from called generation
// scripts) and runs the scene through the render() function
//
// TODO:
//  + Finish terrain
//  + Finish trees
//  + Add user controls (in another module?)

// GLOBALS
var ray, controls, terrain, renderer, scene, camera, last_time, tree_material;
var CAMERA_HEIGHT = 2;
var loader = new THREE.BufferGeometryLoader();

// Render func
function render(forest) {
    requestAnimationFrame(render);
    renderer.render(scene, camera);

    var time = performance.now();

    // Check if on an object
    ray.ray.origin.copy(controls.getObject().position);

    // ray works but check pointerlock source for isOnObject and compare to FPC

    var intersections = ray.intersectObject(terrain.plane);

    // Disables jump
    controls.isOnObject(true);
    if ( intersections.length > 0 ) {
        var distance = intersections[0].distance;
        var pos = controls.getObject().position;
        pos.setY(pos.y + (CAMERA_HEIGHT - distance));

    }

    controls.update(time-last_time, 0.2);
    last_time = time;

}

// To do: move this to forest worker?
function init() {
    // Use three.js to initialize scene, camera, and renderer...
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75,
        window.innerWidth / window.innerHeight, 0.1, 10000);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    // Add light
    var light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(0,800,0);
    scene.add(light);

    // Add fog
    scene.fog = new THREE.FogExp2(0x658ab1, 0.03);

    // Add axis
    //scene.add(new THREE.AxisHelper(10));

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

    var skybox_mesh = new THREE.Mesh(
        new THREE.CubeGeometry(10000, 10000, 10000), skybox_mat);

    scene.add(skybox_mesh);

    // Construct terrain
    terrain = new Terrain(7);
    terrain.build();
    scene.add(terrain.plane);

    // Plant trees and set tree material
    var species = new RandomTree();
    var forest = new Forest(terrain);
    forest.addSpecies(species);
    forest.plant();
    tree_material = new THREE.MeshLambertMaterial({
        color: 0x996633,
        ambient: 0x666633,

    });

    // Add controls
    controls = new THREE.PointerLockControls(camera);
    //var controls = new THREE.OrbitControls(camera);
    var control_obj = controls.getObject();
    control_obj.position.y = 10;
    scene.add(control_obj);

    last_time = performance.now();

    ray = new THREE.Raycaster();
    ray.ray.direction.set(0, -1, 0);
    ray.near = 0.1;
    ray.far = 1000;

    return forest;

}

// Handle document stuff
function onWindowResize() {
    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}
window.addEventListener( 'resize', onWindowResize, false );

// GOOOOOO
/*
window.onload = function() {
    init();
    //document.getElementById("loader").remove();
    render();
}
*/
var forest = init();
// Launch growers
var manager = new Worker('js/app/worker/forest_manager.js');
// TODO: Use shared workers created here instead of subworkers to have chrome compatability
manager.postMessage({
    msg: 'INIT',
    payload: {seeds: forest.seeds, num_workers: 3}
});
// Add geometry to scene
manager.onmessage = function(pkg) {
    // Build mesh
    var geo = loader.parse(JSON.parse(pkg.data.geometry).data);
    var mesh = new THREE.Mesh(geo, tree_material);
    scene.add(mesh);

};
render();
