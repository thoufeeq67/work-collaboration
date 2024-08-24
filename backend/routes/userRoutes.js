const express = require('express'); // Import express module.
const router = express.Router(); // Create a new router using express.Router() method.
// Import the registerUser, loginUser, and getCurrentUser functions from the userControllers.js file.
const {registerUser, loginUser, getCurrentUser, generateJWT, updatePassword, updateUser,verifyEmail,ResendOTP} = require('../Controllers/userControllers');
// Import the protect middleware function from the authMiddleware.js file for protecting routes that require authentication.
const {protect} = require('../Middleware/authMiddleware');

router.post('/', registerUser); // This is the route handler for the POST /api/users/register route.
router.post('/login', loginUser); // This is the route handler for the POST /api/users/login route.
router.post('/user',  getCurrentUser); // This is the route handler for the GET /api/users/current route. We use the protect middleware function to protect this route.
router.get('/:id', updatePassword); // This is the route handler for the PUT /api/users/update-password route. We use the protect middleware function to protect this route.
router.post('/update-user',  updateUser); // This is the route handler for the PUT /api/users/update-username route. We use the protect middleware function to protect this route.
router.post('/VerifyOTP',  verifyEmail ); // This is the route handler for the PUT /api/users/update-username route. We use the protect middleware function to protect this route.
router.post('/ResendOTP',  ResendOTP ); // This is the route handler for the PUT /api/users/update-username route. We use the protect middleware function to protect this route.

module.exports = router; // Export the router object.