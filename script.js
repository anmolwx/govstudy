
// Load saved subjects from localStorage
let subjects = JSON.parse(localStorage.getItem("subjects")) || [];

// Add a new subject
function addSubject() {
    const input = document.getElementById("subjectInput");
    const subjectName = input.value.trim();

    if (subjectName === "") {
        alert("Please enter a subject name!");
        return;
    }

    subjects.push({
        name: subjectName,
        topics: []
    });

    input.value = "";
    saveData();
    displaySubjects();
}

// Add a topic to a subject
function addTopic(index) {
    const topicName = prompt("Enter topic name:");

    if (topicName === null || topicName.trim() === "") {
        return;
    }

    subjects[index].topics.push({
        name: topicName.trim(),
        completed: false
    });

    saveData();
    displaySubjects();
}

// Mark topic as completed or incomplete
function toggleTopic(subjectIndex, topicIndex) {
    subjects[subjectIndex].topics[topicIndex].completed =
        !subjects[subjectIndex].topics[topicIndex].completed;

    saveData();
    displaySubjects();
}

// Function to delete a subject
function deleteSubject(index) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this subject?"
    );

    if (confirmDelete) {

        subjects.splice(index, 1);

        saveData();

        displaySubjects();
    }
}


// Function to delete a topic
function deleteTopic(subjectIndex, topicIndex) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this topic?"
    );

    if (confirmDelete) {

        subjects[subjectIndex].topics.splice(topicIndex, 1);

        saveData();

        displaySubjects();
    }
}

// Save data in browser
function saveData() {
    localStorage.setItem("subjects", JSON.stringify(subjects));
}

// Display subjects and topics

function displaySubjects() {

    const subjectList =
        document.getElementById("subjectList");

    subjectList.innerHTML = "";

    subjects.forEach((subject, index) => {

        let html = `
            <div class="subject-card">

                <div class="subject-header">

                    <h3>${subject.name}</h3>

                    <button class="delete-btn"
                        onclick="deleteSubject(${index})">
                        Delete Subject
                    </button>

                </div>

                <button onclick="addTopic(${index})">
                    + Add Topic
                </button>

                <ul>
        `;

        subject.topics.forEach((topic, topicIndex) => {

            html += `
                <li class="topic-item">

                    <label>

                        <input type="checkbox"
                            ${topic.completed ? "checked" : ""}
                            onchange="toggleTopic(${index}, ${topicIndex})">

                        ${topic.name}

                    </label>

                    <button class="delete-btn"
                        onclick="deleteTopic(${index}, ${topicIndex})">
                        X
                    </button>

                </li>
            `;
        });

        html += `
                </ul>

            </div>
        `;

        subjectList.innerHTML += html;

    });

    updateProgress();
}


// Update dashboard statistics
function updateProgress() {
    const totalSubjects = subjects.length;

    let totalTopics = 0;
    let completedTopics = 0;

    subjects.forEach(subject => {
        totalTopics += subject.topics.length;

        subject.topics.forEach(topic => {
            if (topic.completed) {
                completedTopics++;
            }
        });
    });

    const percentage = totalTopics === 0
        ? 0
        : Math.round((completedTopics / totalTopics) * 100);

    document.getElementById("subjectCount").textContent =
        totalSubjects;

    document.getElementById("topicCount").textContent =
        totalTopics;

    document.getElementById("completedCount").textContent =
        completedTopics;

    document.getElementById("progress").style.width =
        percentage + "%";

    document.getElementById("progressText").textContent =
        percentage + "% Completed";
}

// Button event
document.getElementById("addSubjectBtn")
    .addEventListener("click", addSubject);

// Display saved subjects when page opens
displaySubjects();

// Daily Study Goal Feature

// Get today's date
function getTodayDate() {
    const today = new Date();

    return today.getFullYear() + "-" +
        String(today.getMonth() + 1).padStart(2, "0") + "-" +
        String(today.getDate()).padStart(2, "0");
}

// Load saved daily goal
let dailyTarget = Number(
    localStorage.getItem("dailyTarget")
) || 4;

let hoursStudied = Number(
    localStorage.getItem("hoursStudied")
) || 0;

// Check whether the saved hours belong to today
if (localStorage.getItem("studyDate") !== getTodayDate()) {
    hoursStudied = 0;

    localStorage.setItem("hoursStudied", 0);
    localStorage.setItem("studyDate", getTodayDate());
}

// Set initial input values
document.getElementById("dailyTarget").value = dailyTarget;

document.getElementById("hoursStudied").value = hoursStudied;


// Save daily target
function saveDailyGoal() {
    const value = Number(
        document.getElementById("dailyTarget").value
    );

    if (!Number.isFinite(value) || value < 1 || value > 24) {
        alert("Please enter a target between 1 and 24 hours.");
        return;
    }

    dailyTarget = value;

    localStorage.setItem("dailyTarget", dailyTarget);

    updateDailyProgress();
}


// Save hours studied
function saveStudyHours() {
    const value = Number(
        document.getElementById("hoursStudied").value
    );

    if (!Number.isFinite(value) || value < 0 || value > 24) {
        alert("Please enter hours between 0 and 24.");
        return;
    }

    hoursStudied = value;

    localStorage.setItem("hoursStudied", hoursStudied);
    localStorage.setItem("studyDate", getTodayDate());

    updateDailyProgress();
}


// Calculate daily progress
function updateDailyProgress() {
    const percentage = Math.min(
        Math.round((hoursStudied / dailyTarget) * 100),
        100
    );

    document.getElementById("goalText").textContent =
        hoursStudied + " / " + dailyTarget + " Hours Completed";

    document.getElementById("dailyProgress").style.width =
        percentage + "%";

    document.getElementById("goalPercentage").textContent =
        percentage + "% of Daily Goal Completed";
}


// Button events
document.getElementById("saveGoalBtn")
    .addEventListener("click", saveDailyGoal);

document.getElementById("saveHoursBtn")
    .addEventListener("click", saveStudyHours);


// Display saved daily progress
updateDailyProgress();
