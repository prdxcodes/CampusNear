document.addEventListener("DOMContentLoaded", function () {

    const mapElement = document.getElementById("map");

    // Current page does not have a map
    if (!mapElement) {
        return;
    }

    // Check whether coordinates exist
    const coordinatesData = mapElement.dataset.coordinates;

    if (!coordinatesData) {
        return;
    }

    // Convert JSON string into array
    const coordinates = JSON.parse(coordinatesData);

    // GeoJSON format:
    // [longitude, latitude]
    const longitude = coordinates[0];
    const latitude = coordinates[1];

    // Create map
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

    // Marker
    L.marker([latitude, longitude])
        .addTo(map)
        .bindPopup(
            `<b>${mapElement.dataset.title || "Location"}</b>`
        )
        .openPopup();

});