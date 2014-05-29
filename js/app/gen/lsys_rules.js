function HondaTree() {
    var consts = {R_1: 0.9, R_2: 0.6, A_0: Math.PI/4, A_2: Math.PI/4, D: 137.5, W_R: 0.707};
    var initial = [new LSystem.Production('A', [10, 1])];
    var rules = [
        new LSystem.Rule('A', function() {return true;}, [
            new Turtle.Action(Turtle._set, null,
                function(args, consts) {this.t = args[1]}),
            new Turtle.Action(Turtle._F, null,
                function(args, consts) {this.t = args[0]}),
            new Turtle.Action(Turtle._push, null, null),
            new Turtle.Action(Turtle._pitch, null,
                function(args, consts) {this.t = consts.A_0}),
            new LSystem.Production('B', null,
                function(args, consts) {this.args = [args[0]*consts.R_2, args[1]*consts.W_R];}),
            new Turtle.Action(Turtle._pop, null, null),
            new Turtle.Action(Turtle._roll, null,
                function(args, consts) {this.t = consts.D;}),
            new LSystem.Production('A', null,
                function(args, consts) {this.args = [args[0]*consts.R_1, args[1]*consts.W_R];})
        ]),
        new LSystem.Rule('B', function() {return true;}, [
            new Turtle.Action(Turtle._set, null,
                function(args, consts) {this.t = args[1]}),
            new Turtle.Action(Turtle._F, null,
                function(args, consts) {this.t = args[0]}),
            new Turtle.Action(Turtle._push, null, null),
            new Turtle.Action(Turtle._yaw, null,
                function(args, consts) {this.t = -1*consts.A_2}),
            new Turtle.Action(Turtle._$, null, null),
            new LSystem.Production('C', null,
                function(args, consts) {this.args = [args[0]*consts.R_2, args[1]*consts.W_R];}),
            new Turtle.Action(Turtle._pop, null, null),
            new LSystem.Production('C', null,
                function(args, consts) {this.args = [args[0]*consts.R_1, args[1]*consts.W_R];})

        ]),
        new LSystem.Rule('C', function() {return true;}, [
            new Turtle.Action(Turtle._set, null,
                function(args, consts) {this.t = args[1]}),
            new Turtle.Action(Turtle._F, null,
                function(args, consts) {this.t = args[0]}),
            new Turtle.Action(Turtle._push, null, null),
            new Turtle.Action(Turtle._yaw, null,
                function(args, consts) {this.t = consts.A_2}),
            new Turtle.Action(Turtle._$, null, null),
            new LSystem.Production('B', null,
                function(args, consts) {this.args = [args[0]*consts.R_2, args[1]*consts.W_R];}),
            new Turtle.Action(Turtle._pop, null, null),
            new LSystem.Production('B', null,
                function(args, consts) {this.args = [args[0]*consts.R_1, args[1]*consts.W_R];})

        ])
    ];
    LSystem.RuleSet.call(this, consts, initial, rules);

};
HondaTree.prototype = new LSystem.RuleSet();
HondaTree.prototype.constructor = HondaTree;

function TernaryTree() {
    var consts = {D_1: 180 * (Math.PI / 180),
                D_2: 252 * (Math.PI / 180),
                A: 36  * (Math.PI / 180), L_R: 1.070, V_R: 1.732, R_I: 0.01};
    var initial = [
        new Turtle.Action(Turtle._set, 1/100),
        new Turtle.Action(Turtle._F, 200/100),
        new Turtle.Action(Turtle._roll, Math.PI/4),
        new LSystem.Production('A', null, null)

    ];
    var rules = [
        new LSystem.Rule('A', function() {return true;}, [
            new Turtle.Action(Turtle._set, null,
                function(args, consts) {this.args = [consts.R_I]}),
            new Turtle.Action(Turtle._F, 50/100),
            new Turtle.Action(Turtle._push),
            new Turtle.Action(Turtle._pitch, null,
                function(args, consts) {this.args = [consts.A];}),
            new Turtle.Action(Turtle._F, 50/100),
            new LSystem.Production('A'),
            new Turtle.Action(Turtle._pop),

            new Turtle.Action(Turtle._set, null,
                function(args, consts) {this.args = [consts.R_I]}),
            new Turtle.Action(Turtle._roll, null,
                function(args, consts) {this.args = [consts.D_1];}),
            new Turtle.Action(Turtle._push),
            new Turtle.Action(Turtle._pitch, null,
                function(args, consts) {this.args = [consts.A];}),
            new Turtle.Action(Turtle._F, 50/100),
            new LSystem.Production('A'),
            new Turtle.Action(Turtle._pop),

            new Turtle.Action(Turtle._set, null,
                function(args, consts) {this.args = [consts.R_I]}),
            new Turtle.Action(Turtle._roll, null,
                function(args, consts) {this.args = [consts.D_2]}),
            new Turtle.Action(Turtle._push),
            new Turtle.Action(Turtle._pitch, null,
                function(args, consts) {this.args = [consts.A];}),
            new Turtle.Action(Turtle._F, 50/100),
            new LSystem.Production('A'),
            new Turtle.Action(Turtle._pop)

        ]),
        new LSystem.Rule('_F', function() {return true;}, [
            new Turtle.Action(Turtle._F, null,
                function(args, consts) {this.args = [args[0] * consts.L_R];})

        ]),
        new LSystem.Rule('_set', function() {return true;}, [
            new Turtle.Action(Turtle._set, null,
                function(args, consts) {this.args = [args[0]*consts.V_R]})

        ])
    ];
    LSystem.RuleSet.call(this, consts, initial, rules);

};
TernaryTree.prototype = new LSystem.RuleSet();
TernaryTree.prototype.constructor = TernaryTree;

function RandomTree() {
    // hack hack hack
    var L_R = 1.070;
    var A = 36 * (Math.PI / 180);
    var V_R = 1.414;
    var consts = {D_1: 180 * (Math.PI / 180),
                D_2: 252 * (Math.PI / 180),
                A: A, L_R: L_R, V_R: V_R, R_I: 0.01,
                LEN_RANGE: 0.2 * L_R, WID_RANGE: 0.2 * V_R, BR_RANGE: 0.2*A};
    var initial = [
        new Turtle.Action(Turtle._set, 1/100),
        new Turtle.Action(Turtle._F, 200/100),
        new Turtle.Action(Turtle._roll, Math.PI/4),
        new LSystem.Production('A', null, null)

    ];

    // Random function
    var randomRange = function(range, clamp) {
        if (clamp) return Math.max(0, (-1 + 2*Math.random()) * range);
        return (-1 + 2*Math.random()) * range;

    }

    var rules = [
        // Bijunction
        new LSystem.Rule('A', function(p, random) {return random <= 0.3;}, [
            new Turtle.Action(Turtle._set, null,
                function(args, consts) {this.args = [consts.R_I]}),
            new Turtle.Action(Turtle._F, 50/100),
            new Turtle.Action(Turtle._push),
            new Turtle.Action(Turtle._F, 50/100),
            new LSystem.Production('A'),
            new Turtle.Action(Turtle._pop),

            new Turtle.Action(Turtle._set, null,
                function(args, consts) {this.args = [consts.R_I]}),
            new Turtle.Action(Turtle._roll, null,
                function(args, consts) {this.args = [consts.D_2]}),
            new Turtle.Action(Turtle._push),
            new Turtle.Action(Turtle._pitch, null,
                function(args, consts) {this.args = [consts.A + randomRange(consts.BR_RANGE)];}),
            new Turtle.Action(Turtle._F, 50/100),
            new LSystem.Production('A'),
            new Turtle.Action(Turtle._pop)

        ]),
        // Trijunction
        new LSystem.Rule('A', function(p, random) {return (random > 0.3 && random <= 0.7);}, [
            // Normal bijunction
            new Turtle.Action(Turtle._set, null,
                function(args, consts) {this.args = [consts.R_I]}),
            new Turtle.Action(Turtle._F, 0.15),
            new Turtle.Action(Turtle._push),
            new Turtle.Action(Turtle._pitch, null,
                function(args, consts) {this.args = [consts.A + randomRange(consts.BR_RANGE)];}),
            new Turtle.Action(Turtle._F, 50/100),
            new Turtle.Action(Turtle._roll, null,
                function(args, consts) {this.args = [consts.D_2]}),
            new LSystem.Production('A'),
            new Turtle.Action(Turtle._pop),
            new Turtle.Action(Turtle._set, null,
                function(args, consts) {this.args = [consts.R_I]}),

            // Forward...
            new Turtle.Action(Turtle._F, 0.25),

            // Fork bijunction
            new Turtle.Action(Turtle._set, null,
                function(args, consts) {this.args = [consts.R_I]}),
            new Turtle.Action(Turtle._F, 50/100),
            new Turtle.Action(Turtle._push),
            new Turtle.Action(Turtle._pitch, null,
                function(args, consts) {this.args = [-0.5*(consts.A + randomRange(consts.BR_RANGE))];}),
            new Turtle.Action(Turtle._F, 50/100),
            new Turtle.Action(Turtle._roll, null,
                function(args, consts) {this.args = [consts.D_2]}),
            new LSystem.Production('A'),
            new Turtle.Action(Turtle._pop),

            new Turtle.Action(Turtle._set, null,
                function(args, consts) {this.args = [consts.R_I]}),
            new Turtle.Action(Turtle._push),
            new Turtle.Action(Turtle._pitch, null,
                function(args, consts) {this.args = [0.5*(consts.A + randomRange(consts.BR_RANGE))];}),
            new Turtle.Action(Turtle._F, 50/100),
            new Turtle.Action(Turtle._roll, null,
                function(args, consts) {this.args = [consts.D_2]}),
            new LSystem.Production('A'),
            new Turtle.Action(Turtle._pop)

        ]),
        // Fork bijunction
        new LSystem.Rule('A', function(p, random) {return random > 0.7;}, [
            new Turtle.Action(Turtle._set, null,
                function(args, consts) {this.args = [consts.R_I]}),
            new Turtle.Action(Turtle._F, 50/100),
            new Turtle.Action(Turtle._push),
            new Turtle.Action(Turtle._pitch, null,
                function(args, consts) {this.args = [-0.5*(consts.A + randomRange(consts.BR_RANGE))];}),
            new Turtle.Action(Turtle._F, 50/100),
            new Turtle.Action(Turtle._roll, null,
                function(args, consts) {this.args = [consts.D_2]}),
            new LSystem.Production('A'),
            new Turtle.Action(Turtle._pop),

            new Turtle.Action(Turtle._set, null,
                function(args, consts) {this.args = [consts.R_I]}),
            new Turtle.Action(Turtle._push),
            new Turtle.Action(Turtle._pitch, null,
                function(args, consts) {this.args = [0.5*(consts.A + randomRange(consts.BR_RANGE))];}),
            new Turtle.Action(Turtle._F, 50/100),
            new Turtle.Action(Turtle._roll, null,
                function(args, consts) {this.args = [consts.D_2]}),
            new LSystem.Production('A'),
            new Turtle.Action(Turtle._pop)

        ]),
        

        new LSystem.Rule('_F', function() {return true;}, [
            new Turtle.Action(Turtle._F, null,
                function(args, consts) {this.args =
                    [args[0] * consts.L_R + randomRange(consts.LEN_RANGE, true)];})

        ]),
        new LSystem.Rule('_set', function() {return true;}, [
            new Turtle.Action(Turtle._set, null,
                function(args, consts) {this.args =
                    [args[0]*consts.V_R]})

        ])
    ];
    LSystem.RuleSet.call(this, consts, initial, rules);

};
RandomTree.prototype = new LSystem.RuleSet();
RandomTree.prototype.constructor = RandomTree;
