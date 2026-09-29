// ==========================================
// JOBTRACK - PLACEMENT APPLICATION TRACKER
// ==========================================

// Get applications from local storage
let applications = JSON.parse(localStorage.getItem("jobTrackApplications")) || [];


// ==========================================
// DOM ELEMENTS
// ==========================================

const applicationForm = document.getElementById("applicationForm");

const companyInput = document.getElementById("company");
const roleInput = document.getElementById("role");
const applicationDateInput = document.getElementById("applicationDate");
const deadlineInput = document.getElementById("deadline");
const statusInput = document.getElementById("status");
const notesInput = document.getElementById("notes");

const applicationsContainer =
    document.getElementById("applicationsContainer");

const searchInput =
    document.getElementById("searchInput");

const filterStatus =
    document.getElementById("filterStatus");

const totalApplications =
    document.getElementById("totalApplications");

const testCount =
    document.getElementById("testCount");

const interviewCount =
    document.getElementById("interviewCount");

const selectedCount =
    document.getElementById("selectedCount");

const editModal =
    document.getElementById("editModal");

const closeModal =
    document.getElementById("closeModal");

const editForm =
    document.getElementById("editForm");


// ==========================================
// SAVE DATA
// ==========================================

function saveApplications() {
    localStorage.setItem(
        "jobTrackApplications",
        JSON.stringify(applications)
    );
}


// ==========================================
// UPDATE DASHBOARD
// ==========================================

function updateDashboard() {

    totalApplications.textContent = applications.length;

    const tests = applications.filter(
        application => application.status === "Online Test"
    ).length;

    const interviews = applications.filter(
        application => application.status === "Interview"
    ).length;

    const selected = applications.filter(
        application => application.status === "Selected"
    ).length;

    testCount.textContent = tests;
    interviewCount.textContent = interviews;
    selectedCount.textContent = selected;
}


// ==========================================
// FORMAT DATE
// ==========================================

function formatDate(date) {

    if (!date) {
        return "Not specified";
    }

    const dateObject = new Date(date + "T00:00:00");

    return dateObject.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}


// ==========================================
// STATUS CLASS
// ==========================================

function getStatusClass(status) {

    if (status === "Applied") {
        return "status-applied";
    }

    if (status === "Online Test") {
        return "status-test";
    }

    if (status === "Interview") {
        return "status-interview";
    }

    if (status === "Selected") {
        return "status-selected";
    }

    if (status === "Rejected") {
        return "status-rejected";
    }

    return "";
}


// ==========================================
// DISPLAY APPLICATIONS
// ==========================================

function displayApplications() {

    const searchTerm =
        searchInput.value.toLowerCase().trim();

    const selectedFilter =
        filterStatus.value;

    const filteredApplications =
        applications.filter(application => {

            const matchesSearch =
                application.company.toLowerCase().includes(searchTerm) ||
                application.role.toLowerCase().includes(searchTerm);

            const matchesStatus =
                selectedFilter === "All" ||
                application.status === selectedFilter;

            return matchesSearch && matchesStatus;
        });


    if (filteredApplications.length === 0) {

        applicationsContainer.innerHTML = `
            <div class="empty-state">
                <div>📂</div>
                <h3>No applications found</h3>
                <p>Try changing your search or filter.</p>
            </div>
        `;

        return;
    }


    applicationsContainer.innerHTML =
        filteredApplications.map(application => {

            return `
                <div class="application-card">

                    <div class="application-top">

                        <div class="company-info">
                            <h3>${escapeHTML(application.company)}</h3>
                            <p>${escapeHTML(application.role)}</p>
                        </div>

                        <span class="status ${getStatusClass(application.status)}">
                            ${escapeHTML(application.status)}
                        </span>

                    </div>


                    <div class="application-details">

                        <span>
                            📅 Applied:
                            ${formatDate(application.applicationDate)}
                        </span>

                        <span>
                            ⏰ Deadline:
                            ${formatDate(application.deadline)}
                        </span>

                    </div>


                    ${
                        application.notes
                        ?
                        `
                        <div class="notes">
                            <strong>Notes:</strong>
                            ${escapeHTML(application.notes)}
                        </div>
                        `
                        :
                        ""
                    }


                    <div class="card-actions">

                        <button
                            class="action-btn edit-btn"
                            onclick="openEditModal('${application.id}')"
                        >
                            Edit
                        </button>

                        <button
                            class="action-btn delete-btn"
                            onclick="deleteApplication('${application.id}')"
                        >
                            Delete
                        </button>

                    </div>

                </div>
            `;

        }).join("");
}


// ==========================================
// ADD APPLICATION
// ==========================================

applicationForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const newApplication = {

        id: Date.now().toString(),

        company: companyInput.value.trim(),

        role: roleInput.value.trim(),

        applicationDate:
            applicationDateInput.value,

        deadline:
            deadlineInput.value,

        status:
            statusInput.value,

        notes:
            notesInput.value.trim()

    };


    applications.unshift(newApplication);

    saveApplications();

    updateDashboard();

    displayApplications();

    applicationForm.reset();

    setDefaultDate();

});


// ==========================================
// DELETE APPLICATION
// ==========================================

function deleteApplication(id) {

    const confirmed =
        confirm("Are you sure you want to delete this application?");

    if (!confirmed) {
        return;
    }


    applications =
        applications.filter(
            application => application.id !== id
        );


    saveApplications();

    updateDashboard();

    displayApplications();
}


// ==========================================
// OPEN EDIT MODAL
// ==========================================

function openEditModal(id) {

    const application =
        applications.find(
            application => application.id === id
        );


    if (!application) {
        return;
    }


    document.getElementById("editId").value =
        application.id;

    document.getElementById("editCompany").value =
        application.company;

    document.getElementById("editRole").value =
        application.role;

    document.getElementById("editDate").value =
        application.applicationDate;

    document.getElementById("editDeadline").value =
        application.deadline;

    document.getElementById("editStatus").value =
        application.status;

    document.getElementById("editNotes").value =
        application.notes;


    editModal.classList.add("active");
}


// ==========================================
// CLOSE MODAL
// ==========================================

closeModal.addEventListener("click", function() {

    editModal.classList.remove("active");

});


// Close when clicking outside modal

editModal.addEventListener("click", function(event) {

    if (event.target === editModal) {

        editModal.classList.remove("active");

    }

});


// ==========================================
// SAVE EDITED APPLICATION
// ==========================================

editForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const id =
        document.getElementById("editId").value;


    const application =
        applications.find(
            application => application.id === id
        );


    if (!application) {
        return;
    }


    application.company =
        document.getElementById("editCompany").value.trim();

    application.role =
        document.getElementById("editRole").value.trim();

    application.applicationDate =
        document.getElementById("editDate").value;

    application.deadline =
        document.getElementById("editDeadline").value;

    application.status =
        document.getElementById("editStatus").value;

    application.notes =
        document.getElementById("editNotes").value.trim();


    saveApplications();

    updateDashboard();

    displayApplications();

    editModal.classList.remove("active");

});


// ==========================================
// SEARCH
// ==========================================

searchInput.addEventListener(
    "input",
    displayApplications
);


// ==========================================
// FILTER
// ==========================================

filterStatus.addEventListener(
    "change",
    displayApplications
);


// ==========================================
// DEFAULT APPLICATION DATE
// ==========================================

function setDefaultDate() {

    const today =
        new Date().toISOString().split("T")[0];

    applicationDateInput.value = today;
}


// ==========================================
// SECURITY HELPER
// ==========================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


// ==========================================
// INITIAL LOAD
// ==========================================

setDefaultDate();

updateDashboard();

displayApplications();