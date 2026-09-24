// ==========================================
// GOOGLE APPS SCRIPT WEB APP URL
// ==========================================

const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbx9Rfd8NnByGDpds5JGxnUKanCf3MadA9oV6Ocs65uVt1NLaYo0b7d6W5yr4_ya9ygN/exec";


// ==========================================
// GET HTML ELEMENTS
// ==========================================

const form = document.getElementById("studentForm");

const message = document.getElementById("message");

const submitBtn = document.getElementById("submitBtn");

const searchInput = document.getElementById("searchInput");

const studentTableBody =
    document.getElementById("studentTableBody");


// Store student records
let students = [];


// ==========================================
// ADD STUDENT
// ==========================================

form.addEventListener("submit", function (event) {

    event.preventDefault();


    // Get form values

    const name =
        document.getElementById("name").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const mobile =
        document.getElementById("mobile").value.trim();

    const course =
        document.getElementById("course").value;

    const semester =
        document.getElementById("semester").value;


    // ======================================
    // MOBILE VALIDATION
    // ======================================

    if (!/^[0-9]{10}$/.test(mobile)) {

        message.textContent =
            "Please enter a valid 10-digit mobile number.";

        message.style.color = "red";

        return;
    }


    // ======================================
    // STUDENT DATA
    // ======================================

    const studentData = {

        name: name,

        email: email,

        mobile: mobile,

        course: course,

        semester: semester

    };


    // ======================================
    // SUBMIT BUTTON
    // ======================================

    submitBtn.disabled = true;

    submitBtn.textContent = "Submitting...";

    message.textContent = "";


    // ======================================
    // SEND DATA TO GOOGLE SHEETS
    // ======================================

    fetch(GOOGLE_SCRIPT_URL, {

        method: "POST",

        mode: "no-cors",

        body: JSON.stringify(studentData)

    })

    .then(() => {

        message.textContent =
            "Student data submitted successfully!";

        message.style.color = "green";


        // Clear form

        form.reset();


        // Reload student records

        setTimeout(function () {

            loadStudents();

        }, 500);

    })

    .catch((error) => {

        console.error("Error:", error);

        message.textContent =
            "Unable to submit data. Please try again.";

        message.style.color = "red";

    })

    .finally(() => {

        submitBtn.disabled = false;

        submitBtn.textContent = "Submit";

    });

});


// ==========================================
// LOAD STUDENTS FROM GOOGLE SHEETS
// ==========================================

function loadStudents() {

    fetch(GOOGLE_SCRIPT_URL)

        .then(response => response.json())

        .then(data => {

            students = data;

            displayStudents(students);

        })

        .catch(error => {

            console.error(
                "Error loading student records:",
                error
            );

        });

}


// ==========================================
// DISPLAY STUDENTS
// ==========================================

function displayStudents(data) {

    studentTableBody.innerHTML = "";


    if (data.length === 0) {

        const row =
            document.createElement("tr");

        row.innerHTML = `
            <td colspan="6">
                No student records found.
            </td>
        `;

        studentTableBody.appendChild(row);

        return;
    }


    data.forEach(student => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${student.id}</td>

            <td>${student.name}</td>

            <td>${student.email}</td>

            <td>${student.mobile}</td>

            <td>${student.course}</td>

            <td>${student.semester}</td>

        `;


        studentTableBody.appendChild(row);

    });

}


// ==========================================
// SEARCH STUDENT
// ==========================================

searchInput.addEventListener(
    "input",
    function () {

        const searchText =
            searchInput.value
                .toLowerCase()
                .trim();


        const filteredStudents =
            students.filter(student =>

                student.name
                    .toLowerCase()
                    .includes(searchText)

                ||

                student.email
                    .toLowerCase()
                    .includes(searchText)

                ||

                String(student.mobile)
                    .includes(searchText)

            );


        displayStudents(filteredStudents);

    }
);


// ==========================================
// LOAD DATA WHEN WEBSITE OPENS
// ==========================================

loadStudents();