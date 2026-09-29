const Laundry = require("../models/laundry.js");

const createPlaceController =
    require("./placeController.js");

module.exports =
    createPlaceController(
        Laundry,
        "Laundry",
        "laundries",
        "/laundries"
    );