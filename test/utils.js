function pp_2darray(a) {
    str = ""
    for (var i = 0; i < a.length; i++) {
        for (var j = 0; j < a[0].length; j++) {
            str += a[i][j].toFixed(2) + " ";

        }
        str += "\n"

    }
    console.debug(str);

}

function ppTreeLocations(scene) {
    str = ""
    for (var i = 0; i < scene.children.length; i++) {
        if (scene.children[i] instanceof Turtle) {
            tree = scene.children[i];
            str += "Tree at (" + tree.position.x + ", " + tree.position.y +
                ", " + tree.position.z + "). ";

        }
    }
    console.debug(str);
}
