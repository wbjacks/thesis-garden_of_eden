// Main file, calls rendering (which build the scene from called generation
// scripts) and runs the scene through the render() function
//
// TODO:
//  + Finish terrain
//  + Finish trees
//  + Add user controls (in another module?)

// GLOBALS
var ray, controls, terrain, renderer, scene, camera, last_time;
var CAMERA_HEIGHT = 2;

// Render func
function render() {
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
    scene.add(new THREE.AxisHelper(10));

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
    terrain = new Terrain(5);
    terrain.build();
    scene.add(terrain.plane);

    // Add tree
    var tree = new RandomTree();
    var forest = new Forest(terrain, scene);
    forest.addSpecies(tree);
    forest.build();

    /*
        var material = new THREE.MeshLambertMaterial({
            color: 0x996633,
            ambient: 0x666633,

        });
        var t = new Turtle(scene, material, 0.25);
        var tree = new RandomTree();
        var lsys = new LSystem(tree);
        lsys.MAX_DEPTH = 7; // limit depth
        // Run tutle
        lsys.build();
        t.run(lsys.system);
        t.drop(terrain.plane);
    */

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
init();
render();
