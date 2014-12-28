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
    console.log(pkg.data);

    var turtle = new Turtle(0.25);
    var species = new RandomTree();
    var lsys = new LSystem(species); // TODO: get access to species
    var depth = 7 + Math.round(-1 + 2*Math.random());
    lsys.MAX_DEPTH = depth;
    turtle.position.setX(pkg.data.payload.seed.x);
    turtle.position.setZ(pkg.data.payload.seed.z);
    //t.position.setY(pkg.payload.seed.y);

    // Grow
    lsys.build();
    turtle.run(lsys.system);
    var geo = turtle.serialize();
    console.log('Posting message from worker ' + worker_num);
    postMessage({
        msg: 'WORK_DONE',
        payload: {geometry: geo, worker_num: worker_num}
    });

}
