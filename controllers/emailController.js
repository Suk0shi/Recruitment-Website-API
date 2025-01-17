const nodemailer = require("nodemailer");
require('dotenv').config();
const asyncHandler = require("express-async-handler");


exports.sendEmail_post = asyncHandler(async (req, res) => {
    const { name, email, subject, message } = req.body;

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports like 587
      auth: {
        user: process.env.EMAIL, 
        pass: process.env.EMAIL_PASSWORD, 
      },
    });
  
    const mailOptions = {
      from: process.env.EMAIL, 
      to: process.env.EMAIL_RECIPIENT, 
      subject: `${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json("Email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json("Failed to send email.");
    }
  
});