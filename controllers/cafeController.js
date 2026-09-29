const Cafe = require("../models/cafe.js");

const createPlaceController =
    require("./placeController.js");

module.exports =
    createPlaceController(
        Cafe,
        "Cafe",
        "cafes",
        "/cafes"
    );