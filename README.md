# CampusNear 🎓📍

> **Everything You Need, Near Your Campus.**

[![Live Demo](https://img.shields.io/badge/Live-Demo-d94b3d?style=for-the-badge)](https://campusnear.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-CampusNear-181717?style=for-the-badge&logo=github)](https://github.com/prdxcodes/CampusNear)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Pradyuman%20Singh-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/pradyumansingh2007/)

CampusNear is a full-stack web application built to help college students discover useful places and services around their campus from a single platform.

Students can explore **PGs, hostels, cafes, messes, and laundry services**, view their details, check locations on an interactive map, and connect with service owners.

The platform also provides authentication and authorization features that allow owners to create and manage their own listings securely.

🌐 **Live Website:** https://campusnear.onrender.com

---

## 🚀 About the Project

Finding a suitable place to stay, eat, study, or access essential services near a college can often require searching across multiple platforms.

**CampusNear brings these campus-related services together in one place.**

The platform is designed around a college-based discovery system where students can:

- Search for their college
- Get college autocomplete suggestions
- Explore available categories
- View nearby listings
- Check prices and descriptions
- View owner contact information
- See listing locations on a map
- Read reviews and ratings

Owners can also register on the platform and create, edit, and delete their own listings.

---

# ✨ Features

## 🎓 College-Based Discovery

CampusNear provides a college-focused discovery experience.

Users can:

- Search for colleges
- Get autocomplete suggestions
- Select a college
- Explore places associated with that college
- Filter listings based on college

Each college contains information such as:

- College name
- Short name
- Location
- GeoJSON coordinates

A `2dsphere` index is also used for geospatial data.

---

## 🏠 PG Listings

Students can discover PG accommodations with information such as:

- PG name
- Description
- Price
- Location
- Contact information
- Images
- College association
- Owner information
- Map location
- Reviews
- Ratings

---

## 🛏️ Hostel Listings

CampusNear also supports hostel listings so students can discover hostel accommodation options around their campus.

---

## ☕ Cafe Listings

Cafe listings can contain:

- Cafe name
- Description
- Price
- Cuisine
- Opening time
- Closing time
- Location
- Contact information
- Images
- College association
- Owner information
- Reviews
- Ratings

---

## 🍛 Mess Listings

Mess listings provide information such as:

- Mess name
- Description
- Price
- Veg / Non-Veg / Both
- Available meals
- Opening time
- Closing time
- Location
- Contact information
- Images
- College association
- Owner information
- Reviews
- Ratings

---

## 👕 Laundry Listings

Laundry listings can include:

- Laundry name
- Description
- Price
- Services offered
- Pickup and delivery availability
- Location
- Contact information
- Images
- College association
- Owner information
- Reviews
- Ratings

---

## 🗺️ Location & Map Integration

CampusNear integrates location services to help users understand where a listing is located.

The location system uses:

- OpenStreetMap
- Nominatim
- Leaflet
- Latitude / Longitude
- GeoJSON Point structure

Location flow:

```text
Address
   ↓
Nominatim Geocoding
   ↓
Latitude + Longitude
   ↓
GeoJSON Point
   ↓
MongoDB
   ↓
Leaflet Interactive Map

GeoJSON coordinates are stored in the following format:

{
    type: "Point",
    coordinates: [longitude, latitude]
}
🔐 Authentication & Authorization

CampusNear uses authentication and authorization to protect user-owned listings.

Users can:

Sign up
Log in
Log out
Create listings
Edit their own listings
Delete their own listings

Users cannot:

Edit another user's listing
Delete another user's listing

The general authorization flow is:

User
 ↓
Sign Up / Login
 ↓
Authenticated Session
 ↓
Create Listing
 ↓
Listing Owner
 ↓
Edit Own Listing
 ↓
Delete Own Listing
🖼️ Image Upload

CampusNear uses Cloudinary for image storage.

Image flow:

User
 ↓
Upload Image
 ↓
Cloudinary
 ↓
Image URL
 ↓
MongoDB
 ↓
Listing

The image URL is stored with the listing data in MongoDB.

⭐ Reviews & Ratings

CampusNear supports reviews and ratings for listings.

Students can use reviews and ratings to get additional information before choosing a place.

This helps create a more informative discovery experience for users.

💬 Flash Messages

The application uses flash messages to provide feedback for important actions such as:

Successful login
Successful signup
Listing creation
Listing update
Listing deletion
Validation errors
Authorization errors
📱 Responsive Design

CampusNear is designed to work across different screen sizes.

Supported layouts include:

Desktop
Laptop
Tablet
Mobile

The interface includes responsive:

Navigation
Search
Listing cards
Forms
Maps
Buttons
Layouts
🛠️ Tech Stack
Frontend
Technology	Purpose
HTML5	Page structure
CSS3	Styling and responsive design
JavaScript	Client-side functionality
EJS	Server-side templating
Bootstrap	UI components and responsive layout
Font Awesome	Icons
Leaflet.js	Interactive maps
Backend
Technology	Purpose
Node.js	JavaScript runtime
Express.js	Backend framework
Database
Technology	Purpose
MongoDB	Database
MongoDB Atlas	Cloud database
Mongoose	MongoDB object modeling
Authentication
Technology	Purpose
Passport.js	Authentication
Express Session	Session management
Validation
Technology	Purpose
Joi	Server-side validation
Image Storage
Technology	Purpose
Cloudinary	Image upload and storage
Location Services
Technology	Purpose
OpenStreetMap	Map data
Nominatim	Address geocoding
Leaflet	Interactive maps
Development Tools
Tool	Purpose
Git	Version control
GitHub	Repository hosting
VS Code	Development environment
🏗️ Project Architecture

CampusNear follows an MVC-style architecture with reusable controllers for different listing categories.

CampusNear
│
├── controllers/
│   └── Reusable place controllers
│
├── models/
│   ├── User.js
│   ├── College.js
│   ├── PG.js
│   ├── Cafe.js
│   ├── Mess.js
│   ├── Laundry.js
│   └── Review.js
│
├── routes/
│   ├── pg.js
│   ├── cafe.js
│   ├── mess.js
│   ├── laundry.js
│   ├── college.js
│   ├── user.js
│   └── about.js
│
├── views/
│   ├── layouts/
│   ├── partials/
│   ├── pgs/
│   ├── cafes/
│   ├── messes/
│   ├── laundries/
│   ├── users/
│   └── about.ejs
│
├── public/
│   ├── css/
│   ├── js/
│   └── images/
│
├── middleware/
│
├── init/
│   └── Database seed files
│
├── schema.js
├── app.js
├── package.json
└── README.md
🧩 Main Modules
1. User Module

Responsible for:

User registration
Login
Logout
Session management
Authentication
Authorization
2. College Module

The College collection stores colleges used for campus-based discovery.

A college contains:

College
│
├── name
├── shortName
├── location
└── GeoJSON coordinates

A 2dsphere index is used for geospatial data.

3. Places Module

CampusNear currently supports multiple place categories:

Places
│
├── PG
├── Hostel
├── Cafe
├── Mess
└── Laundry

Different categories can have different information based on their purpose.

♻️ Reusable Controller Architecture

One of the important backend design decisions in CampusNear is the use of a reusable controller factory.

Instead of writing completely separate CRUD logic for every category, common operations are abstracted into a reusable controller.

Conceptually:

createPlaceController(
    Model,
    category,
    viewsPath,
    redirectPath
)

This approach helps reduce duplicated code and makes the application easier to maintain.

The reusable architecture is applied across listing categories such as:

PG
Cafe
Mess
Laundry
🔄 Application Flow

The general student flow is:

                 CampusNear
                     │
                     ▼
                 Homepage
                     │
                     ▼
              Search College
                     │
                     ▼
             Select Category
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
       PG          Cafe          Mess
                     │
                     ▼
                  Laundry
                     │
                     ▼
               View Listings
                     │
                     ▼
                Open Place
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
      Details      Contact       Map
                     │
                     ▼
               Reviews/Ratings
🏠 Homepage

The homepage provides the main entry point to CampusNear.

It includes:

CampusNear branding
Hero section
College search
College autocomplete
Category selection
Recommended places
Navigation
Responsive interface

The homepage allows users to start their campus discovery journey quickly.

📍 Place Management Flow

Owners can manage their listings through the following workflow:

Login
  ↓
Select Category
  ↓
Open Listing Form
  ↓
Enter Place Information
  ↓
Enter Location
  ↓
Geocode Location
  ↓
Upload Image
  ↓
Save Listing
  ↓
Listing Created

After creating a listing, the owner can:

View Listing
     ↓
Edit Listing
     ↓
Update Information

or:

View Listing
     ↓
Delete Listing
🔧 CRUD Operations

CampusNear supports complete CRUD operations for its major place categories.

Create
POST /pgs
POST /cafes
POST /messes
POST /laundries
Read
GET /pgs
GET /cafes
GET /messes
GET /laundries
Update
PUT /pgs/:id
PUT /cafes/:id
PUT /messes/:id
PUT /laundries/:id
Delete
DELETE /pgs/:id
DELETE /cafes/:id
DELETE /messes/:id
DELETE /laundries/:id
🗄️ Database Structure

CampusNear uses MongoDB Atlas as its production database.

Database:

CampusNear

Main collections include:

CampusNear
│
├── users
├── colleges
├── pgs
├── cafes
├── messes
├── laundries
└── reviews
Database Relationships

The major relationships can be represented as:

                    College
                       │
          ┌────────────┼────────────┐
          │            │            │
          ▼            ▼            ▼
         PG           Cafe         Mess
          │
          │
          ▼
       Laundry

Users are associated with the listings they own:

                 User
                  │
       ┌──────────┼──────────┐
       │          │          │
       ▼          ▼          ▼
      PG         Cafe       Mess
                            │
                            ▼
                         Laundry

Reviews are associated with the corresponding listings and users.

🎓 College System

Each college can contain:

Name
Short name
Location
GeoJSON coordinates

The college system supports:

College search
College autocomplete
College-based filtering
Location information
Geospatial indexing

The basic structure is:

College
│
├── name
├── shortName
├── location
└── coordinates
      │
      └── GeoJSON Point
🗺️ Location System

The location workflow is:

User enters address
        ↓
Nominatim
        ↓
Geocoding
        ↓
Latitude + Longitude
        ↓
GeoJSON Point
        ↓
MongoDB
        ↓
Leaflet
        ↓
Interactive Map

CampusNear uses OpenStreetMap data through Nominatim for geocoding and Leaflet for displaying interactive maps.

🖼️ Image System

The image workflow is:

Listing Form
     ↓
Image Upload
     ↓
Cloudinary
     ↓
Image URL
     ↓
MongoDB
     ↓
Listing Display

This keeps image storage separate from the application server.

🛡️ Validation

Joi is used for server-side validation.

Validation helps ensure that listing data follows the expected structure before it is processed and stored in MongoDB.

This helps reduce invalid or incomplete data entering the database.

🔐 Security & Authorization

CampusNear implements ownership-based authorization.

A logged-in user can manage only their own listings.

Authenticated User
        │
        ▼
Check Listing Owner
        │
   ┌────┴────┐
   │         │
   ▼         ▼
  Owner    Not Owner
   │         │
   ▼         ▼
Allow      Deny

This prevents users from modifying or deleting listings belonging to other users.

🌐 Deployment

CampusNear is deployed and publicly accessible.

Production Environment
Component	Service
Application Hosting	Render
Database	MongoDB Atlas
Image Storage	Cloudinary
Maps	Leaflet + OpenStreetMap
Geocoding	Nominatim
Live Website

https://campusnear.onrender.com

The deployed application is fully working in its current production configuration.

⚙️ Installation
1. Clone the Repository
git clone https://github.com/prdxcodes/CampusNear.git

Move into the project directory:

cd CampusNear
2. Install Dependencies
npm install
🔑 Environment Variables

Create a .env file in the project root.

Example:

ATLASDB_URL=your_mongodb_connection_string

SECRET=your_session_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret

Use the environment variables required by your project configuration.

Important: Never commit .env or private credentials to GitHub.

▶️ Running Locally

Start the application with:

node app.js

For development with Nodemon:

nodemon app.js

The application will run on the configured local port.

For example:

http://localhost:8080
🗃️ Database Initialization

After configuring MongoDB, initial database data can be inserted using the seed files available inside the init/ directory.

Example:

node init/college.js

Other seed scripts can be executed according to the available initialization files.

📂 Project Structure
CampusNear/
│
├── controllers/
│   ├── pgController.js
│   ├── cafeController.js
│   ├── messController.js
│   ├── laundryController.js
│   ├── placeController.js
│   ├── user.js
│   ├── home.js
│   └── review.js
│ 
├── models/
│   ├── user.js
│   ├── college.js
│   ├── pg.js
│   ├── cafe.js
│   ├── mess.js
│   ├── laundry.js
│   └── review.js
│
├── routes/
│   ├── pg.js
│   ├── cafe.js
│   ├── mess.js
│   ├── laundry.js
│   ├── college.js
│   ├── user.js
│   ├── home.js
│   ├── review.js 
│   └── staticPages.js
│
├── views/
│   ├── layouts/
│   ├── home/
│   ├── pgs/
│   ├── cafes/
│   ├── messes/
│   ├── laundries/
│   ├── user/
│   └── staticPages/
│
├── public/
│   ├── css/
│   ├── js/
│   └── images/
│
├── middleware/
│
├── init/
│
├── schema.js
├── app.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
🚀 Future Roadmap

The project can be extended with several features in future versions.

Planned Improvements
⭐ Advanced review and rating system
🔎 Advanced listing filters
📍 Radius-based nearby search
❤️ Favorite / saved places
🔔 Notifications
💬 Student-owner communication
📊 Owner dashboard
📈 Listing analytics
🗺️ Advanced geospatial search
📚 Stationery listings
🛏️ Expanded hostel management
💳 Booking / enquiry functionality
📱 Progressive Web App support
🔐 Additional security improvements
📚 Learning Outcomes

Building CampusNear provided practical experience in:

Full-stack web development
Node.js
Express.js
MongoDB
MongoDB Atlas
Mongoose
MVC architecture
RESTful routing
Authentication
Authorization
Passport.js
Express Sessions
CRUD operations
Middleware
Joi validation
EJS templating
Responsive CSS
JavaScript
API integration
Geocoding
GeoJSON
Interactive maps
Cloudinary
Git
GitHub
Deployment with Render
🎯 Project Goals

CampusNear was built with the following goals:

Make campus discovery easier for students
Bring multiple student services into one platform
Provide college-based place discovery
Help students find accommodation and essential services
Provide useful information such as price, contact, and location
Give local owners a platform to showcase their services
Provide an accessible and responsive user experience
Demonstrate practical full-stack web development
👨‍💻 Developer
Pradyuman Singh

B.Tech — Computer Science & Engineering (AI-ML)
Ajay Kumar Garg Engineering College, Ghaziabad
2nd Year

CampusNear is a solo-developed full-stack project.

The project was designed and developed independently, including:

Frontend development
Backend development
Database design
Authentication
Authorization
CRUD functionality
College search
Location integration
Map integration
Image upload system
Reviews and ratings
Responsive UI
Reusable backend architecture
Deployment
Connect With Me

🔗 Project Links
🌐 Live Demo

https://campusnear.onrender.com

💻 GitHub Repository

https://github.com/prdxcodes/CampusNear

👨‍💻 GitHub Profile

https://github.com/prdxcodes

💼 LinkedIn

https://www.linkedin.com/in/pradyumansingh2007/

⭐ Support

If you find CampusNear interesting, consider giving the repository a ⭐ on GitHub.

📌 CampusNear

Find places. Discover possibilities. Make campus life easier.

Built independently by Pradyuman Singh ❤️ 