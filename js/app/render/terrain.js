// Scripts generates and renders topography using MPD and brownian noise
//
//  REFERENCES:
//  http://blog.thematicmapping.org/2013/10/terrain-building-with-threejs.html
//
// TODO:
//  + Improve module, as it is not very OO
//  + Switched from Require.js, but kept in this weird module-type coding where
//  files basically just give you objects. We'll see if it works out; if not,
//  I'll probably just use the weird bootstrapped Require.js
var Terrain = {
    length: 100,
    height: 100,
    resolution: 1,
    // This could almost certainly be more OO- have a "map" parameter?
    // have the object represent the actual mesh?
    build: function(scene, camera) {
        var height_array = [];
        for (var i = 0; i < 10000; i++) {
            height_array[i] = Math.floor(Math.random()*11);

        }

        // Geometry for floor is a plane with specified resolution
        var map_geometry = new THREE.PlaneGeometry(
                this.height,
                this.length,
                (this.height-1) / this.resolution,
                (this.length-1) / this.resolution);

        // terrain_gen.mpd(map_geometry);
        map_geometry.computeFaceNormals();
        map_geometry.computeVertexNormals();


        // Add height data to geometry
        for (var i = 0; i < map_geometry.vertices.length; i++) {
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

    }
};
