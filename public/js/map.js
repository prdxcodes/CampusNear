document.addEventListener("DOMContentLoaded", function () {

    const mapElement = document.getElementById("map");

    // Agar current page par map nahi hai
    if (!mapElement) {
        return;
    }

    // Get coordinates from HTML data attribute
    const coordinates = JSON.parse(
        mapElement.dataset.coordinates
    );

    // GeoJSON format:
    // [longitude, latitude]
    const longitude = coordinates[0];
    const latitude = coordinates[1];

    // Create map at exact property's location
    const map = L.map("map").setView(
        [latitude, longitude],
        17
    );

    // OpenStreetMap tiles
    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution: "&copy; OpenStreetMap contributors"
        }
    ).addTo(map);

    // Add marker at exact location
    L.marker([latitude, longitude])
        .addTo(map)
        .bindPopup(
            `<b>${mapElement.dataset.title}</b>`
        )
        .openPopup();

});