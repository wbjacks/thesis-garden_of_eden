// Upon recieving a signal containing a seed reference, grow the seed
onmessage = function(pkg) {
    console.log("In worker!");
    pkg.forest.growOne(0, pkg.seed);
    postMessage({type: 'WORK_DONE'});

}
