// Controller for generating forest over specified landscape. Allows for
// ecosystem control wrt random variation of tree growth

// Goes through cycles

// Seed- placement, manages:
//  + density management -> modification of closest pair algo?
//      get closest pair list within density length
//      use bell curve pobabability to filter
//      miiight be nlogn
//  + gradation detection
//  + global tropism

// Grow- might need to background, as this will run the L-System production
function Forest(geography) {
    this.geography = geography; // Terrain object
    this.geography_length = geography.length;
    this.seeds = [];
    this.species = [];

};

Forest.prototype.addSpecies = function(lsys) {
    this.species.push(lsys);

}

Forest.prototype.plant = function() {
    // Calcuate
    var max_depth = 8;
    // Requires species to be set
    var L = Math.pow(this.species[0].consts.L_R, max_depth);
    var canopy_width = Math.ceil(2 * max_depth * L * Math.sin(
        this.species[0].consts.A));
    var num_patches = Math.ceil(this.geography_length / canopy_width);
    var patch_size = Math.ceil(this.geography_length / num_patches);
    console.debug("Patch width is " + canopy_width + ", giving "
        + num_patches + " patches of size " + patch_size + " for "
        + Math.pow(num_patches, 2) + " total patches.");

    // Refactor: Move this to LSYS worker
    // For tree generation
    /*
    var tree_material = new THREE.MeshLambertMaterial({
        color: 0x996633,
        ambient: 0x666633,

    });
    */

    // Loop through patches
    for (var i = 0; i < num_patches; i++) {
        for (var j = 0; j < num_patches; j++) {
            // Place canopy tree
            var x = (j*patch_size + patch_size*Math.random()) -
                Math.floor(this.geography_length/2);
            var z = Math.floor(this.geography_length/2) - (i*patch_size +
                patch_size*Math.random());

            // Refactor: Move to LSYS worker
            /*
            var t = new Turtle(this.scene, tree_material, 0.25);
            var lsys = new LSystem(this.species[0]);
            lsys.MAX_DEPTH = max_depth;
            t.position.setX(x);
            t.position.setZ(z);
            */

            // Refactor: Run drop here to calculate y position

            this.seeds.push({x: x, z: z});
            console.debug("Tree #" + this.seeds.length
                + " added at (" + x + ", " + z + ")");

        }
    }
};

// Refactor: The below "grow" functions to be implemented in the LSYS worker
/*
Forest.prototype.growAll = function() {
    // Loop through trees
    var tree_num = 1;
    while (this.trees.length > 0) {
        this.growOne(tree_num++);

    }
};

Forest.prototype.growOne = function(tree_num, seed) {
    if (this.trees.length != 0) {
        var tree = seed ? seed : this.trees.pop();

        // Grow tree- MOVE OUT TO WORKERS
        //tree.lsys.build();
        //tree.turtle.run(tree.lsys.system);
        //tree.turtle.drop(this.geography.plane);
        console.log("Tree #" + tree_num++ + " grown!");

    }
    else {
        console.warn("WARNING: Grow attempted with no trees");

    }
}
*/

Forest.prototype.build = function() {
    this.plant();
    this.grow();

};
