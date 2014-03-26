// Generates a unique l-system tree for a given rule dictionary

function LSystem(rd, iv) {
     // Construct
    var rules = rd;
    var seed = 0; // Generate random seed 
    var system = null;
    var l_string = iv;
    var MAX_DEPTH = 20; //idk

}

function Production(id, args) {
    this.id = id; // Production ID
    this.args = args; // Parametric term

}

function Rule(id, condition, output) {
    this.id = id; // ID corresponding to the production this affects
    this.condition = condition; // Condition on the parametric term
    this.output = output; // If applied, what to replace with

}

LSystem.prototype.LSRecurse = function(str, depth) {
    // Base case is depth
    // TODO: Check if action?
    if (depth == MAX_DEPTH) return;

    var stack = [];
    // Recursive case: run a single pass of the string
    // TODO This could totes be more recursive
    var pt = 0;
    for (var i = 0; i < l_string.length; i++) {
        // TODO: Roll out the loop
        var ret;
        ret = this.LSRecurse(this.checkRule(str[i]), depth+1);

        // Flatten list to stack
        stack = stack.concat(ret.reduce(function(acc, val) {
            return acc.concat(val);

        }, []);
    }
    return stack;

};

LSystem.prototype.launcher = function() {
    // Run recursion
    this.system = LSrecurse(this.seed, 0);

};

LSystem.prototype.checkRule(production) {
    if (production instanceof Action) return production;
    for (var rule in this.rules) {
        if (rule.id == production.id && rule.condition(this.args))
            return rule.output;

    }
    return production;

}
