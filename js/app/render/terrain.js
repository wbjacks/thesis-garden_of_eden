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
    length: 50,
    height: 50,
    resolution: 1,
    // This could almost certainly be more OO- have a "map" parameter?
    // have the object represent the actual mesh?
    build: function(scene, camera) {
        var height_array = [];
        var sub_square = [];
        this.mpd(height_array, 0, 10, sub_square);
        height_array = [].concat.apply([], height_array);
        console.log(height_array);


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

    },
    // geometry is the entire map
    // curr_depth is the current depth
    // max_depth is the maximum depth (-1 for until end)
    // square is an array of indices
    mpd: function(geometry, curr_depth, max_depth, square) {
        // Check depth
        // BASE CASE
        if (curr_depth == max_depth)
            return;

        // Check initial case (render geometry)
        if (curr_depth == 0) {
            // Create geometry
            for (var i = 0; i < this.length * this.resolution; i++) {
                geometry[i] = [];
                for (var j = 0; j < this.height * this.resolution; j++)
                    geometry[i][j] = 0;

            }
            square = [[0,0], [this.length-1, 0], [0, this.height-1]];

        }

        // Recursive case
        // If this could be done mathematically and then mapped to an array,
        //  it would probably be much faster and definitely be prettier
        // Find midpoint of given square, recurse on new squares
        // If square is oriented perpendicular to axis
        midpoint = [Math.floor(0.5*(square[1][0]+square[2][0])),
                    Math.floor(0.5*(square[1][1]+square[2][1]))];
        //console.log("Midpoint is " + midpoint);
        // Look into other things to add other than Math.random();
        geometry[midpoint[0]][midpoint[1]] += 0.5-Math.random();
        // Generate new squares, oriented starting at center and going ccw
        var new_sq = []; 
        new_sq[0] = [midpoint, square[0], square[1]];
        new_sq[1] = [midpoint, square[1], [square[1][0], square[2][1]]];
        new_sq[2] = [midpoint, [square[1][0], square[2][1]], square[2]];
        new_sq[3] = [midpoint, square[2], square[0]];


        // Launch recursion
        for (var i = 0; i < 4; i++)
            this.mpd(geometry, curr_depth+1, max_depth, new_sq[i]);

    }
};
