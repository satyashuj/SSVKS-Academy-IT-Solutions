document.addEventListener("DOMContentLoaded", () => {
    const loginTab = document.getElementById("loginTab");
    const regTab = document.getElementById("regTab");
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    // ==========================================
    // EMAILJS CONFIGURATION
    // ==========================================
    const EMAILJS_PUBLIC_KEY = "C0XgzTh8sivaWP-WG";
    const EMAILJS_SERVICE_ID = "service_a80cusb";
    const TEMPLATE_ID        = "template_tvwnr44";
    const ADMIN_EMAIL        = "satyanshusaxena1481@gmail.com";

    // Initialize EmailJS safely
    if (typeof emailjs !== "undefined") {
        try {
            emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
        } catch (err) {
            emailjs.init(EMAILJS_PUBLIC_KEY);
        }
    }

    // 1. Switch Between Login & Register Tabs
    loginTab.addEventListener("click", () => {
        loginTab.classList.add("active");
        regTab.classList.remove("active");
        loginForm.classList.add("active");
        registerForm.classList.remove("active");
    });

    regTab.addEventListener("click", () => {
        regTab.classList.add("active");
        loginTab.classList.remove("active");
        registerForm.classList.add("active");
        loginForm.classList.remove("active");
    });

    // 2. Show / Hide Password Eye Toggle
    document.querySelectorAll(".toggle-pass").forEach(icon => {
        icon.addEventListener("click", () => {
            const input = document.getElementById(icon.getAttribute("data-target"));
            if (input.type === "password") {
                input.type = "text";
                icon.textContent = "🙈";
            } else {
                input.type = "password";
                icon.textContent = "👁️";
            }
        });
    });

    // 3. Handle New Student Registration + Send Email
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const regStatus = document.getElementById("regStatus");
        const submitBtn = registerForm.querySelector(".submit-btn");

        const name = document.getElementById("regName").value.trim();
        const phone = document.getElementById("regPhone").value.trim();
        const email = document.getElementById("regEmail").value.trim().toLowerCase();
        const course = document.getElementById("regCourse").value;
        const password = document.getElementById("regPassword").value;
        const confirmPassword = document.getElementById("regConfirmPassword").value;

        if (password !== confirmPassword) {
            regStatus.innerHTML = `<div class="msg-error">❌ Passwords do not match!</div>`;
            return;
        }

        // Save student data in LocalStorage
        const studentData = { name, phone, email, course, password };
        localStorage.setItem("ssvks_user_" + email, JSON.stringify(studentData));

        submitBtn.disabled = true;
        submitBtn.textContent = "⏳ Registering...";

        const templateParams = {
            student_name: name,
            student_email: email,
            student_phone: phone,
            student_course: course,
            admin_email: ADMIN_EMAIL,
            reg_time: new Date().toLocaleString("en-IN")
        };

        // Background email send (non-blocking so UI never freezes)
        if (typeof emailjs !== "undefined") {
            emailjs.send(EMAILJS_SERVICE_ID, TEMPLATE_ID, templateParams)
                .then(() => console.log("✅ Registration emails sent!"))
                .catch((error) => console.error("EmailJS Error:", error));
        }

        regStatus.innerHTML = `<div class="msg-success">✅ Registration Successful! Confirmation sent to <strong>${email}</strong>. Redirecting to Login...</div>`;
        submitBtn.disabled = false;
        submitBtn.textContent = "✨ Register Account";
        registerForm.reset();

        setTimeout(() => {
            regStatus.innerHTML = "";
            loginTab.click();
            document.getElementById("loginEmail").value = email;
            document.getElementById("loginPassword").focus();
        }, 1400);
    });

    // 4. Handle Student Login (Supports all previous & new saved accounts)
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const loginStatus = document.getElementById("loginStatus");

        const email = document.getElementById("loginEmail").value.trim().toLowerCase();
        const password = document.getElementById("loginPassword").value;

        // Check all possible storage keys
        const savedUser =
            localStorage.getItem("ssvks_user_" + email) ||
            localStorage.getItem("SSVKS Academy & IT Solutions_user_" + email) ||
            localStorage.getItem("skillnova_user_" + email);

        if (!savedUser) {
            loginStatus.innerHTML = `<div class="msg-error">⚠️ Account not found for <strong>${email}</strong>! Please register first.</div>`;
            return;
        }

        const userObj = JSON.parse(savedUser);

        if (userObj.password === password) {
            // Set all session keys so dashboard.js always recognizes login
            const userString = JSON.stringify(userObj);
            localStorage.setItem("SSVKS Academy & IT Solutions_logged_in", userString);
            localStorage.setItem("ssvks_logged_in", userString);
            localStorage.setItem("skillnova_logged_in", userString);

            loginStatus.innerHTML = `<div class="msg-success">🎉 Welcome back, <strong>${userObj.name}</strong>! Opening Dashboard...</div>`;

            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 900);
        } else {
            loginStatus.innerHTML = `<div class="msg-error">❌ Incorrect password! Try again.</div>`;
        }
    });

    // 5. Forgot Password Notice
    document.getElementById("forgotPass").addEventListener("click", (e) => {
        e.preventDefault();
        const loginStatus = document.getElementById("loginStatus");
        loginStatus.innerHTML = `<div class="msg-success">📩 Contact SSVKS Academy & IT Solutions Support on WhatsApp or register a new account to reset password.</div>`;
    });
});