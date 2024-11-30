let students = [];
const form = document.getElementById('attendanceForm');
const leaderboardBody = document.querySelector('#leaderboard tbody');
function updateLeaderboard() {
  students.sort((a, b) => b.attendance - a.attendance);
  leaderboardBody.innerHTML = '';
  students.forEach((student, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${student.name}</td>
      <td>${student.attendance}</td>
    `;
    leaderboardBody.appendChild(row);
  });
}
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('studentName').value.trim();
  const attendance = parseInt(document.getElementById('attendanceCount').value, 10);
  if (!name || isNaN(attendance) || attendance < 0) {
    alert('Please enter valid data.');
    return;
  }
  const existingStudent = students.find((student) => student.name === name);
  if (existingStudent) {
    existingStudent.attendance = attendance;
  } else {
    students.push({ name, attendance });
  }
  updateLeaderboard();
  form.reset();
});