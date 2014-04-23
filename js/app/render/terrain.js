// Scripts generates and renders topography using MPD and brownian noise
//
//  REFERENCES:
//  http://blog.thematicmapping.org/2013/10/terrain-building-with-threejs.html
//  http://www.gameprogrammer.com/fractal.html#diamond

// From http://rosettacode.org/wiki/Random_numbers#JavaScript
function randomNormal() {
  return Math.cos(2 * Math.PI * Math.random()) * Math.sqrt(-2 * Math.log(Math.random()))
}

function Terrain(size_degree, resolution) {
    this.length = Math.pow(2, size_degree)+1 || 257;
    this.height = Math.pow(2, size_degree)+1 || 257;
    this.resolution = 1;
    this.H = 0.8;
    this.MAX_HEIGHT = this.length / 6;
    this.MIN_HEIGHT = -this.MAX_HEIGHT;
    this.OFFSET_WIDTH = this.MAX_HEIGHT - this.MIN_HEIGHT;

};

// geometry is the entire map
// curr_depth is the current depth
// max_depth is the maximum depth (-1 for until end)
// square is an array of indices
// From wikipedia: Diamond square algorithm
// Constants added from me
Terrain.prototype.mpd = function() {
    // Create geometry
    var geometry = [];
    for (var i = 0; i < this.length * this.resolution; i++) {
        geometry[i] = [];
        for (var j = 0; j < this.height * this.resolution; j++)
            geometry[i][j] = 0;

    }

    // Seed geometry
    geometry[0][0] = this.MIN_HEIGHT +
        (this.MAX_HEIGHT-this.MIN_HEIGHT)*Math.random();
    geometry[this.length-1][0] = this.MIN_HEIGHT +
        (this.MAX_HEIGHT-this.MIN_HEIGHT)*Math.random();
    geometry[0][this.height-1] = this.MIN_HEIGHT +
        (this.MAX_HEIGHT-this.MIN_HEIGHT)*Math.random();
    geometry[this.length-1][this.height-1] = this.MIN_HEIGHT +
        (this.MAX_HEIGHT-this.MIN_HEIGHT)*Math.random();

    // Initial length and offset scale
    var quad_length = this.length;
    var scale = 1;

    // Main loop- recommended instead of recursion
    for (var quad_length = this.length-1;
            quad_length > 1; quad_length = Math.floor(quad_length/2))
    {
        // Square step
        var middle = Math.floor(quad_length/2)
        for (var i = 0; i < this.height-1; i += quad_length) {
            for (var j = 0; j < this.length-1; j += quad_length) {
                var rand_offset = ((0.5*this.OFFSET_WIDTH) -
                    this.OFFSET_WIDTH*Math.random()) * scale;
                var lerp = 0.25 * (geometry[i][j] +
                    geometry[i+quad_length][j] +
                    geometry[i][j+quad_length] +
                    geometry[i+quad_length][j+quad_length]);
                geometry[i+middle][j+middle] += lerp+rand_offset;

            }
        }
        // Diamond step: For each previous midpoint calculated, offset by lerp
        // of surrounding diamond and random offset
        for (var i = 0; i < this.height-1; i += quad_length) {
            for (var j = 0; j < this.length-1; j += quad_length) {
                // For every previous midpoint, there exists 4 diamonds
                // i = 0 add w
                // j = 0 add n
                // else s and e
                // Centers is a list of diamond centers to be affected for this
                // i/j square
                var centers = [
                    [i+quad_length, j+middle],
                    [i+middle, j+quad_length]
                ]
                if (i == 0) centers.concat([i, j+middle]);
                if (j == 0) centers.concat([i+middle, j]);

                // Modulate centers
                for (var c = 0; c < centers.length; c++) {
                    var ci = centers[c][0];
                    var cj = centers[c][1];
                    var rand_offset = ((0.5*this.OFFSET_WIDTH) -
                        this.OFFSET_WIDTH*Math.random()) * scale;

                    // Calculate lerp, accounting for index out of bounds
                    var lerp = geometry[ci][cj-middle] || 0; // n
                    lerp += geometry[ci][cj+middle] || 0; // s
                    if (geometry[ci+middle] != null) lerp += geometry[ci+middle][cj]; // e
                    if (geometry[c-+middle] != null) lerp += geometry[ci-middle][cj]; // w
                    lerp *= 0.25;

                    geometry[ci][cj] += lerp+rand_offset;

                }
            }
        }
        // Reduce random value
        scale *= Math.pow(2, -this.H);

    }
    return geometry;

}

Terrain.prototype.build = function() {
    var height_array = this.mpd();
    height_array = [].concat.apply([], height_array);

    // Geometry for floor is a plane with specified resolution
    var map_geometry = new THREE.PlaneGeometry(
            this.height,
            this.length,
            (this.height-1) / this.resolution,
            (this.length-1) / this.resolution);

    // Rotate...
    map_geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

    // Add height data to geometry
    for (var i = 0; i < map_geometry.vertices.length; i++) {
        map_geometry.vertices[i].y = height_array[i];

    }
    map_geometry.computeFaceNormals();
    map_geometry.computeVertexNormals();

    // Build material
    var material = new THREE.MeshLambertMaterial({
        color: 0x996633,
        ambient: 0x666633,
        //wireframe: true
    });

    // Construct plane and add to scene
    var plane = new THREE.Mesh(map_geometry, material);
    plane.doubleSided = true;

    return plane;

};
