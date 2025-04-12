async function sendOTP(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const emailResult = document.getElementById('emailResult');
    const otpSection = document.getElementById('otpSection');

    
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
        emailResult.textContent = "Invalid email address. Please enter a valid email.";
        emailResult.className = "error";
        return false;
    }

    try {
        const response = await fetch('http://localhost:3000/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
        const data = await response.json();

        if (response.ok) {
            emailResult.textContent = "OTP sent to your email!";
            emailResult.className = "success";
            otpSection.style.display = "block";
        } else {
            emailResult.textContent = data.error || "Failed to send OTP. Please try again.";
            emailResult.className = "error";
        }
    } catch (error) {
        emailResult.textContent = "Error connecting to the server. Please try again.";
        emailResult.className = "error";
    }

    return false;
}

async function verifyOTP(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const otp = document.getElementById('otp').value;
    const otpResult = document.getElementById('otpResult');

    try {
        const response = await fetch('http://localhost:3000/verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp }),
        });
        const data = await response.json();

        if (response.ok) {
            otpResult.textContent = "OTP verified successfully! Email verified.";
            otpResult.className = "success";
        } else {
            otpResult.textContent = data.error || "Invalid OTP. Please try again.";
            otpResult.className = "error";
        }
    } catch (error) {
        otpResult.textContent = "Error connecting to the server. Please try again.";
        otpResult.className = "error";
    }

    return false;
}