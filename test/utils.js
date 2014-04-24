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
