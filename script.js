//script.js
document.addEventListener("DOMContentLoaded",
    function () {
        populateClasses();
        showStudentsList();
    });
function fetchStudentsData() {
    fetch('./students.json')
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('students', JSON.stringify({ "2024-2028": data }));
            showStudentsList();
        })
        .catch(error => console.error("Error loading students data:", error));
}
function showAddStudentForm() {
    document.getElementById('addStudentPopup').
        style.display = 'block';
}
function submitAttendance() {
    const classSelector = document.
        getElementById('classSelector');
    const selectedClass = classSelector.
        options[classSelector.selectedIndex].value;
    if (!selectedClass) {
        console.error('Selected class is not valid.');
    }
    const studentsList =
        document.getElementById('studentsList');
    const isAttendanceSubmitted =
        isAttendanceSubmittedForClass(selectedClass);
    if (isAttendanceSubmitted) {
        document.getElementById('summarySection').
            style.display = 'none';
        showAttendanceResult(selectedClass);
    } else {
        document.getElementById('summarySection').
            style.display = 'block';
        document.getElementById('resultSection').
            style.display = 'none';
    }
    studentsList.innerHTML = '';
}
function isAttendanceSubmittedForClass(selectedClass) {
    const savedAttendanceData = JSON.parse
        (localStorage.getItem('attendanceData')) || [];
    return savedAttendanceData.some
        (record => record.class === selectedClass);
}
function showAttendanceResult(selectedClass) {
    const resultSection = document.
        getElementById('resultSection');
    if (!resultSection) {
        console.error('Result section is not properly defined.');
        return;
    }
    const now = new Date();
    const date =
        `${now.getFullYear()}-${String(now.getMonth() + 1).
        padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const time =
        `${String(now.getHours()).padStart(2, '0')}:
        ${String(now.getMinutes()).padStart(2, '0')}:
        ${String(now.getSeconds()).padStart(2, '0')}`;
    const savedAttendanceData = JSON.parse
        (localStorage.getItem('attendanceData')) || [];
    const filteredAttendanceData = savedAttendanceData.
        filter(record => record.class === selectedClass);
    const totalStudents = filteredAttendanceData.
    reduce((acc, record) => {
        if (!acc.includes(record.name)) {
            acc.push(record.name);
        }
        return acc;
    }, []).length;
    const totalPresent = filteredAttendanceData.
        filter(record => record.status === 'present').length;
    const totalAbsent = filteredAttendanceData.
        filter(record => record.status === 'absent').length;
    const totalLeave = filteredAttendanceData.
        filter(record => record.status === 'leave').length;
    document.getElementById('attendanceDate').
        innerText = date;
    document.getElementById('attendanceTime').
        innerText = time;
    document.getElementById('attendanceClass').
        innerText = selectedClass;
    document.getElementById('attendanceTotalStudents').
        innerText = totalStudents;
    document.getElementById('attendancePresent').
        innerText = totalPresent;
    document.getElementById('attendanceAbsent').
        innerText = totalAbsent;
    document.getElementById('attendanceLeave').
        innerText = totalLeave;
    resultSection.style.display = 'block';
}
function createButton(text, status, onClick) {
    const button = document.createElement('button');
    button.type = 'button';
    button.innerText = text;
    button.className = status;
    button.onclick = onClick;
    return button;
}
function populateClasses() {
    const classSelector = document.getElementById('classSelector');
    classSelector.innerHTML = '';
    const defaultClassOption = document.createElement('option');
    defaultClassOption.value = '2024-2028';
    defaultClassOption.text = '2024-2028';
    defaultClassOption.selected = true;
    classSelector.add(defaultClassOption);
}
function showStudentsList() {
    const selectedClass = '2024-2028';
    const studentsList = document.getElementById('studentsList');
    studentsList.innerHTML = '';
    const savedStudents = JSON.parse(localStorage.getItem('students')) || {};
    const selectedClassStudents = savedStudents[selectedClass] || [];
    selectedClassStudents.forEach(student => {
        const listItem = document.createElement('li');
        listItem.setAttribute('data-roll-number', student.rollNumber);
        listItem.innerHTML = `<strong>${student.name}</strong> (Roll No. ${student.rollNumber})`;
        const absentButton = createButton('A', 'absent', () => markAttendance('absent', listItem, selectedClass));
        const presentButton = createButton('P', 'present', () => markAttendance('present', listItem, selectedClass));
        const leaveButton = createButton('L', 'leave', () => markAttendance('leave', listItem, selectedClass));
        const savedColor = getSavedColor(selectedClass, student.rollNumber);
        if (savedColor) {
            listItem.style.backgroundColor = savedColor;
        }
        listItem.appendChild(absentButton);
        listItem.appendChild(presentButton);
        listItem.appendChild(leaveButton);
        studentsList.appendChild(listItem);
    });
    showSummary(selectedClass);
}
function showAttendanceResult(selectedClass) {
    const resultSection = 
        document.getElementById('resultSection');
    if (!resultSection) {
        console.error('Result section is not properly defined.');
        return;
    }
    const now = new Date();
    const date = 
        `${now.getFullYear()}-${String(now.getMonth() + 1).
        padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const time = 
        `${String(now.getHours()).padStart(2, '0')}:
        ${String(now.getMinutes()).padStart(2, '0')}:
        ${String(now.getSeconds()).padStart(2, '0')}`;
    const savedAttendanceData = JSON.parse
        (localStorage.getItem('attendanceData')) || [];
    const filteredAttendanceData = savedAttendanceData.
        filter(record => record.class === selectedClass);
    const totalStudents = filteredAttendanceData.
    reduce((acc, record) => {
        if (!acc.includes(record.name)) {
            acc.push(record.name);
        }
        return acc;
    }, []).length;
    const totalPresent = filteredAttendanceData.
        filter(record => record.status === 'present').length;
    const totalAbsent = filteredAttendanceData.
        filter(record => record.status === 'absent').length;
    const totalLeave = filteredAttendanceData.
        filter(record => record.status === 'leave').length;
    const resultContent = 
        `Date: ${date} | Time: ${time} | 
        Total Students: ${totalStudents} | 
        Present: ${totalPresent} | 
        Absent: ${totalAbsent} | Leave: ${totalLeave}`;
    resultSection.innerHTML = resultContent;
    resultSection.style.display = 'block';
    const studentsListHTML = 
        generateStudentsListHTML(filteredAttendanceData);
    resultSection.insertAdjacentHTML
        ('afterend', studentsListHTML);
}
function markAttendance
    (status, listItem, selectedClass) {
    const studentName = listItem.
        querySelector('strong').innerText;
    listItem.style.backgroundColor = 
        getStatusColor(status);
    saveColor(selectedClass, 
        listItem.getAttribute('data-roll-number'), 
        getStatusColor(status));
    updateAttendanceRecord(studentName, selectedClass, status);
    showSummary(selectedClass);
}
function getStatusColor(status) {
    switch (status) {
        case 'absent':
            return '#e74c3c';
        case 'present':
            return '#2ecc71';
        case 'leave':
            return '#f39c12';
        default:
            return '';
    }
}
function updateAttendanceRecord
    (studentName, selectedClass, status) {
    const savedAttendanceData = JSON.parse
        (localStorage.getItem('attendanceData')) || [];
    const existingRecordIndex = savedAttendanceData.
        findIndex(record => record.name === studentName && 
            record.class === selectedClass);
    if (existingRecordIndex !== -1) {
        savedAttendanceData[existingRecordIndex].
            status = status;
        savedAttendanceData[existingRecordIndex].
            date = getCurrentDate();
    } else {
        savedAttendanceData.push(
            { 
                name: studentName, class: selectedClass, 
                status: status, date: getCurrentDate() 
            });
    }
    localStorage.setItem('attendanceData', 
        JSON.stringify(savedAttendanceData));
}
function showSummary(selectedClass) {
    const savedAttendanceData = JSON.parse
        (localStorage.getItem('attendanceData')) || [];
    const filteredAttendanceData = savedAttendanceData.
        filter(record => record.class === selectedClass);
    const totalStudents = filteredAttendanceData.
    reduce((acc, record) => {
        if (!acc.includes(record.name)) {
            acc.push(record.name);
        }
        return acc;
    }, []).length;
    const totalPresent = filteredAttendanceData.
        filter(record => record.status === 'present').length;
    const totalAbsent = filteredAttendanceData.
        filter(record => record.status === 'absent').length;
    const totalLeave = filteredAttendanceData.
        filter(record => record.status === 'leave').length;
    document.getElementById('totalStudents').
        innerText = totalStudents;
    document.getElementById('totalPresent').
        innerText = totalPresent;
    document.getElementById('totalAbsent').
        innerText = totalAbsent;
    document.getElementById('totalLeave').
        innerText = totalLeave;
}
function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).
        padStart(2, '0');
    const day = String(now.getDate()).
        padStart(2, '0');
    return `${year}-${month}-${day}`;
}
function saveClasses() {
    const classSelector = document.
        getElementById('classSelector');
    const savedClasses = Array.from(classSelector.options).
        map(option => option.value);
    localStorage.setItem('classes', 
        JSON.stringify(savedClasses));
}
function saveStudentsList(selectedClass) {
    const studentsList = document.
        getElementById('studentsList');
    const savedStudents = JSON.parse
        (localStorage.getItem('students')) || {};
    const selectedClassStudents = Array.from(studentsList.children).
    map(item => {
        return {
            name: item.querySelector('strong').innerText,
            rollNumber: item.getAttribute('data-roll-number')
        };
    });
    savedStudents[selectedClass] = selectedClassStudents;
    localStorage.setItem
        ('students', JSON.stringify(savedStudents));
}
function saveColor(selectedClass, rollNumber, color) {
    const savedColors = JSON.parse
    (localStorage.getItem('colors')) || {};
    if (!savedColors[selectedClass]) {
        savedColors[selectedClass] = {};
    }
    savedColors[selectedClass][rollNumber] = color;
    localStorage.setItem('colors', 
        JSON.stringify(savedColors));
}
function getSavedColor(selectedClass, rollNumber) {
    const savedColors = JSON.parse
        (localStorage.getItem('colors')) || {};
    return savedColors[selectedClass] ? 
        savedColors[selectedClass][rollNumber] : null;
}
function resetAttendanceAndColors() {
    const selectedClass = '2024-2028';
    const savedAttendanceData = JSON.parse(localStorage.getItem('attendanceData')) || [];
    const filteredAttendanceData = savedAttendanceData.filter(record => record.class !== selectedClass);
    localStorage.setItem('attendanceData', JSON.stringify(filteredAttendanceData));
    const studentsList = document.getElementById('studentsList');
    const studentItems = studentsList.querySelectorAll('li');
    studentItems.forEach(item => {
        item.style.backgroundColor = '';
    });
    studentItems.forEach(item => {
        const statusButtons = item.querySelectorAll('button');
        statusButtons.forEach(button => {
            button.classList.remove('selected');
        });
    });
    showSummary(selectedClass);
}