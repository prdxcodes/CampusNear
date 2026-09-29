const mongoose = require("mongoose");
const collegeData = require("./college.js");
const College = require("../models/college.js");

main()
    .then(() => {
        console.log("Connected to database");
        return initDB();
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/campusnear");
}

const initDB = async () => {
    try {
        // Remove existing colleges
        await College.deleteMany({});

        // Insert all colleges
        const result = await College.insertMany(collegeData);

        console.log(`${result.length} colleges added successfully!`);
    } catch (err) {
        console.log("Error while adding colleges:", err);
    } finally {
        await mongoose.connection.close();
    }
};