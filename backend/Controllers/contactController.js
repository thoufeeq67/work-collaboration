const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "rcode6681@gmail.com",
    pass: "jgzlrbnujwtfppal",
  },
});

// Controller function to handle contact form submissions
const sendContactEmail = (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const mailOptions = {
    from: email,
    to: "imshaik67@gmail.com",
    subject: "Contact Form Submission",
    text: `You have a new contact form submission.\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ error: "Failed to send email" });
    }
    res.status(200).json({ message: "Message sent successfully" });
  });
};

module.exports = { sendContactEmail };
