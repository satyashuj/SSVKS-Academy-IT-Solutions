
// Team Cards Animation on Scroll

const teamCards = document.querySelectorAll(".team-card");

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }
    });
}, {
    threshold: 0.2
});

teamCards.forEach((card) => {
    observer.observe(card);
});

// Console Message
console.log("Welcome to SSVKS Academy & IT Solutions Academy Team Page!");
