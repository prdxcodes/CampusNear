const Pg = require("../models/pg.js");
const College = require("../models/college.js");

module.exports.renderHome = async (req, res) => {

    const pgs = await Pg.find({})
        .limit(6);

    res.render(
        "home/home",
        {
            pgs
        }
    );

};