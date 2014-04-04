function HondaTree(t) {
    var consts = {R_1: 0.9, R_2: 0.6, A_0: Math.PI/4, A_2: Math.PI/4, D: 137.5, W_R: 0.707};
    var initial = [new LSystem.Production('A', [10, 1])];
    var rules = [
        new LSystem.Rule('A', function() {return true;}, [
            new Turtle.Action(t._set, null,
                function(args, consts) {this.t = args[1]}),
            new Turtle.Action(t._F, null,
                function(args, consts) {this.t = args[0]}),
            new Turtle.Action(t._push, null, null),
            new Turtle.Action(t._pitch, null,
                function(args, consts) {this.t = consts.A_0}),
            new LSystem.Production('B', null,
                function(args, consts) {this.args = [args[0]*consts.R_2, args[1]*consts.W_R];}),
            new Turtle.Action(t._pop, null, null),
            new Turtle.Action(t._roll, null,
                function(args, consts) {this.t = consts.D;}),
            new LSystem.Production('A', null,
                function(args, consts) {this.args = [args[0]*consts.R_1, args[1]*consts.W_R];})
        ]),
        new LSystem.Rule('B', function() {return true;}, [
            new Turtle.Action(t._set, null,
                function(args, consts) {this.t = args[1]}),
            new Turtle.Action(t._F, null,
                function(args, consts) {this.t = args[0]}),
            new Turtle.Action(t._push, null, null),
            new Turtle.Action(t._yaw, null,
                function(args, consts) {this.t = -1*consts.A_2}),
            new Turtle.Action(t._$, null, null),
            new LSystem.Production('C', null,
                function(args, consts) {this.args = [args[0]*consts.R_2, args[1]*consts.W_R];}),
            new Turtle.Action(t._pop, null, null),
            new LSystem.Production('C', null,
                function(args, consts) {this.args = [args[0]*consts.R_1, args[1]*consts.W_R];})

        ]),
        new LSystem.Rule('C', function() {return true;}, [
            new Turtle.Action(t._set, null,
                function(args, consts) {this.t = args[1]}),
            new Turtle.Action(t._F, null,
                function(args, consts) {this.t = args[0]}),
            new Turtle.Action(t._push, null, null),
            new Turtle.Action(t._yaw, null,
                function(args, consts) {this.t = consts.A_2}),
            new Turtle.Action(t._$, null, null),
            new LSystem.Production('B', null,
                function(args, consts) {this.args = [args[0]*consts.R_2, args[1]*consts.W_R];}),
            new Turtle.Action(t._pop, null, null),
            new LSystem.Production('B', null,
                function(args, consts) {this.args = [args[0]*consts.R_1, args[1]*consts.W_R];})

        ])
    ];

    LSystem.RuleSet.call(this, consts, initial, rules);

}

HondaTree.prototype = new LSystem.RuleSet();
HondaTree.prototype.constructor = HondaTree;
