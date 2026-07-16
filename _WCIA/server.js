require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // allow external resources
}));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Routes
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and message are required.' });
  }
  try {
    await transporter.sendMail({
      from: `"WCIA Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: subject || 'New Contact Form Submission',
      html: `<h3>Contact from ${name}</h3><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong><br/>${message}</p>`,
    });
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send email.' });
  }
});

app.post('/api/donate', async (req, res) => {
  const { name, email, amount, paymentMethod } = req.body;
  if (!name || !email || !amount) {
    return res.status(400).json({ error: 'Name, email and amount are required.' });
  }
  // In production, integrate Razorpay/PayPal; here we just log and send notification
  try {
    await transporter.sendMail({
      from: `"WCIA Donation" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: 'New Donation Intention',
      html: `<h3>Donation from ${name}</h3><p><strong>Email:</strong> ${email}</p><p><strong>Amount:</strong> ₹${amount}</p><p><strong>Payment Method:</strong> ${paymentMethod || 'Not specified'}</p>`,
    });
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process donation.' });
  }
});

// Catch-all for SPA fallback (optional) – we serve static files
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 WCIA server running on port ${PORT}`);
});
