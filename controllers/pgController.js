const Pg = require("../models/pg.js");

const createPlaceController =
    require("./placeController.js");

module.exports =
    createPlaceController(
        Pg,
        "Pg",
        "pgs",
        "/pgs"
    );