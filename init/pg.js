const mongoose = require("mongoose");

const Pg = require("../models/pg.js");
const College = require("../models/college.js");

const collegeData = require("./college.js");


// =====================================================
// DATABASE
// =====================================================

const dbUrl = "mongodb://127.0.0.1:27017/campusnear";


// =====================================================
// FIXED OWNER
// =====================================================

const OWNER_ID = new mongoose.Types.ObjectId(
    "6a78a56fd6e5f6c871db2095"
);


// =====================================================
// CONNECT DATABASE
// =====================================================

async function main() {

    await mongoose.connect(dbUrl);

    console.log("MongoDB connected successfully.");


// =====================================================
// CHECK COLLEGES
// =====================================================

    const colleges = await College.find({});

    if (colleges.length === 0) {

        throw new Error(
            "No colleges found in the database. Please insert colleges first."
        );

    }

    console.log(
        `Found ${colleges.length} colleges in database.`
    );


// =====================================================
// DELETE OLD PG DATA
// =====================================================

    await Pg.deleteMany({});

    console.log("Old PG data deleted.");


// =====================================================
// PG TEMPLATES
// =====================================================

    const pgTypes = [

        {
            name: "Student Comfort PG",

            price: 7500,

            gender: "Male",

            sharingType: "Double",

            foodIncluded: true,

            description:
                "Affordable and comfortable PG accommodation for students with clean rooms, essential facilities and a student-friendly environment."
        },


        {
            name: "Campus View PG",

            price: 9000,

            gender: "Female",

            sharingType: "Single",

            foodIncluded: true,

            description:
                "Comfortable student accommodation located close to the college campus with a peaceful environment and convenient facilities."
        },


        {
            name: "Green Residency PG",

            price: 6500,

            gender: "Unisex",

            sharingType: "Triple",

            foodIncluded: false,

            description:
                "Budget-friendly PG offering spacious rooms, a comfortable living environment and easy access to nearby student facilities."
        }

    ];


// =====================================================
// OWNER CONTACT NUMBERS
// =====================================================

    const contacts = [

        "9876543210",

        "9812345678",

        "9123456780",

        "9988776655",

        "9898989898",

        "9765432109",

        "9654321098",

        "9543210987",

        "9432109876",

        "9321098765"

    ];


// =====================================================
// COORDINATE OFFSETS
// =====================================================
//
// These offsets place the PGs slightly away from
// the college coordinates instead of putting all
// three PGs at exactly the same point.
//
// Coordinates are [longitude, latitude].
//
// =====================================================

    const coordinateOffsets = [

        [0.0018, 0.0012],

        [-0.0015, 0.0017],

        [0.0022, -0.0015]

    ];


// =====================================================
// PG DATA ARRAY
// =====================================================

    const pgData = [];


// =====================================================
// GENERATE 3 PGs FOR EVERY COLLEGE
// =====================================================

    collegeData.forEach(
        (collegeInfo, collegeIndex) => {


            // -----------------------------------------
            // FIND ACTUAL COLLEGE DOCUMENT
            // -----------------------------------------

            const college =
                colleges.find(
                    c =>
                        c.name === collegeInfo.name
                );


            // -----------------------------------------
            // IF COLLEGE NOT FOUND
            // -----------------------------------------

            if (!college) {

                console.log(
                    `College not found: ${collegeInfo.name}`
                );

                return;

            }


            // -----------------------------------------
            // COLLEGE COORDINATES
            // -----------------------------------------

            const [
                collegeLongitude,
                collegeLatitude
            ] =
                college.location.coordinates;


            // -----------------------------------------
            // CREATE 3 PGs
            // -----------------------------------------

            pgTypes.forEach(
                (pgType, pgIndex) => {


                    // ---------------------------------
                    // GET OFFSET
                    // ---------------------------------

                    const [
                        longitudeOffset,
                        latitudeOffset
                    ] =
                        coordinateOffsets[pgIndex];


                    // ---------------------------------
                    // PG COORDINATES
                    // ---------------------------------

                    const longitude =
                        Number(
                            (
                                collegeLongitude +
                                longitudeOffset
                            ).toFixed(6)
                        );


                    const latitude =
                        Number(
                            (
                                collegeLatitude +
                                latitudeOffset
                            ).toFixed(6)
                        );


                    // ---------------------------------
                    // OWNER CONTACT
                    // ---------------------------------

                    const ownerContact =
                        contacts[
                            (
                                collegeIndex * 3 +
                                pgIndex
                            ) %
                            contacts.length
                        ];


                    // ---------------------------------
                    // CREATE PG OBJECT
                    // ---------------------------------

                    pgData.push({

                        // =============================
                        // BASIC INFORMATION
                        // =============================

                        title:
                            `${pgType.name} - ${collegeInfo.shortName}`,

                        category:
                            "PG",

                        description:
                            `${pgType.description} Located near ${collegeInfo.shortName}, ${collegeInfo.city}.`,


                        // =============================
                        // IMAGE
                        // =============================

                        image: {

                            url:
                                "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",

                            filename:
                                `pg-${collegeIndex + 1}-${pgIndex + 1}`

                        },


                        // =============================
                        // PRICE
                        // =============================

                        price:
                            pgType.price,


                        // =============================
                        // LOCATION
                        // =============================

                        location:
                            `Near ${collegeInfo.shortName}, ${collegeInfo.city}, ${collegeInfo.state}`,

                        country:
                            "India",


                        // =============================
                        // OWNER CONTACT
                        // =============================

                        ownerContact:
                            ownerContact,


                        // =============================
                        // PG SPECIFIC FIELDS
                        // =============================

                        gender:
                            pgType.gender,

                        sharingType:
                            pgType.sharingType,

                        foodIncluded:
                            pgType.foodIncluded,


                        // =============================
                        // REVIEWS
                        // =============================

                        reviews: [],


                        // =============================
                        // OWNER
                        // =============================

                        owner:
                            OWNER_ID,


                        // =============================
                        // COLLEGE
                        // =============================

                        college:
                            college._id,


                        // =============================
                        // GEOCODING
                        // =============================

                        geocoding: {

                            type:
                                "Point",

                            coordinates: [

                                longitude,

                                latitude

                            ]

                        }

                    });

                }
            );

        }
    );


// =====================================================
// SAFETY CHECK
// =====================================================

    if (pgData.length === 0) {

        throw new Error(
            "No PG data was generated."
        );

    }


// =====================================================
// INSERT PG DATA
// =====================================================

    await Pg.insertMany(pgData);


// =====================================================
// SUCCESS MESSAGE
// =====================================================

    console.log(
        "=============================================="
    );

    console.log(
        `Successfully inserted ${pgData.length} PGs.`
    );

    console.log(
        `${collegeData.length} colleges × 3 PGs = ${collegeData.length * 3} PGs`
    );

    console.log(
        "Owner for all PGs: Adam"
    );

    console.log(
        "Owner ID: 6a78a56fd6e5f6c871db2095"
    );

    console.log(
        "=============================================="
    );


// =====================================================
// CLOSE DATABASE
// =====================================================

    await mongoose.connection.close();

    console.log(
        "MongoDB connection closed."
    );

}


// =====================================================
// RUN
// =====================================================

main().catch(
    async err => {

        console.error(
            "Error while inserting PG data:"
        );

        console.error(err);

        await mongoose.connection.close();

    }
);