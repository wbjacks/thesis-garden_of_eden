// Generates a unique l-system tree for a given rule dictionary

function LSystem(rules) {
     // Construct
    this.rule_table = rules;
    this.system = rules.initial;
    this.MAX_DEPTH = 1; // default value, set upon creation

}



LSystem.Production = function(id, args, inject) {
    this.id = id; // Production ID
    this.args = args; // Parametric term
    this.inject_args = inject;
    this.depth = 0;


}

// This isn't memory effecient, but at least it isn't reusing the prototype
LSystem.Production.prototype.clone  = function() {
    return new LSystem.Production(this.id, this.args, this.inject_args);

}

LSystem.RuleSet = function(consts, initial, rules) {
    this.consts = consts;
    this.initial = initial;
    this.rules = rules;

}

LSystem.Rule = function(id, condition, output) {
    this.id = id; // ID corresponding to the production this affects
    this.condition = condition; // Condition on the parametric term
    this.output = output; // If applied, what to replace with

}

LSystem.prototype.build = function(debug) {
    // Run recursion
    var self = this;
    function recurse(stack) {
        // Unroll recursion to avoid callstack overflow
        var output_stack = [];
        for (var i = 0; i < stack.length; i++) {
            if (stack[i].depth === self.MAX_DEPTH) {
                output_stack.push(stack[i]);
            }
            else {
                output_stack = output_stack.concat(recurse(self.checkRule(stack[i])));

            }
        }
        return output_stack;
    }
    this.system = recurse(this.system);
    if (debug === true) {
        console.debug('Build yields:');
        this.printSystem();

    }
};

LSystem.prototype.checkRule = function(production) {
    // Must be production
    var random = Math.random();
    for (var i = 0; i < this.rule_table.rules.length; i++) {
        var rule = this.rule_table.rules[i];
        if (rule.id == production.id && rule.condition(production, random)) {
            // Rule match
            var output = [];
            for (var j = 0; j < rule.output.length; j++) {
                // Make new Production object
                output[j] = rule.output[j].clone();

                // Inject arguements to rules and productions
                if (output[j].inject_args != null) {
                    output[j].inject_args(
                        production.args, this.rule_table.consts);

                }

                // Modify depth for recursion
                output[j].depth = production.depth+1;
            }
            return output;

        }
    }
    // If no match, return self and increase depth
    production.depth += 1;
    return [production];

}

/* OUTPUT FOR DEBUG */
LSystem.prototype.printSystem = function() {
    if (this.system == null) {
        console.log('null');
        return;

    }
    var output = '';
    for (var i = 0; i < this.system.length; i++) {
        if (this.system[i] instanceof LSystem.Production) {
            // Print ID
            output=output.concat(this.system[i].id + '(');

            // Print formatted args
            if (this.system[i].args != null) {
                for (var j = 0; j < this.system[i].args.length; j++) {
                    output=output.concat(this.system[i].args[j] + ', ');

                }
                // Remove last two characters
                output=output.substr(0, output=output.length-2);

            }
            // Close
            output=output.concat(') ');

        }
        // Assumed to be Turtle.Action DANGER CAPTAIN DANGER
        else {
            output=output.concat(this.system[i].f.name + '(' + this.system[i].args[0] + ') ');

        }
    }
    console.info("LSystem is: " + output);

}
