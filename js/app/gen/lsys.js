// Generates a unique l-system tree for a given rule dictionary

function LSystem(rules) {
     // Construct
    this.rule_table = rules;
    this.seed = Math.random(); // Generate random seed 
    this.system = rules.initial;
    this.MAX_DEPTH = 20; //idk

}



LSystem.Production = function(id, args, inject) {
    this.id = id; // Production ID
    this.args = args; // Parametric term
    this.inject_args = inject;

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

LSystem.prototype.LSRecurse = function(prod, depth) {
    // Base case is depth
    // TODO: Check if action?
    if (depth == this.MAX_DEPTH+1) return [prod];

    var stack = [];
    // Recursive case: replace production, recurse on list, then flatten
    // TODO This could totes be more recursive
    var out = this.checkRule(prod);
    for (var i = 0; i < out.length; i++) {
        // TODO: Roll out the loop
        var rec_stack;
        rec_stack = this.LSRecurse(out[i], depth+1);

        // Flatten list to stack
        stack = stack.concat(rec_stack.reduce(function(acc, val) {
            return acc.concat(val);

        }, []));
    }
    return stack;

};

LSystem.prototype.build = function() {
    // Run recursion
    var stack = [];
    for (var i = 0; i < this.system.length; i++) {
        // Recurse
        var rec_stack;
        rec_stack = this.LSRecurse(this.system[i], 1);

        // Flatten list to stack
        stack = stack.concat(rec_stack.reduce(function(acc, val) {
            return acc.concat(val);

        }, []));
    }
    this.system = stack;

};

LSystem.prototype.checkRule = function(production) {
    // Do nothing if an action
    if (!production instanceof LSystem.Production) return [production];

    // Must be production
    for (var i = 0; i < this.rule_table.rules.length; i++) {
        var rule = this.rule_table.rules[i];
        if (rule.id == production.id && rule.condition(production)) {
            // Rule match
            var output = [];
            for (var j = 0; j < rule.output.length; j++) {
                // Make new Production object
                output[j] = new LSystem.Production();
                output[j].id = rule.output[j].id;
                output[j].inject_args = rule.output[j].inject_args;

                // Inject arguements to rules and productions
                if (output[j].inject_args != null) {
                    output[j].inject_args(
                        production.args, this.rule_table.consts);

                }
            }
            return output;

        }
    }
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
            output=output.concat(this.system[i].f.name + '(' + this.system[i].t + ') ');

        }
    }
    console.info("LSystem is: " + output);

}
