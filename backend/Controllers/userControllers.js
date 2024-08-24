const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../Models/userModel");
const UserOTPVerification = require("../Models/UserOTPVerification");
const nodemailer = require("nodemailer");

// Nodemailer
let Transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "rcode6681@gmail.com", // Your email id
    pass: "jgzlrbnujwtfppal",
  },
});
// Generate JWT token
const generateJWT = (id) =>
  jwt.sign(
    { id },
    process.env.JWT_SECRET || "default_secret_key", // Use environment variable or a default secret key
    { expiresIn: "5d" }
  );

// Register User
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400).json({ message: "User already exists" });
    return;
  }

  const salt = await bcrypt.genSalt(10);

  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  await user
    .save()
    .then((result) => {
      sendOTP(result, res);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Server error" });
    });
});

// send otp verification email
const sendOTP = async ({ _id, email }, res) => {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

    // mail options
    let mailOptions = {
      from: "rrcode6681@gmail.com",
      to: email,
      subject: "Please confirm your account",
      html: `Hello,<br> Please confirm your account by entering the following OTP: <b>${otp}</b>
    <br>OTP is valid for 10 minutes only.<br>`,
    };

    const salt = await bcrypt.genSalt(5);

    const UserId = await User.findById(_id);
    

    const hashedOTP = await bcrypt.hash(otp, salt);

    const fOTP = new UserOTPVerification({
      user: UserId._id,
      otp: hashedOTP,
      createdAt: new Date(Date.now()),
      expires_at: new Date(Date.now() + 10 * 60000),
    });

    
    await fOTP.save();

    //send mail
    await Transport.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      Data: {
        _id: _id,
        email: email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
// verify email

const verifyEmail = asyncHandler(async (req, res) => {
  const { userId, otp } = req.body;

  // Find the OTP verification record for the user
  const userOTPVerificationRecord = await UserOTPVerification.findOne({
    user: userId,
  });
  const useremail = await User.findById(userId);
 
  const email = useremail.email;


  if (!userOTPVerificationRecord) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  // Check if OTP is expired
  const { expires_at, otp: hashedOTP } = userOTPVerificationRecord;
  const isExpired = expires_at < Date.now();


  if (isExpired) {
    return res.status(400).json({ message: "OTP expired" });
  }

  // Compare OTP
  try {
    
    const isMatch = await bcrypt.compare(otp, hashedOTP);

    if (isMatch) {
     
      useremail.isVerified = true;
      await UserOTPVerification.deleteMany({ user: userId });
      
      return res
        .status(200)
        .json({
          success: true,
          message: "Email verified successfully",
          email: email,
        });
    } else {
      return res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Error comparing OTP:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateJWT(user._id),
      success: true,
    });
  } else {
    res
      .status(400)
      .json({ message: "Invalid email or password", success: false });
  }
});

// Get Current User
const getCurrentUser = asyncHandler(async (req, res) => {
  const { email } = req.body; // Use req.body for POST request
  

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });

    // now send the response
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,

      success: true,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

const ResendOTP = asyncHandler(async (req, res) => {
  const { userId } = req.body;
 
  // Find the user by email
  const user = await User.findById(userId);

  const result = await UserOTPVerification.deleteMany({ user: userId });
  const bye = await User.findByIdAndDelete(userId);
 

  if (result) {
    res.status(200).json({ success: true, message: "OTP Resend Successfully" });
  } else {
    res.status(500).json({ error: "Server error" });
  }
});

// Update Username
const updateUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // Update the username if provided
    if (username) {
      user.name = username;
    }

    // Update the password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }
    // Save the updated user
    await user.save();

    res.status(200).json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    res.status(500);
    throw new Error("Failed to update user");
  }
});

// Update Password

const updatePassword = asyncHandler(async (req, res) => {
  // Get userId from URL parameters
  const userId = req.params.id;

  // Find the user by userId
  const user = await User.findById(userId);

  // Check if user exists
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Send the user's email in the response
  res.status(200).json({ email: user.email });
});

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  updatePassword,
  updateUser,
  verifyEmail,
  ResendOTP,
};
