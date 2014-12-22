// Controls grow workers
var workers = [];
var seeds = [];

onmessage = function(pkg) {
    // Find message type
    console.log("Manager recieved message: " + pkg.data.msg);
    switch (pkg.data.msg) {
        case "INIT": init(pkg.data.payload); break;
        case "WORK_DONE":
            if (seeds.length != 0) {
                sendSeed(pkg.data.payload);

            }
            else {
                killWorker(pkg.data.payload);

            }
            break;
        default:
            console.error("ERROR: Bad message recieved: " + pkg.data.msg +
                ". Killing workers and exiting.");
            close();
    }
    // Check if all workers are done
    if (workers.length == 0) close();

}

// Recieve forest data, build into array
function init(data) {
    seeds = data.seeds;
    for (var i = 0; i < data.num_workers; i++) {
        // Build workers 
        workers[i] = new Worker("grower.js");
        console.log("Grower " + i + " built!");
        sendSeed(i);

    }
}

// On message from worker-
function sendSeed(worker_num) {
    if (seeds.length != 0) {
        var seed = seeds.pop();
        var pkg = {msg: 'MAKE_TREE', payload: seed};
        workers[worker_num].postMessage(pkg);
        console.log("Seed at (" + seed.turtle.x + ", " + seed.turtle.z +
            ") sent to grower!");

    }
    else {
        console.warn("WARNING: No seeds left to send!");
        return -1; // ERROR

    }
}

function killWorkers() {
    for (var i = 0; i < workers.length; i++) {
        killWorker(i);

    }
}

function killWorker(worker_num) {
    console.log("Killing worker " + worker_num);
    workers[worker_num].terminate();

}
