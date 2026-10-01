document.addEventListener("DOMContentLoaded", function () {

    // =====================================================
    // ELEMENTS
    // =====================================================

    const collegeInput =
        document.getElementById("collegeSearch");

    const suggestionsBox =
        document.getElementById("collegeSuggestions");

    const searchForm =
        document.getElementById("collegeSearchForm");

    const categorySelect =
        document.getElementById("category");


    // =====================================================
    // CHECK ELEMENTS
    // =====================================================

    if (
        !collegeInput ||
        !suggestionsBox ||
        !searchForm ||
        !categorySelect
    ) {
        return;
    }


    let colleges = [];


    // =====================================================
    // GET COLLEGES FROM SERVER
    // =====================================================

    fetch("/colleges/search")
        .then(response => {

            if (!response.ok) {
                throw new Error(
                    "Failed to fetch colleges"
                );
            }

            return response.json();

        })

        .then(data => {

            colleges = data;

        })

        .catch(error => {

            console.error(
                "College search error:",
                error
            );

        });


    // =====================================================
    // COLLEGE INPUT
    // =====================================================

    collegeInput.addEventListener(
        "input",
        function () {

            const searchValue =
                collegeInput.value
                    .trim()
                    .toLowerCase();


            suggestionsBox.innerHTML = "";


            // Empty input
            if (!searchValue) {

                suggestionsBox.style.display =
                    "none";

                return;

            }


            // =================================================
            // FILTER COLLEGES
            // =================================================

            const filteredColleges =
                colleges
                    .filter(college => {

                        const name =
                            college.name
                                ? college.name.toLowerCase()
                                : "";

                        const shortName =
                            college.shortName
                                ? college.shortName.toLowerCase()
                                : "";

                        return (
                            name.includes(searchValue) ||
                            shortName.includes(searchValue)
                        );

                    })
                    .slice(0, 8);


            // No result
            if (filteredColleges.length === 0) {

                suggestionsBox.style.display =
                    "none";

                return;

            }


            // =================================================
            // CREATE SUGGESTIONS
            // =================================================

            filteredColleges.forEach(
                college => {

                    const suggestion =
                        document.createElement("div");


                    suggestion.classList.add(
                        "college-suggestion-item"
                    );


                    suggestion.innerHTML = `

                        <i class="fa-solid fa-building-columns"></i>

                        <div>

                            <strong>
                                ${college.name}
                            </strong>

                            ${
                                college.shortName
                                    ? `<small>${college.shortName}</small>`
                                    : ""
                            }

                            ${
                                college.city || college.state
                                    ? `
                                        <span>
                                            ${college.city || ""}
                                            ${college.city && college.state ? ", " : ""}
                                            ${college.state || ""}
                                        </span>
                                      `
                                    : ""
                            }

                        </div>

                    `;


                    // =================================================
                    // SELECT SUGGESTION
                    // =================================================

                    suggestion.addEventListener(
                        "click",
                        function () {

                            collegeInput.value =
                                college.name;


                            suggestionsBox.innerHTML =
                                "";


                            suggestionsBox.style.display =
                                "none";

                        }
                    );


                    suggestionsBox.appendChild(
                        suggestion
                    );

                }
            );


            suggestionsBox.style.display =
                "block";

        }
    );


    // =====================================================
    // CLICK OUTSIDE
    // =====================================================

    document.addEventListener(
        "click",
        function (event) {

            if (
                !collegeInput.contains(event.target) &&
                !suggestionsBox.contains(event.target)
            ) {

                suggestionsBox.style.display =
                    "none";

            }

        }
    );


    // =====================================================
    // FORM SUBMIT
    // =====================================================

    searchForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            // =================================================
            // GET VALUES
            // =================================================

            const college =
                collegeInput.value.trim();


            const category =
                categorySelect.value;


            // =================================================
            // COLLEGE VALIDATION
            // =================================================

            if (!college) {

                collegeInput.focus();

                return;

            }


            // =================================================
            // ROUTES
            // =================================================

            const routes = {

                pg: "/pgs",

                cafe: "/cafes",

                mess: "/messes",

                laundry: "/laundries"

            };


            // =================================================
            // GET SELECTED ROUTE
            // =================================================

            const route =
                routes[category];


            // Safety check
            if (!route) {

                console.error(
                    "Invalid category:",
                    category
                );

                return;

            }


            // =================================================
            // CREATE URL
            // =================================================

            const url =
                `${route}?college=${encodeURIComponent(college)}`;


            // =================================================
            // DEBUG
            // =================================================

            console.log(
                "Selected College:",
                college
            );

            console.log(
                "Selected Category:",
                category
            );

            console.log(
                "Redirecting To:",
                url
            );


            // =================================================
            // REDIRECT
            // =================================================

            window.location.assign(url);

        }
    );

});