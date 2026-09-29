const mongoose = require("mongoose");
const Mess = require("../models/mess.js");
const College = require("../models/college.js");

const OWNER_ID = new mongoose.Types.ObjectId(
    "6a7727c62e5aff43e1e72b20"
);

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/campusnear");
    console.log("Connected to database");
}

const initDB = async () => {

    await Mess.deleteMany({});
    console.log("Old mess data deleted");

    const colleges = await College.find({});

    console.log(`Found ${colleges.length} colleges`);

    const messPrefixes = [
        "Annapurna Mess",
        "Student Rasoi",
        "Campus Bhoj",
        "Desi Rasoi",
        "Swadisht Mess",
        "Ghar Jaisa Mess",
        "Daily Meals",
        "Student Thali",
        "Campus Rasoi",
        "Apna Kitchen",
        "Bhojan Ghar",
        "Food Junction",
        "Healthy Rasoi",
        "Desi Zaika",
        "The Mess Hub",
        "Swaad Mess",
        "Green Leaf Mess",
        "Ghar Ka Swaad",
        "Thali Junction",
        "Bharat Bhojan",
        "Urban Rasoi",
        "Daily Bhojan",
        "Student Kitchen",
        "Fresh Plate",
        "Meal Junction",
        "Apna Bhoj",
        "Campus Dining",
        "Food Point",
        "Rasoi Express",
        "Student Meal Hub",
        "College Kitchen",
        "Tasty Thali"
    ];

    const messes = [];

    colleges.forEach((college, collegeIndex) => {

        const [
            longitude,
            latitude
        ] = college.location.coordinates;

        // Unique names for every college
        const firstName =
            `${messPrefixes[collegeIndex % messPrefixes.length]} - ${college.shortName}`;

        const secondName =
            `${messPrefixes[(collegeIndex + 1) % messPrefixes.length]} - ${college.shortName}`;

        // First mess
        messes.push({

            title: firstName,

            category: "Mess",

            description:
                `Affordable and student-friendly mess near ${college.name}. Fresh and homely meals for college students.`,

            image: {
                url: "https://images.unsplash.com/photo-1547592180-85f173990554",
                filename: "campusnear-mess"
            },

            price: 2500,

            location:
                `Near ${college.shortName}, ${college.city}`,

            country: "India",

            ownerContact: "9876543210",

            mealType: "Veg",

            meals: [
                "Breakfast",
                "Lunch",
                "Dinner"
            ],

            openingTime: "07:30",

            closingTime: "22:00",

            reviews: [],

            owner: OWNER_ID,

            college: college._id,

            geocoding: {
                type: "Point",

                coordinates: [
                    longitude + 0.0020,
                    latitude + 0.0012
                ]
            }
        });


        // Second mess
        messes.push({

            title: secondName,

            category: "Mess",

            description:
                `Student-friendly mess near ${college.name} offering affordable daily meals.`,

            image: {
                url: "https://images.unsplash.com/photo-1547592180-85f173990554",
                filename: "campusnear-mess"
            },

            price: 3000,

            location:
                `Near ${college.shortName}, ${college.city}`,

            country: "India",

            ownerContact: "9876543210",

            mealType: "Both",

            meals: [
                "Breakfast",
                "Lunch",
                "Dinner"
            ],

            openingTime: "07:30",

            closingTime: "22:00",

            reviews: [],

            owner: OWNER_ID,

            college: college._id,

            geocoding: {
                type: "Point",

                coordinates: [
                    longitude - 0.0025,
                    latitude + 0.0018
                ]
            }
        });

    });

    await Mess.insertMany(messes);

    console.log(
        `${messes.length} messes inserted successfully`
    );
};


main()
    .then(async () => {

        await initDB();

        console.log(
            "Mess database initialized successfully"
        );

        await mongoose.connection.close();

    })
    .catch(async (err) => {

        console.log("Error:", err);

        await mongoose.connection.close();

    });