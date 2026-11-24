document.addEventListener("DOMContentLoaded", () => {
    // 1. Check Login
    const loggedInData =
        localStorage.getItem("SSVKS Academy & IT Solutions_logged_in") ||
        localStorage.getItem("ssvks_logged_in") ||
        localStorage.getItem("skillnova_logged_in");

    if (!loggedInData) {
        window.location.href = "login.html";
        return;
    }

    let user = JSON.parse(loggedInData);

    // Unique Certificate ID per student email
    if (!user.certId) {
        const hash = Math.abs(user.email.split("").reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)) % 900 + 100;
        user.certId = `SSVKS-2026-${hash}`;
    }

    // Default saved progress
    if (typeof user.progress !== "number") {
        user.progress = 65;
    }

    function saveUserState() {
        const userStr = JSON.stringify(user);
        localStorage.setItem("SSVKS Academy & IT Solutions_logged_in", userStr);
        localStorage.setItem("ssvks_logged_in", userStr);
        localStorage.setItem("skillnova_logged_in", userStr);
        localStorage.setItem("ssvks_user_" + user.email, userStr);

        // Save Certificate Record for Public Verification on index.html#verify
        const cleanCourse = (user.course || "Full Stack Development").replace(/\s*\(₹[^)]*\)/g, "").trim();
        const certRegistry = JSON.parse(localStorage.getItem("ssvks_verified_certs") || "{}");
        certRegistry[user.certId.toUpperCase()] = {
            name: user.name,
            course: cleanCourse,
            issueDate: user.certDate || new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
            status: user.progress === 100 ? "Completed & Verified" : "Active / In Training"
        };
        localStorage.setItem("ssvks_verified_certs", JSON.stringify(certRegistry));
    }

    // 2. Render Student Data
    function renderStudentData() {
        const firstLetter = user.name ? user.name.charAt(0).toUpperCase() : "S";
        document.getElementById("sidebarAvatar").textContent = firstLetter;
        document.getElementById("sidebarName").textContent = user.name;
        document.getElementById("headerName").textContent = user.name.split(" ")[0];

        const rawCourse = user.course || "Full Stack Development";
        const cleanCourseName = rawCourse.replace(/\s*\(₹[^)]*\)/g, "").trim();

        document.getElementById("statCourse").textContent = cleanCourseName;
        document.getElementById("overviewCourseTitle").textContent = "Track: " + cleanCourseName;
        document.getElementById("courseDetailName").textContent = cleanCourseName;

        // Certificate Preview Update
        document.getElementById("certStudentName").textContent = user.name;
        document.getElementById("certCourseName").textContent = cleanCourseName;
        document.getElementById("certIdDisplay").textContent = user.certId;
        document.getElementById("studentIdBadge").textContent = "ID: " + user.certId;

        // Profile Tab Inputs
        document.getElementById("profName").value = user.name || "";
        document.getElementById("profEmail").value = user.email || "";
        document.getElementById("profPhone").value = user.phone || "";
        document.getElementById("profCourse").value = cleanCourseName;

        // Payment Course Input
        const payCourseInput = document.getElementById("payCourseInfo");
        if (payCourseInput) payCourseInput.value = rawCourse;

        updateProgressUI();
        updateResourceLocks();
        renderSavedReceipt();
    }

    // 3. Persistent Progress & Certificate Unlock UI
    function updateProgressUI() {
        const p = user.progress;
        document.getElementById("progressPercent").textContent = p + "%";
        document.getElementById("progressFill").style.width = p + "%";

        const statProg = document.getElementById("statProgress");
        if (statProg) statProg.textContent = p + "% Completed";

        const certTabBtn = document.querySelector('.nav-item[data-tab="certificate"]');
        const completeBtn = document.getElementById("completeModuleBtn");

        if (p >= 100) {
            document.getElementById("certStatusText").textContent = "Unlocked 🏆";
            document.getElementById("certStatusText").style.color = "#34d399";
            if (certTabBtn) certTabBtn.innerHTML = "🏆 My Certificate (Unlocked)";
            if (completeBtn) {
                completeBtn.textContent = "🎉 Course 100% Completed!";
                completeBtn.disabled = true;
            }
        }
    }

    // 4. Unlock Notes & Projects Only After UTR Submission
    function updateResourceLocks() {
        const isPaid = Boolean(user.payment && user.payment.utr);
        document.querySelectorAll(".resource-lock-btn").forEach(btn => {
            if (isPaid) {
                btn.textContent = "⬇ Open / Download Resource";
                btn.onclick = () => window.open(btn.getAttribute("data-url"), "_blank");
            } else {
                btn.textContent = "🔒 Submit Fee UTR to Unlock";
                btn.onclick = () => {
                    alert("⚠️ Please submit your 12-digit Fee Payment UTR in the 'Fee Payment & QR' tab first to unlock downloads.");
                    document.querySelector('.nav-item[data-tab="payment"]').click();
                };
            }
        });
    }

    // 5. Render Fee Receipt if Paid
    function renderSavedReceipt() {
        const receiptBox = document.getElementById("feeReceiptBox");
        if (user.payment && user.payment.utr && receiptBox) {
            receiptBox.style.display = "block";
            document.getElementById("recNo").textContent = user.payment.receiptNo;
            document.getElementById("recDate").textContent = user.payment.date;
            document.getElementById("recName").textContent = user.name;
            document.getElementById("recEmail").textContent = user.email;
            document.getElementById("recCourse").textContent = user.course;
            document.getElementById("recApp").textContent = user.payment.app;
            document.getElementById("recUtr").textContent = user.payment.utr;
        }
    }

    // Date Initialization
    const today = new Date().toLocaleDateString("en-IN", {
        weekday: "long", year: "numeric", month: "long", day: "numeric"
    });
    document.getElementById("currentDate").textContent = today;

    const formattedDate = new Date().toLocaleDateString("en-IN", {
        day: "2-digit", month: "short", year: "numeric"
    });
    user.certDate = formattedDate;
    document.getElementById("certIssueDate").textContent = "Date: " + formattedDate;

    saveUserState();
    renderStudentData();

    // 6. Sidebar Tab Switching
    const navItems = document.querySelectorAll(".nav-item");
    const tabContents = document.querySelectorAll(".tab-content");

    navItems.forEach(btn => {
        btn.addEventListener("click", () => {
            navItems.forEach(item => item.classList.remove("active"));
            tabContents.forEach(tab => tab.classList.remove("active"));

            btn.classList.add("active");
            const targetTab = document.getElementById("tab-" + btn.getAttribute("data-tab"));
            if (targetTab) targetTab.classList.add("active");
            document.getElementById("sidebar").classList.remove("open");
        });
    });

    // 7. Mobile Sidebar Toggle
    document.getElementById("menuToggle").addEventListener("click", () => {
        document.getElementById("sidebar").classList.add("open");
    });
    document.getElementById("closeSidebar").addEventListener("click", () => {
        document.getElementById("sidebar").classList.remove("open");
    });

    // 8. Complete Module Button (Persists in localStorage)
    const completeBtn = document.getElementById("completeModuleBtn");
    if (completeBtn) {
        completeBtn.addEventListener("click", () => {
            if (user.progress < 100) {
                user.progress = Math.min(100, user.progress + 15);
                saveUserState();
                updateProgressUI();
            }
        });
    }

    // 9. Profile Update Form
    document.getElementById("profileUpdateForm").addEventListener("submit", (e) => {
        e.preventDefault();
        user.name = document.getElementById("profName").value.trim();
        user.phone = document.getElementById("profPhone").value.trim();
        user.course = document.getElementById("profCourse").value.trim();

        saveUserState();
        renderStudentData();
        document.getElementById("profileSaveMsg").textContent = "✅ Profile & Certificate updated successfully!";
    });

    // 10. Copy UPI ID
    window.copyUpiId = function () {
        const upi = document.getElementById("academyUpiId").textContent;
        navigator.clipboard.writeText(upi);
        alert("✅ UPI ID Copied: " + upi);
    };

    // 11. Fee Payment & UTR Form Submit
    const paymentForm = document.getElementById("paymentConfirmForm");
    if (paymentForm) {
        paymentForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const utr = document.getElementById("payUtr").value.trim();
            const app = document.getElementById("payApp").value.trim();
            const whatsappNumber = "919876543210"; // Apna WhatsApp number daalein

            user.payment = {
                utr: utr,
                app: app,
                receiptNo: "REC-" + Math.floor(100000 + Math.random() * 900000),
                date: formattedDate
            };

            saveUserState();
            updateResourceLocks();
            renderSavedReceipt();

            const waMsg = `*Fee Payment Verification - SSVKS Academy*%0A` +
                          `*Student:* ${user.name}%0A` +
                          `*Course:* ${user.course}%0A` +
                          `*App:* ${app}%0A` +
                          `*UTR:* ${utr}`;

            document.getElementById("payStatusMsg").innerHTML = `
                <div style="background:rgba(16,185,129,0.12); border:1px solid #10b981; padding:12px; border-radius:10px; color:#34d399; font-size:13.5px;">
                    ✅ Payment UTR Saved! Course Notes & Projects are now Unlocked.<br>
                    <a href="https://wa.me/${whatsappNumber}?text=${waMsg}" target="_blank" class="action-btn" style="margin-top:8px;">📲 Send Receipt on WhatsApp</a>
                </div>
            `;
            paymentForm.reset();
            document.getElementById("payCourseInfo").value = user.course || "Selected Program";
        });
    }

    // 12. Print Only Fee Receipt
    window.printFeeReceipt = function () {
        const receiptHTML = document.getElementById("printableReceipt").outerHTML;
        const win = window.open("", "", "width=800,height=600");
        win.document.write(`<html><head><title>Fee Receipt - SSVKS Academy</title></head><body style="font-family:sans-serif; padding:30px;">${receiptHTML}<script>window.print();window.close();<\/script></body></html>`);
        win.document.close();
    };

    // 13. Logout
    document.getElementById("logoutBtn").addEventListener("click", () => {
        localStorage.removeItem("SSVKS Academy & IT Solutions_logged_in");
        localStorage.removeItem("ssvks_logged_in");
        localStorage.removeItem("skillnova_logged_in");
        window.location.href = "login.html";
    });
});