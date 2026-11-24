
function generateCertificate() {
    const name = document.getElementById("studentName").value.trim();
    const course = document.getElementById("courseName").value.trim();
    const duration = document.getElementById("duration").value.trim();
    const date = document.getElementById("issueDate").value;

    if (!name || !course || !duration || !date) {
        alert("Please fill all certificate details!");
        return;
    }

    const certificateId =
        "SN-" + Date.now().toString(36).toUpperCase();

    document.getElementById("outName").textContent = name;
    document.getElementById("outCourse").textContent = course;
    document.getElementById("outDuration").textContent =
        "Duration: " + duration;

    document.getElementById("outDate").textContent =
        "Date: " + date;

    document.getElementById("outId").textContent =
        "ID: " + certificateId;

    const records = JSON.parse(
        localStorage.getItem("SSVKS Academy & IT Solutions Certificates") || "{}"
    );

    records[certificateId] = {
        name,
        course,
        duration,
        date
    };

    localStorage.setItem(
        "SSVKS Academy & IT SolutionsCertificates",
        JSON.stringify(records)
    );

    alert("Certificate generated successfully!");
}






const text = "Build Your Future";
const typingElement = document.getElementById("typingText");

let index = 0;

function typeEffect() {
    if (index < text.length) {
        typingElement.textContent += text.charAt(index);
        index++;

        setTimeout(typeEffect, 120);
    }
}

typeEffect();


function generateCertificate() {
    const name = document.getElementById("studentName").value.trim();
    const course = document.getElementById("courseName").value.trim();
    const duration = document.getElementById("duration").value.trim();
    const date = document.getElementById("issueDate").value;

    if (!name || !course || !duration || !date) {
        alert("Please fill all fields!");
        return;
    }

    document.getElementById("outName").textContent = name;
    document.getElementById("outCourse").textContent = course;
    document.getElementById("outDuration").textContent = "Duration: " + duration;
    document.getElementById("outDate").textContent = "Date: " + date;

    // Automatic Unique Certificate ID
    const randomID = Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase();

    const certificateID = "SNA-" + new Date().getFullYear() + "-" + randomID;

    document.getElementById("outId").textContent = certificateID;

    alert("Certificate Generated Successfully!");
}

function verifyCertificate() {
    const inputId = document.getElementById("verifyId").value.trim().toUpperCase();
    const resultEl = document.getElementById("verifyResult");

    if (!inputId) {
        resultEl.style.color = "#fda4af";
        resultEl.textContent = "⚠️ Please enter a Certificate ID.";
        return;
    }

    const certRegistry = JSON.parse(localStorage.getItem("ssvks_verified_certs") || "{}");
    const record = certRegistry[inputId];

    if (record) {
        resultEl.style.color = "#34d399";
        resultEl.innerHTML = `✅ <strong>Verified Certificate!</strong><br>Issued to <strong>${record.name}</strong> for <strong>${record.course}</strong> (${record.status} • ${record.issueDate})`;
    } else {
        resultEl.style.color = "#fda4af";
        resultEl.textContent = "❌ Invalid Certificate ID. No record found in SSVKS Academy database.";
    }
}


function verifyCertificate() {
    const inputField = document.getElementById("verifyId");
    const resultEl = document.getElementById("verifyResult");
    const inputId = inputField.value.trim().toUpperCase();

    if (!inputId) {
        resultEl.innerHTML = `<div class="verify-card error">⚠️ Please enter a valid Certificate ID first.</div>`;
        return;
    }

    // 1. Dashboard se auto-saved certificates fetch karein
    const certRegistry = JSON.parse(localStorage.getItem("ssvks_verified_certs") || "{}");

    // 2. Kuch permanent/demo verified IDs bhi rakhein (HR/Testing ke liye)
    const defaultCerts = {
        "SSVKS-2026-884": {
            name: "Satyanshu Saxena",
            course: "Full Stack MERN Development",
            issueDate: "15 Nov 2026",
            status: "Completed & Verified"
        },
        "SSVKS-2026-101": {
            name: "Demo Student",
            course: "Java Enterprise - JSP & Spring Boot",
            issueDate: "20 Nov 2026",
            status: "Completed & Verified"
        }
    };

    const allCerts = { ...defaultCerts, ...certRegistry };
    const record = allCerts[inputId];

    if (record) {
        resultEl.innerHTML = `
            <div class="verify-card success">
                <div class="verify-badge">✅ AUTHENTIC & VERIFIED</div>
                <h3>Certificate ID: <span>${inputId}</span></h3>
                <p><strong>Issued To:</strong> ${record.name}</p>
                <p><strong>Program / Track:</strong> ${record.course}</p>
                <p><strong>Issue Date:</strong> ${record.issueDate}</p>
                <p><strong>Current Status:</strong> <span class="status-ok">${record.status}</span></p>
                <small>Verified by SSVKS Academy & IT Solutions Official Registry</small>
            </div>
        `;
    } else {
        resultEl.innerHTML = `
            <div class="verify-card error">
                ❌ <strong>Verification Failed!</strong><br>
                No certificate found for ID <strong>"${inputId}"</strong>. Please check the ID and try again.
            </div>
        `;
    }
}

function verifyCertificate() {
    const id = document
        .getElementById("verifyId")
        .value.trim();

    const records = JSON.parse(
        localStorage.getItem("SSVKS Academy & IT Solutions Certificates") || "{}"
    );

    const result = document.getElementById("verifyResult");
    const record = records[id];

    if (record) {
        result.textContent =
            "✓ Demo record found: " +
            record.name + " | " +
            record.course + " | " +
            record.duration;
    } else {
        result.textContent =
            "✗ Certificate not found in this browser.";
    }
}
