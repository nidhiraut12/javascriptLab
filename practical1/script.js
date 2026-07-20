const studentForm = document.getElementById("student-form");

if (studentForm) {
    studentForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(studentForm);
        const student = Object.fromEntries(formData.entries());
        localStorage.setItem("sitStudentDetails", JSON.stringify(student));

        alert("Welcome to SIT Nagpur!");
        window.location.href = "details.html";
    });
}

function showDetails() {
    const detailsList = document.getElementById("details-list");
    const savedDetails = localStorage.getItem("sitStudentDetails");

    if (!detailsList || !savedDetails) return;

    const student = JSON.parse(savedDetails);
    const fields = [
        ["Full Name", student.name],
        ["Age", student.age],
        ["Phone Number", student.number],
        ["Email Address", student.email],
        ["Address", student.address]
    ];

    detailsList.innerHTML = fields.map(([label, value]) =>
        `<div class="detail-row"><span class="detail-label">${label}</span><span>${escapeHtml(value)}</span></div>`
    ).join("");
    detailsList.classList.add("visible");
    document.getElementById("show-details").hidden = true;
}

function escapeHtml(value = "") {
    const element = document.createElement("div");
    element.textContent = value;
    return element.innerHTML;
}
