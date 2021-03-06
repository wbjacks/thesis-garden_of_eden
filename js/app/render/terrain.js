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
    this.resolution = resolution || 1;
    this.H = 1;
    this.MAX_HEIGHT = 2*(this.length / 6);
    this.MIN_HEIGHT = 0;
    this.OFFSET_WIDTH = this.MAX_HEIGHT - this.MIN_HEIGHT;
    this.plane = null; // Alternatively, extend Object3D

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
                // i = 0 add n
                // j = 0 add w
                // else s and e
                // Centers is a list of diamond centers to be affected for this
                // i/j square
                var centers = [
                    [i+quad_length, j+middle],
                    [i+middle, j+quad_length]
                ]
                if (i == 0) centers.push([i, j+middle]); 
                if (j == 0) centers.push([i+middle, j]);

                // Modulate centers
                for (var c = 0; c < centers.length; c++) {
                    var ci = centers[c][0];
                    var cj = centers[c][1];
                    var rand_offset = ((0.5*this.OFFSET_WIDTH) -
                        this.OFFSET_WIDTH*Math.random()) * scale;

                    // Calculate lerp, accounting for index out of bounds
                    var lerp = geometry[ci][cj-middle] || 0; // w
                    lerp += geometry[ci][cj+middle] || 0; // e
                    if (geometry[ci+middle] != null)
                        lerp += geometry[ci+middle][cj]; // n
                    if (geometry[ci-middle] != null)
                        lerp += geometry[ci-middle][cj]; // s
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

Terrain.prototype.smooth = function(geometry) {
    // Construct kernel
    var kernel = function(sigma) {
        // Gaussian filter
        var ret = [];
        var size = Math.floor(sigma*3); // from NVidia implementation
        for (var i = 0; i < size; i++) {
            ret[i] = [];
            for (var j = 0; j < size; j++) {
                var x = j - Math.floor(size/2);
                var y = Math.floor(size/2) - i;
                ret[i][j] = (1 / (2*Math.PI*sigma*sigma)) *
                    Math.exp(-(x*x + y*y)/(2*sigma*sigma));

            }
        }
        return ret;

    }

    var apply = function(i, j, k, g) {
        // Won't hit edges
        if (i - Math.floor(k.length / 2) >= 0
            && i + Math.floor(k.length / 2) <= g.length - 1
            && j - Math.floor(k.length / 2) >= 0
            && j + Math.floor(k.length / 2) <= g.length - 1)
        {
            sum = 0;
            for (var ii = 0; ii < k.length; ii++) {
                for (var jj = 0; jj < k.length; jj++) {
                    var yy = Math.floor(k.length / 2) - ii;
                    var xx = jj - Math.floor(k.length / 2);
                    sum += g[i+xx][j+yy] * k[ii][jj];

                }
            }
            g[i][j] = sum;// / k.length*k.length;

        }
    }
    
    var k = kernel(1);
    for (var i = 0; i < geometry.length; i++) {
        for (var j = 0; j < geometry.length; j++) {
            apply(i,j,k,geometry);

        }
    }

    // Set edges
    for (var i = 0; i < geometry.length; i++) {
        for (var j = 0; j < geometry.length; j++) {
            if (i >= 1 && i < (geometry.length - 1) && j != 0 && j != geometry.length-1)
                continue;

            // Sides
            if (i > 0 && i < geometry.length-1) {
                if (j == 0) geometry[i][j] = geometry[i][j+1];
                if (j == geometry.length-1) geometry[i][j] = geometry[i][j-1];

            }

            // Top / bottom
            if (i == 0) geometry[i][j] = geometry[i+1][j];
            if (i == geometry.length-1) geometry[i][j] = geometry[i-1][j];

        }
    }
}

Terrain.prototype.build = function() {
    var height_array = this.mpd();
    this.smooth(height_array);
    height_array = [].concat.apply([], height_array);

    // Geometry for floor is a plane with specified resolution
    var map_geometry = new THREE.PlaneBufferGeometry(
            this.height,
            this.length,
            (this.height - 1) * this.resolution,
            (this.length - 1) * this.resolution);

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
        color: 0x457D0E,
        ambient: 0x666633,
        //wireframe: true
    });

    // Construct plane and add to scene
    this.plane = new THREE.Mesh(map_geometry, material);
    this.plane.doubleSided = true;

};

// Find height at coordinates
Terrain.prototype.drop = function(x, z) {
    if (this.plane == null) console.error("ERROR: Must have terrain constructed");

    var rc = new THREE.Raycaster();
    rc.far = 1000;
    // Move tree up high
    rc.set(new THREE.Vector3(x, 100, z), new THREE.Vector3(0, -1, 0));

    // Find distance and set
    var intersect = rc.intersectObject(this.plane, true);
    return intersect.length > 0 ? 100 - intersect[0].distance : 0

};
