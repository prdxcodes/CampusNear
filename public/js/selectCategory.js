document.addEventListener("DOMContentLoaded", function () {

    const categoryForm = document.getElementById("categoryForm");
    const categorySelect = document.getElementById("categorySelect");
    const selectButton = document.getElementById("categorySelectBtn");
    const selectedCategoryText =
        document.getElementById("selectedCategoryText");

    const hiddenInput =
        document.getElementById("serviceCategory");


    /* =========================================================
       CUSTOM DROPDOWN
    ========================================================= */

    if (categorySelect && selectButton) {

        /* OPEN / CLOSE DROPDOWN */

        selectButton.addEventListener("click", function (event) {

            event.stopPropagation();

            categorySelect.classList.toggle("open");

        });


        /* SELECT CATEGORY */

        const options =
            categorySelect.querySelectorAll(".category-option");

        options.forEach(function (option) {

            option.addEventListener("click", function (event) {

                event.stopPropagation();

                const value = this.dataset.value;
                const text = this.textContent.trim();

                // Set hidden input value
                hiddenInput.value = value;

                // Update button text
                selectedCategoryText.textContent = text;

                // Remove selected class
                options.forEach(function (item) {
                    item.classList.remove("selected");
                });

                // Add selected class
                this.classList.add("selected");

                // Close dropdown
                categorySelect.classList.remove("open");

            });

        });


        /* CLOSE DROPDOWN WHEN CLICKING OUTSIDE */

        document.addEventListener("click", function (event) {

            if (!categorySelect.contains(event.target)) {

                categorySelect.classList.remove("open");

            }

        });

    }


    /* =========================================================
       CATEGORY FORM SUBMIT
    ========================================================= */

    if (categoryForm) {

        categoryForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const category =
                hiddenInput ? hiddenInput.value : "";


            const routes = {

                pg: "/pgs/new",

                cafe: "/cafes/new",

                mess: "/messes/new",

                laundry: "/laundries/new"

            };


            /* INVALID CATEGORY */

            if (!category || !routes[category]) {

                alert("Please select a category.");

                return;

            }


            /* REDIRECT */

            window.location.href = routes[category];

        });

    }


    /* =========================================================
       RESET DROPDOWN WHEN MODAL CLOSES
    ========================================================= */

    const categoryModal =
        document.getElementById("categoryModal");

    if (categoryModal) {

        categoryModal.addEventListener(
            "hidden.bs.modal",
            function () {

                // Close dropdown
                if (categorySelect) {
                    categorySelect.classList.remove("open");
                }

                // Reset hidden value
                if (hiddenInput) {
                    hiddenInput.value = "";
                }

                // Reset button text
                if (selectedCategoryText) {
                    selectedCategoryText.textContent =
                        "Choose a category";
                }

                // Remove selected state
                if (categorySelect) {

                    const options =
                        categorySelect.querySelectorAll(
                            ".category-option"
                        );

                    options.forEach(function (option) {
                        option.classList.remove("selected");
                    });

                }

            }
        );

    }

});