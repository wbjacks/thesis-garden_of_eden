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
    var max_depth = 1;
    // Requires species to be set
    var L = Math.pow(this.species[0].consts.L_R, max_depth);
    var canopy_width = Math.ceil(2 * max_depth * L * Math.sin(
        this.species[0].consts.A));
    var num_patches = Math.ceil(this.geography_length / canopy_width);
    var patch_size = Math.ceil(this.geography_length / num_patches);
    console.debug("Patch width is " + canopy_width + ", giving "
        + num_patches + " patches of size " + patch_size + " for "
        + Math.pow(num_patches, 2) + " total patches.");

    // Loop through patches
    for (var i = 0; i < num_patches; i++) {
        for (var j = 0; j < num_patches; j++) {
            // Place canopy tree
            var x = (j*patch_size + patch_size*Math.random()) -
                Math.floor(this.geography_length/2);
            var z = Math.floor(this.geography_length/2) - (i*patch_size +
                patch_size*Math.random());
            var y = this.geography.drop(x,z);

            this.seeds.push({x: x, z: z, y: y});
            console.debug("Tree #" + this.seeds.length
                + " added at (" + x + ", " + z + ")");

        }
    }
};

Forest.prototype.build = function() {
    this.plant();
    this.grow();

};
