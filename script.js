/* =========================================
   NAVBAR
========================================= */

const navLinks = document.querySelectorAll(".nav-link");

const navbarCollapse = document.querySelector("#mainNavbar");


/* Close mobile menu after clicking a normal link */

navLinks.forEach(function (link) {

    link.addEventListener("click", function () {

        if (
            window.innerWidth <= 991 &&
            navbarCollapse.classList.contains("show")
        ) {

            const bsCollapse =
                bootstrap.Collapse.getInstance(navbarCollapse);

            if (bsCollapse) {
                bsCollapse.hide();
            }

        }

    });

});







document.addEventListener("DOMContentLoaded", function () {

    const cards = document.querySelectorAll(".slider-card");
    const nextBtn = document.querySelector(".slider-next");
    const prevBtn = document.querySelector(".slider-prev");

    if (cards.length === 0 || !nextBtn || !prevBtn) {
        console.log("Slider elements not found");
        return;
    }

    let currentSlide = 0;
    let autoSlide;

    function showSlide() {

        const total = cards.length;

        cards.forEach(function (card, index) {

            let position = (index - currentSlide + total) % total;

            card.classList.remove(
                "slide-center",
                "slide-left",
                "slide-right",
                "slide-far-left",
                "slide-far-right",
                "slide-hidden"
            );

            if (position === 0) {
                card.classList.add("slide-center");
            }
            else if (position === 1) {
                card.classList.add("slide-right");
            }
            else if (position === total - 1) {
                card.classList.add("slide-left");
            }
            else if (position === 2) {
                card.classList.add("slide-far-right");
            }
            else if (position === total - 2) {
                card.classList.add("slide-far-left");
            }
            else {
                card.classList.add("slide-hidden");
            }

        });
    }


    /* NEXT BUTTON */

    nextBtn.addEventListener("click", function () {

        currentSlide++;

        if (currentSlide >= cards.length) {
            currentSlide = 0;
        }

        showSlide();
        restartAutoSlide();

    });


    /* PREVIOUS BUTTON */

    prevBtn.addEventListener("click", function () {

        currentSlide--;

        if (currentSlide < 0) {
            currentSlide = cards.length - 1;
        }

        showSlide();
        restartAutoSlide();

    });


    /* AUTO SLIDE EVERY 4 SECONDS */

    function startAutoSlide() {

        autoSlide = setInterval(function () {

            currentSlide++;

            if (currentSlide >= cards.length) {
                currentSlide = 0;
            }

            showSlide();

        }, 4000);

    }


    function restartAutoSlide() {

        clearInterval(autoSlide);
        startAutoSlide();

    }


    /* START */

    showSlide();
    startAutoSlide();

});




// caursol js

/* =========================================================
   MY JOURNEY CAROUSEL
   Works with:
   #mvJourneyCarousel
   .mv-journey-slide
   .mv-journey-next
   .mv-journey-prev
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const carousel = document.getElementById("mvJourneyCarousel");

    if (!carousel) {
        console.log("My Journey carousel not found");
        return;
    }

    const slides = carousel.querySelectorAll(".mv-journey-slide");
    const nextBtn = carousel.querySelector(".mv-journey-next");
    const prevBtn = carousel.querySelector(".mv-journey-prev");
    const dots = carousel.querySelectorAll(".mv-journey-dot");
    const counter = carousel.querySelector(".mv-current-number");
    const progress = carousel.querySelector(".mv-journey-progress-fill");

    let current = 0;
    let timer = null;
    let animating = false;

    const AUTO_TIME = 4000;
    const ANIMATION_TIME = 900;


    /* =====================================================
       SHOW SLIDE
    ===================================================== */

    function showSlide(index, direction = "next") {

        if (animating || slides.length <= 1) {
            return;
        }

        if (index >= slides.length) {
            index = 0;
        }

        if (index < 0) {
            index = slides.length - 1;
        }

        if (index === current) {
            return;
        }

        animating = true;

        const oldSlide = slides[current];
        const newSlide = slides[index];


        /* Remove old animation classes */

        slides.forEach(function (slide) {

            slide.classList.remove(
                "mv-active",
                "mv-exit-up",
                "mv-exit-down"
            );

        });


        /* Put new slide outside viewport */

        newSlide.style.transition = "none";

        newSlide.style.visibility = "visible";
        newSlide.style.opacity = "1";

        if (direction === "next") {

            newSlide.style.transform =
                "translateY(100%)";

        } else {

            newSlide.style.transform =
                "translateY(-100%)";

        }


        /* Force browser repaint */

        newSlide.offsetHeight;


        /* Restore CSS transition */

        newSlide.style.transition = "";


        /* Move old slide */

        if (direction === "next") {

            oldSlide.classList.add(
                "mv-exit-up"
            );

        } else {

            oldSlide.classList.add(
                "mv-exit-down"
            );

        }


        /* Activate new slide */

        newSlide.classList.add(
            "mv-active"
        );

        newSlide.style.transform =
            "translateY(0)";


        /* Update current */

        current = index;

        updateCounter();
        updateDots();
        restartProgress();


        /* Cleanup */

        setTimeout(function () {

            slides.forEach(function (slide, i) {

                if (i !== current) {

                    slide.classList.remove(
                        "mv-active",
                        "mv-exit-up",
                        "mv-exit-down"
                    );

                    slide.style.visibility =
                        "hidden";

                    slide.style.opacity =
                        "0";

                    slide.style.transform =
                        "translateY(100%)";
                }

            });

            newSlide.style.visibility =
                "visible";

            newSlide.style.opacity =
                "1";

            newSlide.style.transform =
                "translateY(0)";

            animating = false;

        }, ANIMATION_TIME);
    }


    /* =====================================================
       NEXT
    ===================================================== */

    function nextSlide() {

        let nextIndex = current + 1;

        if (nextIndex >= slides.length) {
            nextIndex = 0;
        }

        showSlide(nextIndex, "next");

        restartAutoPlay();
    }


    /* =====================================================
       PREVIOUS
    ===================================================== */

    function previousSlide() {

        let previousIndex = current - 1;

        if (previousIndex < 0) {
            previousIndex = slides.length - 1;
        }

        showSlide(previousIndex, "previous");

        restartAutoPlay();
    }


    /* =====================================================
       COUNTER
    ===================================================== */

    function updateCounter() {

        if (!counter) {
            return;
        }

        counter.textContent =
            String(current + 1).padStart(2, "0");
    }


    /* =====================================================
       DOTS
    ===================================================== */

    function updateDots() {

        dots.forEach(function (dot, index) {

            dot.classList.toggle(
                "mv-active",
                index === current
            );

        });
    }


    /* =====================================================
       PROGRESS BAR
    ===================================================== */

    function restartProgress() {

        if (!progress) {
            return;
        }

        progress.classList.remove(
            "mv-running"
        );

        progress.style.animation = "none";

        progress.offsetHeight;

        progress.style.animation = "";

        progress.classList.add(
            "mv-running"
        );
    }


    /* =====================================================
       AUTOPLAY
    ===================================================== */

    function startAutoPlay() {

        clearInterval(timer);

        timer = setInterval(function () {

            let nextIndex = current + 1;

            if (nextIndex >= slides.length) {
                nextIndex = 0;
            }

            showSlide(
                nextIndex,
                "next"
            );

        }, AUTO_TIME);
    }


    /* =====================================================
       RESTART AUTOPLAY
    ===================================================== */

    function restartAutoPlay() {

        clearInterval(timer);

        startAutoPlay();
    }


    /* =====================================================
       NEXT BUTTON
    ===================================================== */

    if (nextBtn) {

        nextBtn.addEventListener(
            "click",
            function (e) {

                e.preventDefault();
                e.stopPropagation();

                nextSlide();

            }
        );
    }


    /* =====================================================
       PREVIOUS BUTTON
    ===================================================== */

    if (prevBtn) {

        prevBtn.addEventListener(
            "click",
            function (e) {

                e.preventDefault();
                e.stopPropagation();

                previousSlide();

            }
        );
    }


    /* =====================================================
       DOT BUTTONS
    ===================================================== */

    dots.forEach(function (dot, index) {

        dot.addEventListener(
            "click",
            function (e) {

                e.preventDefault();
                e.stopPropagation();

                if (index === current) {
                    return;
                }

                const direction =
                    index > current
                        ? "next"
                        : "previous";

                showSlide(
                    index,
                    direction
                );

                restartAutoPlay();

            }
        );

    });


    /* =====================================================
       PAUSE ON HOVER
    ===================================================== */

    carousel.addEventListener(
        "mouseenter",
        function () {

            clearInterval(timer);

            if (progress) {

                progress.style.animationPlayState =
                    "paused";

            }

        }
    );


    /* =====================================================
       RESUME ON MOUSE LEAVE
    ===================================================== */

    carousel.addEventListener(
        "mouseleave",
        function () {

            if (progress) {

                progress.style.animationPlayState =
                    "running";

            }

            startAutoPlay();

        }
    );


    /* =====================================================
       KEYBOARD CONTROL
    ===================================================== */

    carousel.setAttribute(
        "tabindex",
        "0"
    );

    carousel.addEventListener(
        "keydown",
        function (e) {

            if (e.key === "ArrowRight") {

                nextSlide();

            }

            if (e.key === "ArrowLeft") {

                previousSlide();

            }

        }
    );


    /* =====================================================
       INITIALIZE
    ===================================================== */

    slides.forEach(function (slide, index) {

        slide.classList.remove(
            "mv-active",
            "mv-exit-up",
            "mv-exit-down"
        );

        slide.style.transition = "";

        if (index === 0) {

            slide.classList.add(
                "mv-active"
            );

            slide.style.visibility =
                "visible";

            slide.style.opacity =
                "1";

            slide.style.transform =
                "translateY(0)";

        } else {

            slide.style.visibility =
                "hidden";

            slide.style.opacity =
                "0";

            slide.style.transform =
                "translateY(100%)";
        }

    });


    current = 0;

    updateCounter();
    updateDots();

    restartProgress();

    startAutoPlay();


    console.log(
        "My Journey carousel initialized successfully."
    );

});



/* =========================================================
   OJI ABOUT HERO — JAVASCRIPT
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* ==============================================
           COUNTER ANIMATION
        ============================================== */

        const counters =
            document.querySelectorAll(
                ".oji-count"
            );


        counters.forEach(function (counter) {

            const target =
                parseInt(
                    counter.getAttribute(
                        "data-target"
                    )
                );


            let current = 0;

            const duration = 1200;

            const steps = 40;

            const increment =
                target / steps;

            const interval =
                duration / steps;


            const timer =
                setInterval(function () {

                    current += increment;


                    if (current >= target) {

                        counter.textContent =
                            target;

                        clearInterval(timer);

                    } else {

                        counter.textContent =
                            Math.floor(
                                current
                            );

                    }

                }, interval);

        });


        /* ==============================================
           IMAGE PARALLAX
        ============================================== */

        const hero =
            document.querySelector(
                ".oji-about-hero"
            );


        const image =
            document.querySelector(
                ".oji-boss-image"
            );


        if (hero && image) {

            hero.addEventListener(
                "mousemove",
                function (event) {

                    const rect =
                        hero.getBoundingClientRect();


                    const x =
                        (
                            event.clientX -
                            rect.left
                        ) / rect.width;


                    const y =
                        (
                            event.clientY -
                            rect.top
                        ) / rect.height;


                    const moveX =
                        (x - 0.5) * 8;


                    const moveY =
                        (y - 0.5) * 5;


                    image.style.transform =
                        `translate(
                            ${moveX}px,
                            ${moveY}px
                        )`;

                }
            );


            hero.addEventListener(
                "mouseleave",
                function () {

                    image.style.transform =
                        "translate(0, 0)";

                }
            );

        }

    }
);



document.addEventListener("DOMContentLoaded", function () {

    const items = document.querySelectorAll(".oji-career-item");

    const observer = new IntersectionObserver(
        function (entries) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {

                    entry.target.classList.add("oji-career-show");

                }

            });

        },
        {
            threshold: 0.15
        }
    );

    items.forEach(function (item) {
        observer.observe(item);
    });

});


