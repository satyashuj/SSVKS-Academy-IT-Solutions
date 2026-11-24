
console.log("Welcome to SSVKS Academy & IT Solutions Academy - About Us");

const cards = document.querySelectorAll(".feature-card");

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
});

console.log("Welcome to SSVKS Academy & IT Solutions Academy - About Us");

document.addEventListener("DOMContentLoaded", () => {
    // 1. Scroll Reveal Animation (Cards ke liye)
    const cards = document.querySelectorAll(".feature-card, .about-card, .step-card");

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";

                setTimeout(() => {
                    entry.target.style.transform = "";
                }, 700);

                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    cards.forEach((card) => {
        card.style.animation = "none";
        card.style.opacity = "0";
        card.style.transform = "translateY(30px)";
        card.style.transition = "opacity 0.7s ease, transform 0.7s ease";
        observer.observe(card);
    });

    // 2. Live Number Counter Animation (500+, 15+, 50+, 98% ke liye)
    const counters = document.querySelectorAll(".counter");

    counters.forEach((counter) => {
        const target = +counter.getAttribute("data-target");
        const speed = 50; // lower = faster

        const updateCount = () => {
            const current = +counter.innerText;
            const increment = Math.ceil(target / speed);

            if (current < target) {
                counter.innerText = current + increment;
                setTimeout(updateCount, 30);
            } else {
                counter.innerText = target;
            }
        };

        updateCount();
    });
});

cards.forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition = "0.7s";
    observer.observe(card);
});
