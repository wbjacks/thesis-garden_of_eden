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
    this.ROUGHNESS = 100;
    this.H = 0.7;
    this.MAX_HEIGHT = 50;
    this.MIN_HEIGHT = -50;

};

// geometry is the entire map
// curr_depth is the current depth
// max_depth is the maximum depth (-1 for until end)
// square is an array of indices
// From wikipedia: Diamond square algorithm
// Constants added from me
Terrain.prototype.mpd = function(geometry, curr_depth, max_depth, square) {
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
        // Create initial square
        square = [[0,0], [this.length-1, 0], [0, this.height-1],
            [this.length-1, this.height-1]];

        // Set outside square to random height
        geometry[0][0] = this.MIN_HEIGHT +
            (this.MAX_HEIGHT-this.MIN_HEIGHT)*Math.random();
        geometry[this.length-1][0] = this.MIN_HEIGHT +
            (this.MAX_HEIGHT-this.MIN_HEIGHT)*Math.random();
        geometry[0][this.height-1] = this.MIN_HEIGHT +
            (this.MAX_HEIGHT-this.MIN_HEIGHT)*Math.random();
        geometry[this.length-1][this.height-1] = this.MIN_HEIGHT +
            (this.MAX_HEIGHT-this.MIN_HEIGHT)*Math.random();

    }

    // Recursive case
    // If this could be done mathematically and then mapped to an array,
    //  it would probably be much faster and definitely be prettier
    // Find midpoint of given square, recurse on new squares
    // If square is oriented perpendicular to axis
    dx = Math.floor(0.5*(square[1][0] - square[0][0]));
    dy = Math.floor(0.5*(square[2][1] - square[0][1]));

    // Generate new squares, oriented starting at center and going ccw
    var new_sq = [];
    new_sq[0] = [square[0],
                [square[0][0]+dx, square[0][1]],
                [square[0][0], square[0][1]+dy],
                [square[0][0]+dx, square[0][1]+dy]];
    new_sq[1] = [[square[0][0]+dx, square[0][1]],
                square[1],
                [square[0][0]+dx, square[0][1]+dy],
                [square[1][0], square[0][1]+dy]];
    new_sq[2] = [[square[0][0], square[0][1]+dy],
                [square[0][0]+dx, square[0][1]+dy],
                square[2],
                [square[0][0]+dx, square[2][1]]];
    new_sq[3] = [[square[0][0]+dx, square[0][1]+dy],
                [square[1][0], square[0][1]+dy],
                [square[0][0]+dx, square[2][1]],
                square[3]];

    // Set geometry with linear interpolation
    // North
    geometry[new_sq[0][1][0]][new_sq[0][1][1]] =
        0.5*(geometry[square[1][0]][square[1][1]] +
        geometry[square[0][0]][square[0][1]]);

    // West
    geometry[new_sq[0][2][0]][new_sq[0][2][1]] =
        0.5*(geometry[square[0][0]][square[0][1]] +
        geometry[square[2][0]][square[2][1]]);

    // East
    geometry[new_sq[1][3][0]][new_sq[1][3][1]] =
        0.5*(geometry[square[1][0]][square[1][1]] +
        geometry[square[3][0]][square[3][1]]);

    // South
    geometry[new_sq[2][3][0]][new_sq[2][3][1]] =
        0.5*(geometry[square[2][0]][square[2][1]] +
        geometry[square[3][0]][square[3][1]]);

    // Center- play with random factor!
    var offset = randomNormal() * this.ROUGHNESS *
        Math.pow(2, -this.H * curr_depth);
    offset = 0.5 - offset;
    //var offset = randomNormal() * this.ROUGHNESS *
    //    Math.pow(2, -this.H * curr_depth);
    geometry[new_sq[0][3][0]][new_sq[0][3][1]] =
        0.25*(geometry[square[0][0]][square[0][1]] +
        geometry[square[1][0]][square[1][1]] +
        geometry[square[2][0]][square[2][1]] +
        geometry[square[3][0]][square[3][1]] +
        offset);

    // Launch recursion
    for (var i = 0; i < 4; i++)
        this.mpd(geometry, curr_depth+1, max_depth, new_sq[i]);

}

Terrain.prototype.build = function() {
    var height_array = [];
    var sub_square = [];
    this.mpd(height_array, 0, 8, sub_square);
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
