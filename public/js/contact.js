const contactForm = document.getElementById("contactForm");
const contactSuccess = document.getElementById("contactSuccess");

if (contactForm && contactSuccess) {

    contactForm.addEventListener("submit", function (event) {

        event.preventDefault();

        contactForm.style.display = "none";

        contactSuccess.style.display = "flex";

        contactSuccess.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    });

}

//----------Email Subsribe btn msg----------//


const newsletterForm =
    document.getElementById("newsletterForm");

const newsletterFlash =
    document.getElementById("newsletterFlash");


if (newsletterForm && newsletterFlash) {

    newsletterForm.addEventListener("submit", function (event) {

        event.preventDefault();

        /* Clear email field */
        newsletterForm.reset();


        /* Scroll page to top */
        window.scrollTo({
            top: 0,
            behavior: "auto"
        });


        /* Show success flash */
        newsletterFlash.classList.add("show");


        /* Hide flash after 3.5 seconds */
        setTimeout(function () {

            newsletterFlash.classList.remove("show");

        }, 3500);

    });

}


