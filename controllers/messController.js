const Mess = require("../models/mess.js");

const createPlaceController =
    require("./placeController.js");

module.exports =
    createPlaceController(
        Mess,
        "Mess",
        "messes",
        "/messes"
    );