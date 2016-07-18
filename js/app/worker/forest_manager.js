// Controls grow workers
var workers = [];
var seeds = [];
var force_depth = undefined;

onmessage = processMessage;
function processMessage(pkg) {
    // Find message type
    console.log("Manager recieved message: " + pkg.data.msg);
    switch (pkg.data.msg) {
        case "INIT": init(pkg.data.payload); break;
        case "WORK_DONE":
            postMessage(pkg.data.payload);
            if (seeds.length != 0) {
                // TODO: Send geometry to main thread for rendering
                sendSeed(pkg.data.payload.worker_num);

            }
            else {
                killWorker(pkg.data.payload.worker_num);

            }
            break;
        default:
            console.error("ERROR: Bad message recieved: " + pkg.data.msg +
                ". Killing workers and exiting.");
            close();
    }
    // Check if all workers are done
    if (workers.length == 0) {
        console.log('Closing manager');
        close();

    }
}

// Recieve forest data, build into array
function init(data) {
    seeds = data.seeds;
    force_depth = data.force_depth;
    for (var i = 0; i < data.num_workers; i++) {
        // Build workers 
        workers[i] = new Worker("grower.js");
        workers[i].onmessage = processMessage;
        console.log("Grower " + i + " built!");
        sendSeed(i, true);

    }
}

// On message from worker
function sendSeed(worker_num, init) {
    if (seeds.length != 0) {
        var seed = seeds.pop();
        var pkg = {};
        if (init) {
            pkg = {
                msg: 'WORK_START',
                payload: {
                    worker_num: worker_num,
                    seed: seed,
                    force_depth: force_depth ==! undefined ? null : force_depth
                }
            };
        }
        else {
            pkg = {
                msg: 'MAKE_TREE',
                payload: {
                    seed: seed,
                    force_depth: force_depth ==! undefined ? null : force_depth
                }
            };
        }
        workers[worker_num].postMessage(pkg);
        console.log("Seed at (" + seed.x + ", " + seed.z +
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
    workers = workers.slice(0, worker_num) + workers.slice(worker_num+1, workers.length)

}
