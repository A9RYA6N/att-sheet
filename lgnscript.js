document.getElementById('generateOtpBtn').addEventListener('click', function() {
    const otp = Math.floor(1000 + Math.random() * 9000);
    alert('Your OTP is: ' + otp);
    localStorage.setItem('generatedOtp', otp);
    document.getElementById('otpSection').style.display = 'block';
});
document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault(); 
    const enteredOtp = document.getElementById('otp').value;
    const generatedOtp = localStorage.getItem('generatedOtp');
    if (enteredOtp === generatedOtp) {
        alert('Registration successful!');
        window.location.href = 'leaderboard.html'
    } else {
        alert('Invalid OTP. Please try again.');
    }
});