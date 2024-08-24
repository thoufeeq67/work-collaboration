// const crypto = require('crypto');
// const bcrypt = require('bcryptjs');
// const User = require('../Models/userModel'); // Adjust path as needed
// const sendEmail = require('../utils/sendEmail'); // Utility function to send emails

// // Function to request a password reset
// const requestPasswordReset = async (req, res) => {
//   const { email } = req.body;

//   if (!email) {
//     return res.status(400).json({ error: 'Email is required' });
//   }

//   try {
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Generate a password reset token
//     const resetToken = crypto.randomBytes(20).toString('hex');
//     user.resetPasswordToken = resetToken;
//     user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

//     await user.save();

//     // Send password reset email
//     const resetURL = `${req.protocol}://${req.get('host')}/auth/reset-password/${resetToken}`;
//     const message = `You are receiving this email because you (or someone else) has requested to reset your password. Please make a PUT request to: \n\n${resetURL}`;

//     await sendEmail({
//       email: user.email,
//       subject: 'Password Reset Request',
//       message,
//     });

//     res.status(200).json({ message: 'Password reset link sent' });
//   } catch (error) {
//     // Rollback changes if email could not be sent
//     if (user) {
//       user.resetPasswordToken = undefined;
//       user.resetPasswordExpires = undefined;
//       await user.save();
//     }

//     res.status(500).json({ error: 'Email could not be sent' });
//   }
// };

// // Function to reset the password
// const resetPassword = async (req, res) => {
//   const { token } = req.params;
//   const { password } = req.body;

//   if (!password) {
//     return res.status(400).json({ error: 'Password is required' });
//   }

//   try {
//     const user = await User.findOne({
//       resetPasswordToken: token,
//       resetPasswordExpires: { $gt: Date.now() }
//     });

//     if (!user) {
//       return res.status(400).json({ error: 'Password reset token is invalid or has expired' });
//     }

//     user.password = await bcrypt.hash(password, 10);
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpires = undefined;

//     await user.save();

//     res.status(200).json({ message: 'Password has been reset' });
//   } catch (error) {
//     res.status(500).json({ error: 'An error occurred while resetting the password' });
//   }
// };

// module.exports = { requestPasswordReset, resetPassword };
