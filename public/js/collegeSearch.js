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


    // =====================================================
    // HERO CATEGORY DROPDOWN
    // =====================================================

    const dropdownWrapper =
        document.getElementById("heroCategoryDropdown");

    const trigger =
        dropdownWrapper
            ? dropdownWrapper.querySelector(
                ".custom-select-trigger"
            )
            : null;

    const optionsList =
        dropdownWrapper
            ? dropdownWrapper.querySelector(
                ".custom-options-list"
            )
            : null;

    const options =
        dropdownWrapper
            ? dropdownWrapper.querySelectorAll(
                ".custom-option"
            )
            : [];

    const selectedText =
        document.getElementById(
            "heroSelectedCategoryText"
        );

    const hiddenInput =
        document.getElementById(
            "heroCategoryValue"
        );


    // =====================================================
    // CHECK REQUIRED ELEMENTS
    // =====================================================

    if (
        !collegeInput ||
        !suggestionsBox ||
        !searchForm ||
        !dropdownWrapper ||
        !trigger ||
        !optionsList ||
        !selectedText ||
        !hiddenInput
    ) {

        console.error(
            "CampusNear Hero: Required element not found."
        );

        return;

    }


    let colleges = [];


    // =====================================================
    // CATEGORY CONFIGURATION
    // =====================================================

    const categories = {

        pg: {
            text: "PG",
            route: "/pgs"
        },

        cafe: {
            text: "Cafe",
            route: "/cafes"
        },

        mess: {
            text: "Mess",
            route: "/messes"
        },

        laundry: {
            text: "Laundry",
            route: "/laundries"
        }

    };


    // =====================================================
    // SET CATEGORY
    // =====================================================

    function setCategory(value) {

        // Safety check

        if (!categories[value]) {

            value = "pg";

        }


        // Update hidden input

        hiddenInput.value =
            value;


        // Update visible text

        selectedText.textContent =
            categories[value].text;


        // Update active option

        options.forEach(function (option) {

            const optionValue =
                option.getAttribute(
                    "data-value"
                );


            if (optionValue === value) {

                option.classList.add(
                    "active"
                );

            } else {

                option.classList.remove(
                    "active"
                );

            }

        });


        console.log(
            "Selected Category:",
            value
        );

    }


    // =====================================================
    // DETERMINE CATEGORY FROM CURRENT PAGE
    // =====================================================

    const currentPath =
        window.location.pathname;


    const pathCategory = {

        "/pgs": "pg",

        "/cafes": "cafe",

        "/messes": "mess",

        "/laundries": "laundry"

    };


    const currentCategory =
        pathCategory[currentPath] || "pg";


    // Set initial category

    setCategory(
        currentCategory
    );


    // =====================================================
    // OPEN / CLOSE CATEGORY DROPDOWN
    // =====================================================

    trigger.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();


            dropdownWrapper.classList.toggle(
                "open"
            );

        }
    );


    // =====================================================
    // SELECT CATEGORY
    // =====================================================

    optionsList.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();


            // Find clicked option

            const clickedOption =
                event.target.closest(
                    ".custom-option"
                );


            // If clicked element isn't an option

            if (!clickedOption) {

                return;

            }


            // Get category value

            const value =
                clickedOption.getAttribute(
                    "data-value"
                );


            console.log(
                "Category option clicked:",
                value
            );


            // Update category

            setCategory(
                value
            );


            // Close dropdown

            dropdownWrapper.classList.remove(
                "open"
            );

        }
    );


    // =====================================================
    // GET COLLEGES FROM SERVER
    // =====================================================

    fetch("/colleges/search")

        .then(function (response) {

            if (!response.ok) {

                throw new Error(
                    "Failed to fetch colleges"
                );

            }

            return response.json();

        })

        .then(function (data) {

            colleges = data;

        })

        .catch(function (error) {

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


            // Clear previous suggestions

            suggestionsBox.innerHTML =
                "";


            // =================================================
            // EMPTY INPUT
            // =================================================

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
                    .filter(function (college) {

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


            // =================================================
            // NO RESULTS
            // =================================================

            if (
                filteredColleges.length === 0
            ) {

                suggestionsBox.style.display =
                    "none";

                return;

            }


            // =================================================
            // CREATE SUGGESTIONS
            // =================================================

            filteredColleges.forEach(
                function (college) {

                    const suggestion =
                        document.createElement(
                            "div"
                        );


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
                                college.city ||
                                college.state
                                    ? `
                                        <span>
                                            ${college.city || ""}
                                            ${
                                                college.city &&
                                                college.state
                                                    ? ", "
                                                    : ""
                                            }
                                            ${college.state || ""}
                                        </span>
                                      `
                                    : ""
                            }

                        </div>

                    `;


                    // =================================================
                    // SELECT COLLEGE SUGGESTION
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

            // Close college suggestions

            if (
                !collegeInput.contains(
                    event.target
                ) &&
                !suggestionsBox.contains(
                    event.target
                )
            ) {

                suggestionsBox.style.display =
                    "none";

            }


            // Close category dropdown

            if (
                !dropdownWrapper.contains(
                    event.target
                )
            ) {

                dropdownWrapper.classList.remove(
                    "open"
                );

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
                hiddenInput.value;


            // =================================================
            // VALIDATE COLLEGE
            // =================================================

            if (!college) {

                collegeInput.focus();

                return;

            }


            // =================================================
            // VALIDATE CATEGORY
            // =================================================

            if (!categories[category]) {

                console.error(
                    "Invalid category:",
                    category
                );

                return;

            }


            // =================================================
            // GET ROUTE
            // =================================================

            const route =
                categories[category].route;


            // =================================================
            // CREATE URL
            // =================================================

            const url =
                `${route}?college=${encodeURIComponent(
                    college
                )}`;


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

            window.location.assign(
                url
            );

        }
    );

});