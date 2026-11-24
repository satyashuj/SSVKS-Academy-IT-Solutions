document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById("contactForm");
    const formStatus = document.getElementById("formStatus");

    // Apna WhatsApp number aur Email yahan update karein
    const whatsappNumber = "916394745461";
    const academyEmail = "satyanshusaxena1481@gmail.com";

    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const name = document.getElementById("name")?.value.trim() || "";
            const email = document.getElementById("email")?.value.trim() || "";
            const message = document.getElementById("message")?.value.trim() || "";
            
            // Optional fields (agar purana ya naya HTML form ho toh dono handle honge)
            const phone = document.getElementById("phone")?.value.trim() || "Not Provided";
            const interestEl = document.getElementById("interest") || document.getElementById("subject");
            const interest = interestEl ? interestEl.value.trim() : "General Inquiry";

            if (!name || !email || !interest || !message) {
                formStatus.innerHTML = `<p style="color: #f87171; font-weight: 600;">⚠️ Please fill all required fields.</p>`;
                return;
            }

            // 1. WhatsApp URL
            const waText = `*New Inquiry - SSVKS Academy & IT Solutions*%0A` +
                           `*Name:* ${name}%0A` +
                           `*Phone:* ${phone}%0A` +
                           `*Email:* ${email}%0A` +
                           `*Subject/Course:* ${interest}%0A` +
                           `*Message:* ${message}`;
            const waUrl = `https://wa.me/${whatsappNumber}?text=${waText}`;

            // 2. Email (Mailto) URL
            const mailtoUrl = `mailto:${academyEmail}` +
                              `?subject=${encodeURIComponent("SSVKS Academy & IT Solutions Inquiry: " + interest)}` +
                              `&body=${encodeURIComponent(
                                  `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nCourse/Subject: ${interest}\n\nMessage:\n${message}`
                              )}`;

            // Success Message + Both WhatsApp & Email Action Buttons
            formStatus.innerHTML = `
                <div class="status-success">
                    ✅ Thank you, <strong>${name}</strong>! Your inquiry for <strong>${interest}</strong> is ready.<br><br>
                    <a href="${waUrl}" target="_blank" style="display:inline-block; background:#10b981; color:#fff; padding:8px 14px; border-radius:6px; text-decoration:none; font-weight:600; margin:4px;">
                        📲 Send via WhatsApp
                    </a>
                    <a href="${mailtoUrl}" style="display:inline-block; background:#3b82f6; color:#fff; padding:8px 14px; border-radius:6px; text-decoration:none; font-weight:600; margin:4px;">
                        📧 Send via Email
                    </a>
                </div>
            `;

            contactForm.reset();
        });
    }

    // 3. FAQ Accordion Toggle
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach((item) => {
        const question = item.querySelector(".faq-question");
        if (question) {
            question.addEventListener("click", () => {
                item.classList.toggle("active");
                const symbol = question.querySelector("span");
                if (symbol) {
                    symbol.textContent = item.classList.contains("active") ? "−" : "+";
                }
            });
        }
    });
});