const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();


app.use(express.json());
app.use(cors());
app.use(express.static('public')); 

const otps = new Map();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'delacruzjerimie@gmail.com', 
        pass: 'rdtgdbghyatarevatbanbr', 
    },
});


app.post('/send-otp', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    
    otps.set(email, { otp, expires: Date.now() + 10 * 60 * 1000 });

    
    const mailOptions = {
        from: 'delacruzjerimie@gmail.com',
        to: email,
        subject: 'Your OTP for Email Verification',
        text: `Your OTP is: ${otp}. It is valid for 10 minutes.`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send OTP' });
    }
});


app.post('/verify-otp', (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ error: 'Email and OTP are required' });
    }

    const storedOTP = otps.get(email);

    if (!storedOTP) {
        return res.status(400).json({ error: 'OTP not found or expired' });
    }

    if (Date.now() > storedOTP.expires) {
        otps.delete(email);
        return res.status(400).json({ error: 'OTP has expired' });
    }

    if (storedOTP.otp !== otp) {
        return res.status(400).json({ error: 'Invalid OTP' });
    }

    
    otps.delete(email);
    res.json({ message: 'OTP verified successfully' });
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});