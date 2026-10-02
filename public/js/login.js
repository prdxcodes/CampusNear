document.addEventListener("DOMContentLoaded", function () {

    const togglePassword = document.getElementById("togglePassword");
    const passwordInput = document.getElementById("password");

    if (!togglePassword || !passwordInput) {
        return;
    }

    togglePassword.addEventListener("click", function () {

        const isPassword = passwordInput.type === "password";

        passwordInput.type = isPassword ? "text" : "password";

        this.innerHTML = isPassword
            ? '<i class="fa-solid fa-eye-slash"></i>'
            : '<i class="fa-solid fa-eye"></i>';

    });

});