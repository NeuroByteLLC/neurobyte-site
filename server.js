require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Adjust to match your HTML directory

// Endpoint to handle contact form submission
app.post('/submit-form', async (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,       // Gmail address
      pass: process.env.EMAIL_PASS        // Gmail App Password
    }
  });

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_TO || process.env.EMAIL_USER,
    subject: `NeuroByte Contact Form - ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\n${message}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.send('Message sent successfully!');
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).send('Failed to send message.');
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
