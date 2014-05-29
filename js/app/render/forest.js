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
function Forest(geography, scene) {
    this.geography = geography; // Terrain object
    this.species = [];
    this.trees = [];
    this.scene = scene;

};

Forest.prototype.addSpecies = function(lsys) {
    this.species.push(lsys);

};

Forest.prototype.plant = function() {
    // Calcuate
    var tree = this.species[0];
    var max_depth = 8;
    var L = Math.pow(tree.consts.L_R, max_depth);
    var canopy_width = Math.ceil(2 * max_depth * L * Math.sin(tree.consts.A));
    var num_patches = Math.ceil(this.geography.length / canopy_width);
    var patch_size = Math.ceil(this.geography.length / num_patches);
    console.debug("Patch width is " + canopy_width + ", giving "
        + num_patches + " patches of size " + patch_size + " for "
        + Math.pow(num_patches, 2) + " total patches.");

    // For tree generation
    var tree_material = new THREE.MeshLambertMaterial({
        color: 0x996633,
        ambient: 0x666633,

    });

    // Loop through patches
    for (var i = 0; i < num_patches; i++) {
        for (var j = 0; j < num_patches; j++) {
            // Place canopy tree
            var x = (j*patch_size + patch_size*Math.random()) -
                Math.floor(this.geography.length/2);
            var z = Math.floor(this.geography.length/2) - (i*patch_size +
                patch_size*Math.random());
            var t = new Turtle(this.scene, tree_material, 0.25);
            var lsys = new LSystem(this.species[0]);
            lsys.MAX_DEPTH = max_depth;
            t.position.setX(x);
            t.position.setZ(z);

            this.trees.push({turtle: t, lsys: lsys});
            console.log("Tree #" + this.trees.length
                + " added at (" + x + ", " + z + ")");

        }
    }
};

Forest.prototype.grow = function() {
    // Empty species because memory (curse you garbage collect!!!)
    this.species = null;

    // Loop through trees
    var tree_num = 1;
    while (this.trees.length > 0) {
        var tree = this.trees.pop();

        // Grow tree
        tree.lsys.build();
        tree.turtle.run(tree.lsys.system);
        tree.turtle.drop(this.geography.plane);
        console.log("Tree #" + tree_num++ + " grown!");

    }
};

Forest.prototype.build = function() {
    this.plant();
    this.grow();

};
