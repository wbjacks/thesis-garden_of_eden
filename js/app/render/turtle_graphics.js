// Turtle_graphics.js is a 3D LOGO-style "turtle" wrapper for three.js used
// for LSystem drawing.

// BUT ALSO LOOK AT THIS:
//http://www.akdillon.net/pages/classes/cs493/dillon_proj2_final/docs/lsys.html

// Turtle wrapper for three.js
function Turtle(rad) {//, loc, U, L, H) {
    // Call parent constructor
    THREE.Object3D.call(this);

    // Hack b/c I can't get euler rotations to work
    this.orientation = new THREE.Matrix4().makeRotationZ(0);

    // Turtle stack used to save states
    this.stack = [];

    // Rate of turtle movement
    this.rate = 1;

    // Radius of drawn cylinder
    this.width = rad || 0.25;

    // THREE.js stuff
    this.geometry = new THREE.Geometry();

};
// Turtle inherits Object3D
Turtle.prototype = new THREE.Object3D();

// Correct constructor pointer
Turtle.prototype.constructor = Turtle;

/* Turtle actions */
// Move turtle forward, drawing a line
// TODO: WAAY too many objects created?
Turtle._F = function _F(time) {
    /* DRAW WITH THREE.js */
    // Create geometry
    // TODO: Taper width?
    var geo = new THREE.CylinderGeometry(this.width, this.width,
        time*this.rate, 8, 1, true);

    // Build initial transform matrix
    var mat_it = new THREE.Matrix4();
    mat_it.makeTranslation(0, 0, 0.5*this.rate*time);
    var mat_ir = new THREE.Matrix4();
    mat_ir.makeRotationFromEuler(new THREE.Euler(Math.PI / 2, 0, 0));
    var mat_is = new THREE.Matrix4();
    mat_is.makeScale(1,1,1);
    var mat_i = new THREE.Matrix4();
    mat_i.multiplyMatrices(mat_it, mat_ir);
    mat_i.multiply(mat_is);
    geo.applyMatrix(mat_i);

    // Move in to position, assuming cylinder is oriented y+ w/ axis at center
    // Move into initial position
    //geo.rotation.set(Math.PI / 2, 0, 0);

    // Get heading vector
    var heading = new THREE.Vector3(0,0,1);
    heading.transformDirection(this.orientation);

    // Build move matrix
    var mat_ft = new THREE.Matrix4();
    mat_ft.makeTranslation(this.position.x, this.position.y, this.position.z);
    var mat_fr = this.orientation;
    var mat_fs = new THREE.Matrix4();
    mat_fs.makeScale(1,1,1);
    var mat_f = new THREE.Matrix4();
    mat_f.multiplyMatrices(mat_ft, mat_fr);
    mat_f.multiply(mat_fs);
    geo.applyMatrix(mat_f);

    // Merge into geometry
    this.geometry.merge(geo);

    // Move turtle to new position
    this.position.add(heading.multiplyScalar(time*this.rate));

};
// Move turtle forward, not drawing a line
Turtle._f = function _f(time) {
    // Move turtle to new position
    var heading = new THREE.Vector3(0,0,1);
    heading.transformDirection(this.orientation);
    this.position.add(heading.multiplyScalar(time*this.rate));

};
// Rotate around the U axis ("up"), the local y axis, +
Turtle._yaw = function _yaw(deg) {
    // Create rotation matrix
    var rot = new THREE.Matrix4();
    rot.makeRotationY(deg);

    // Do a rotation of the parent object by the matrix
    this.orientation.multiplyMatrices(this.orientation, rot);

    // Change parent rotation
    this.setRotationFromMatrix(this.orientation);

};
// Rotate around the L axis ("left"), the local x axis, &
Turtle._pitch = function _pitch(deg) {
    // Create rotation matrix
    var rot = new THREE.Matrix4();
    rot.makeRotationX(deg);

    // Do a rotation of the parent object by the matrix
    this.orientation.multiplyMatrices(this.orientation, rot);

    // Change parent rotation
    this.setRotationFromMatrix(this.orientation);

};
// Rotate around the H axis ("heading"), the local z axis, /
Turtle._roll = function _roll(deg) {
    // Create rotation matrix
    var rot = new THREE.Matrix4();
    rot.makeRotationZ(deg);

    // Do a rotation of the parent object by the matrix
    this.orientation.multiplyMatrices(this.orientation, rot);

    // Change parent rotation
    this.setRotationFromMatrix(this.orientation);

};
// ?? Sets line width / diameter ??
Turtle._set = function _set(width) {
    this.width = width;

};
// Pushes state (object3d info) on to stack
Turtle._push = function _push() {
    // There's prob a better way but for now imma store values sue me
    var state = this.clone();
    state.orientation = this.orientation.clone();
    this.stack.push(state);

};

// Pops state from stack
Turtle._pop = function _pop() {
    var state = this.stack.pop();

    // ERROR: Stack empty
    if (state == null) {
        console.error('ERROR: Pop called on empty turtle stack!');
        return;

    }
    // Now I basically have to make "this" into "state"
    this.position = state.position;
    this.roatation = state.rotation;
    this.orientation = state.orientation;
    //this.width = state.width;

};

// Created by Honda, honestly I don't really understand what it does
Turtle._$ = function _$() {
    // Rotate around heading axis
    var heading = new THREE.Vector3(0,0,1);
    heading.applyEuler(this.rotation);

    // ...such that the left axis is in the direction of the cross-product of
    // the heading vector and the opposite of gravity (world y-axis)
    var dir = new THREE.Vector3();
    dir.crossVectors(heading, new THREE.Vector3(0,1,0));
    var L = new THREE.Vector3();
    L.applyEuler(this.rotation);

    // Calculate angle
    var alpha = Math.acos(L.dot(dir));
    this.rotation.x += alpha;

};

/* Turtle methods */
// Takes a list of actions (generated by l-system, maybe?) and runs them
Turtle.prototype.run = function(actions) {
    // Actions are current free of context, use "call" to run them on this
    // instance
    var initial_position = this.position.clone();
    this.position.set(0,0,0);
    for (var i = 0; i < actions.length; i++) {
        if (actions[i] instanceof Turtle.Action) {
            actions[i].f.call(this, actions[i].args[0]);

        }
    }
    this.rotation.set(-Math.PI/2,0,0);
    this.position.copy(initial_position);

    // Build optimized buffered geometry
    this.geometry = THREE.BufferGeometryUtils.fromGeometry(this.geometry);

};

Turtle.prototype.serialize = function() {
    var pkg = {};
    //pkg.attributes = this.geometry.attributes;
    pkg.vertices = this.geometry.vertices;
    pkg.faces = this.geometry.faces;
    return pkg;

}

Turtle.deserialize = function(pkg) {
    var geo = new THREE.Geometry();
    for (var i = 0; i < pkg.vertices.length; i++) {
        geo.vertices.push(pkg.vertices[i]);

    }
    for (var i = 0; i < pkg.faces.length; i++) {
        geo.faces.push(pkg.faces[i]);

    }
    return geo;

}

// Drops tree on to object below
Turtle.prototype.drop = function(obj) {
    var rc = new THREE.Raycaster();
    rc.far = 1000;
    // Move tree up high
    this.position.setY(100);
    rc.set(this.position, new THREE.Vector3(0, -1, 0));

    // Find distance and set
    var intersect = rc.intersectObject(obj, true);
    if (intersect.length > 0) 
        this.position.setY(100 - intersect[0].distance);
    else
        this.position.setY(0);

};

// Holds an action and parameters. Not sure if this is the best way to do this
Turtle.Action = function(func, time, inject) {
    this.f = func;
    this.args = [time]; // Wee hack
    this.inject_args = inject; // Used to dynamically set arguments
    this.id = func.name;

};

Turtle.Action.prototype.clone = function() {
    return new Turtle.Action(this.f, this.args[0], this.inject_args);

};
