document.addEventListener("DOMContentLoaded", function () {

    const mapElement =
        document.getElementById("map");

    if (!mapElement) {
        return;
    }

    const locationInput =
        document.getElementById("location");

    const suggestionsBox =
        document.getElementById("locationSuggestions");

    const searchBtn =
        document.getElementById("searchLocationBtn");

    const latitudeInput =
        document.getElementById("latitude");

    const longitudeInput =
        document.getElementById("longitude");

    const coordinatesText =
        document.getElementById("coordinatesText");


    // Existing coordinates
    const coordinates =
        JSON.parse(
            mapElement.dataset.coordinates || "[]"
        );


    // Default Delhi
    let latitude = 28.6139;
    let longitude = 77.2090;


    if (coordinates.length === 2) {

        longitude =
            Number(coordinates[0]);

        latitude =
            Number(coordinates[1]);

    }


    // =========================
    // CREATE MAP
    // =========================

    const map = L.map("map").setView(
        [latitude, longitude],
        coordinates.length === 2 ? 17 : 11
    );


    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution:
                "&copy; OpenStreetMap contributors"
        }
    ).addTo(map);


    let marker = null;


    // =========================
    // UPDATE COORDINATES
    // =========================

    function updateCoordinates(lat, lng) {

        latitudeInput.value = lat;
        longitudeInput.value = lng;

        coordinatesText.innerText =
            `Selected coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;

    }


    // =========================
    // ADD MARKER
    // =========================

    function addMarker(lat, lng) {

        if (marker) {

            map.removeLayer(marker);

        }


        marker = L.marker(
            [lat, lng],
            {
                draggable: true
            }
        ).addTo(map);


        marker
            .bindPopup(
                "<b>Drag marker to exact location</b>"
            )
            .openPopup();


        updateCoordinates(
            lat,
            lng
        );


        // Marker drag
        marker.on(
            "dragend",
            function () {

                const position =
                    marker.getLatLng();

                updateCoordinates(
                    position.lat,
                    position.lng
                );

            }
        );

    }


    // =========================
    // EXISTING MARKER
    // =========================

    if (coordinates.length === 2) {

        addMarker(
            latitude,
            longitude
        );

    }


    // =========================
    // SEARCH LOCATION
    // =========================

    async function searchLocation(query) {

        if (
            !query ||
            query.length < 3
        ) {

            suggestionsBox.innerHTML = "";

            return;

        }


        try {

            const response =
                await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&countrycodes=in&q=${encodeURIComponent(query)}`
                );


            const data =
                await response.json();


            suggestionsBox.innerHTML = "";


            if (data.length === 0) {

                suggestionsBox.innerHTML = `
                    <div class="suggestion-item">
                        No location found
                    </div>
                `;

                return;

            }


            // Suggestions
            data.forEach(function (place) {

                const item =
                    document.createElement("div");


                item.className =
                    "suggestion-item";


                item.textContent =
                    place.display_name;


                item.addEventListener(
                    "click",
                    function () {

                        const lat =
                            parseFloat(place.lat);

                        const lng =
                            parseFloat(place.lon);


                        locationInput.value =
                            place.display_name;


                        suggestionsBox.innerHTML =
                            "";


                        // Move map
                        map.setView(
                            [lat, lng],
                            17
                        );


                        // Add marker
                        addMarker(
                            lat,
                            lng
                        );

                    }
                );


                suggestionsBox.appendChild(
                    item
                );

            });

        } catch (error) {

            console.error(
                "Location search error:",
                error
            );

        }

    }


    // =========================
    // AUTOCOMPLETE
    // =========================

    let timeout;

    locationInput.addEventListener(
        "input",
        function () {

            clearTimeout(timeout);


            const query =
                locationInput.value.trim();


            timeout = setTimeout(
                function () {

                    searchLocation(query);

                },
                500
            );

        }
    );


    // =========================
    // SEARCH BUTTON
    // =========================

    searchBtn.addEventListener(
        "click",
        function () {

            const query =
                locationInput.value.trim();


            if (!query) {

                alert(
                    "Please enter a location."
                );

                return;

            }


            searchLocation(query);

        }
    );

});