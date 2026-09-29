const mongoose = require("mongoose");
const Cafe = require("../models/cafe.js");
const College = require("../models/college.js");

const OWNER_ID = new mongoose.Types.ObjectId(
    "6a7727c62e5aff43e1e72b20"
);

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/campusnear");
    console.log("Connected to database");
}

const initDB = async () => {

    // Remove existing cafe data
    await Cafe.deleteMany({});
    console.log("Old cafe data deleted");

    const colleges = await College.find({});

    const cafeTemplates = [
        {
            name: "Campus Cafe",
            cuisine: "Fast Food",
            price: 120,
            openingTime: "08:00",
            closingTime: "22:00"
        },
        {
            name: "Student Cafe",
            cuisine: "Chinese",
            price: 180,
            openingTime: "09:00",
            closingTime: "23:00"
        },
        {
            name: "Cafe Corner",
            cuisine: "Cafe & Bakery",
            price: 150,
            openingTime: "07:30",
            closingTime: "21:30"
        }
    ];

    /*
        Different coordinates around each college.

        [longitude, latitude]

        These are generated nearby coordinates
        for development/testing purposes.
    */

    const offsets = [
        [0.0020, 0.0012],
        [-0.0030, 0.0020],
        [0.0040, -0.0025]
    ];

    const cafes = [];

    colleges.forEach((college) => {

        const [
            longitude,
            latitude
        ] = college.location.coordinates;

        cafeTemplates.forEach((template, index) => {

            const offset = offsets[index];

            cafes.push({

                title: `${template.name} - ${college.shortName}`,

                category: "Cafe",

                description:
                    `Affordable student-friendly cafe near ${college.name}. Great place for students to relax, eat and spend time with friends.`,

                image: {
                    url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb",
                    filename: "campusnear-cafe"
                },

                price: template.price,

                location:
                    `Near ${college.shortName}, ${college.city}`,

                country: "India",

                ownerContact: "9876543210",

                cuisine: template.cuisine,

                openingTime: template.openingTime,

                closingTime: template.closingTime,

                reviews: [],

                owner: OWNER_ID,

                college: college._id,

                geocoding: {
                    type: "Point",

                    coordinates: [
                        longitude + offset[0],
                        latitude + offset[1]
                    ]
                }
            });
        });
    });

    await Cafe.insertMany(cafes);

    console.log(
        `${cafes.length} cafes inserted successfully`
    );
};

main()
    .then(async () => {
        await initDB();

        console.log("Cafe database initialized successfully");

        await mongoose.connection.close();
    })
    .catch((err) => {
        console.log("Error:", err);

        mongoose.connection.close();
    });