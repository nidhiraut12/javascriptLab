const loginForm = document.getElementById("loginForm");
const gradeForm = document.getElementById("gradeForm");

if (loginForm) {
    const password = document.getElementById("password");
    const loginMessage = document.getElementById("loginMessage");
    const passwordRule = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

    document.getElementById("togglePassword").addEventListener("click", () => {
        const isHidden = password.type === "password";
        password.type = isHidden ? "text" : "password";
        document.getElementById("togglePassword").textContent = isHidden ? "Hide" : "Show";
    });

    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const username = document.getElementById("username").value.trim();

        if (!username) {
            loginMessage.textContent = "Please enter your username or email.";
            return;
        }
        if (!passwordRule.test(password.value)) {
            loginMessage.textContent = "Password must have 8+ characters, uppercase, lowercase, number, and special character.";
            return;
        }

        sessionStorage.setItem("marksPortalLoggedIn", "true");
        window.location.href = "upload-marks.html";
    });
}

if (gradeForm) {
    if (sessionStorage.getItem("marksPortalLoggedIn") !== "true") {
        window.location.href = "index.html";
    }

    document.getElementById("logoutButton").addEventListener("click", () => {
        sessionStorage.removeItem("marksPortalLoggedIn");
        window.location.href = "index.html";
    });

    gradeForm.addEventListener("submit", (event) => {
        event.preventDefault();
        calculateGrade();
    });
}

function calculateGrade() {
    const name = document.getElementById("name").value.trim();
    const marks = ["sub1", "sub2", "sub3", "sub4", "sub5"].map((id) => Number(document.getElementById(id).value));

    if (!name) {
        alert("Please enter the student name.");
        return;
    }
    if (marks.some((mark) => Number.isNaN(mark) || mark < 0 || mark > 100)) {
        alert("Marks should be between 0 and 100.");
        return;
    }

    const total = marks.reduce((sum, mark) => sum + mark, 0);
    const percentage = total / marks.length;
    const grade = percentage >= 90 ? "A+" : percentage >= 80 ? "A" : percentage >= 70 ? "B" : percentage >= 60 ? "C" : percentage >= 50 ? "D" : "F";
    const status = marks.every((mark) => mark >= 35) ? "PASS" : "FAIL";
    const resultBox = document.getElementById("result");

    resultBox.innerHTML = `<h2>Result</h2><hr><p><b>Name:</b> ${escapeHtml(name)}</p><p><b>Total Marks:</b> ${total} / 500</p><p><b>Percentage:</b> ${percentage.toFixed(2)}%</p><p><b>Grade:</b> ${grade}</p><p><b>Status:</b> ${status}</p>`;
    resultBox.classList.add("show");
}

function escapeHtml(value) {
    const element = document.createElement("div");
    element.textContent = value;
    return element.innerHTML;
}
