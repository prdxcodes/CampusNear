const categoryForm = document.getElementById("categoryForm");

if (categoryForm) {
    categoryForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const category = document.getElementById("serviceCategory").value;

        const routes = {
            pg: "/pgs/new",
            cafe: "/cafes/new",
            mess: "/messes/new",
            laundry: "/laundries/new"
        };

        if (!category || !routes[category]) {
            return;
        }

        window.location.href = routes[category];
    });
}