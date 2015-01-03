// Upon recieving a signal containing a seed reference, grow the seed
importScripts(
    '../../lib/three.min.js',
    '../../lib/BufferGeometryUtils.js',
    '../gen/lsys.js',
    '../gen/lsys_rules.js',
    '../render/turtle_graphics.js'
);
var worker_num = -1;
onmessage = function(pkg) {
    if (pkg.data.msg == 'WORK_START') worker_num = pkg.data.payload.worker_num;
    console.log("In worker " + worker_num + ", message is: " + pkg.data.msg);

    var turtle = new Turtle(0.25);
    var species = new RandomTree();
    var lsys = new LSystem(species); // TODO: get access to species
    var depth = 8 + Math.round(-1 + 2*Math.random());
    console.log("Constructing tree of depth " + depth);
    lsys.MAX_DEPTH = depth;

    // Grow
    lsys.build();
    turtle.run(lsys.system, pkg.data.payload.seed);
    var geo = turtle.geometry.toJSON();
    postMessage({
        msg: 'WORK_DONE',
        payload: {
            geometry: JSON.stringify(geo),
            worker_num: worker_num
        }
    });

}
