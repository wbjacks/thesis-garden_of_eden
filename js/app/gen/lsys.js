// Generates a unique l-system tree for a given rule dictionary

function LSystem(rd, iv) {
     // Construct
    var rules = rd;
    var seed = 0; // Generate random seed 
    var l_string = iv;
    var MAX_DEPTH = 20; //idk

}

LSystem.prototype.LSrecurse = function(depth) {
    // Base case is depth
    if (depth == MAX_DEPTH) return;

    // Recursive case: run a single pass of the string
    // TODO This could totes be more recursive
    for (var i = 0; i < l_string.length; i++) {
        // check l_string[i]
        // if match, replace

    }
};

LSystem.prototype.launcher = function() {
    // Run recursion
    this.seed = LSrecurse(0);

};
