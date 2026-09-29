const mongoose = require("mongoose");
const Laundry = require("../models/laundry.js");
const College = require("../models/college.js");

const OWNER_ID = new mongoose.Types.ObjectId(
    "6a7727c62e5aff43e1e72b20"
);

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/campusnear");
    console.log("Connected to database");
}

const initDB = async () => {

    // =========================================
    // DELETE OLD LAUNDRY DATA
    // =========================================

    await Laundry.deleteMany({});

    console.log("Old laundry data deleted");


    // =========================================
    // GET COLLEGES
    // =========================================

    const colleges = await College.find({});

    console.log(`Found ${colleges.length} colleges`);


    // =========================================
    // UNIQUE LAUNDRY NAMES
    // =========================================

    const laundryNames = [
        "Quick Wash",
        "Fresh Laundry",
        "Clean & Care",
        "Wash Hub",
        "Laundry Point",
        "Campus Laundry",
        "Sparkle Wash",
        "Clean Clothes",
        "Laundry Express",
        "Wash & Wear",
        "Fresh Press",
        "Student Laundry",
        "Clean Zone",
        "Laundry Care",
        "Wash World",
        "Campus Wash",
        "Neat & Clean",
        "Laundry House",
        "Quick Clean",
        "Fresh Press Laundry",
        "Urban Laundry",
        "Smart Wash",
        "Laundry Junction",
        "Clothes Care",
        "Easy Wash",
        "Wash Point",
        "Clean Hub",
        "Laundry Studio",
        "Daily Wash",
        "Perfect Press",
        "Student Wash",
        "Laundry Corner"
    ];


    // =========================================
    // NEARBY COORDINATE OFFSETS
    // =========================================

    const offsets = [
        [0.0020, 0.0012],
        [-0.0025, 0.0018]
    ];


    const laundries = [];


    // =========================================
    // CREATE 2 LAUNDRIES FOR EACH COLLEGE
    // =========================================

    colleges.forEach((college, collegeIndex) => {

        const [
            longitude,
            latitude
        ] = college.location.coordinates;


        for (let i = 0; i < 2; i++) {

            const nameIndex =
                (collegeIndex * 2 + i) %
                laundryNames.length;


            // =====================================
            // SERVICE TYPES
            // =====================================

            const serviceType =
                i === 0
                    ? [
                        "Washing",
                        "Ironing"
                    ]
                    : [
                        "Washing",
                        "Dry Cleaning",
                        "Ironing"
                    ];


            // =====================================
            // CREATE LAUNDRY
            // =====================================

            laundries.push({

                title:
                    `${laundryNames[nameIndex]} - ${college.shortName}`,

                category: "Laundry",

                description:
                    `Affordable and reliable laundry service near ${college.name}, specially suitable for students and nearby residents.`,

                image: {
                    url: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60",
                    filename: "campusnear-laundry"
                },

                price:
                    i === 0 ? 50 : 80,

                location:
                    `Near ${college.shortName}, ${college.city}`,

                country: "India",

                ownerContact:
                    "9876543210",

                serviceType:
                    serviceType,

                pickupDelivery:
                    i === 1,

                reviews: [],

                owner:
                    OWNER_ID,

                college:
                    college._id,

                geocoding: {

                    type: "Point",

                    coordinates: [
                        longitude + offsets[i][0],
                        latitude + offsets[i][1]
                    ]

                }

            });

        }

    });


    // =========================================
    // INSERT NEW DATA
    // =========================================

    await Laundry.insertMany(laundries);

    console.log(
        `${laundries.length} laundries inserted successfully`
    );

};


// =============================================
// RUN DATABASE INITIALIZATION
// =============================================

main()

    .then(async () => {

        await initDB();

        console.log(
            "Laundry database initialized successfully"
        );

        await mongoose.connection.close();

    })

    .catch(async (err) => {

        console.log("Error:", err);

        await mongoose.connection.close();

    });