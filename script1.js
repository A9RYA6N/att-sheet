document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault(); 
    const facultyName = document.getElementById('facultyName').value;
    const email = document.getElementById('email').value;
    const facultyPassword = document.getElementById('facultyPassword').value;
    const registrationCode = document.getElementById('registrationCode').value;
    const validRegistrationCode = 'FACULTY2024';
    if (registrationCode === validRegistrationCode) {
        alert('Signup successful!');
        window.location.href = 'index.html';    
    } else {
        alert('Invalid registration code. Please contact administration.');
    }
});
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); 
    const loginEmail = document.getElementById('loginEmail').value;
    const loginPassword = document.getElementById('loginPassword').value;
    console.log('Login Email:', loginEmail);
    console.log('Login Password:', loginPassword);
});