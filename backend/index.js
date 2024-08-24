// Load environment variables from .env file
require("dotenv").config();

// Import modules
const express = require("express");
const connectDB = require("./Connect/database");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const User = require("./Models/userModel");

// Import routes
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");
const { sendContactEmail } = require("./Controllers/contactController");
// const authRoutes = require('./routes/authRoutes'); // Uncomment if you have authRoutes

const GoogleStrategy = require("passport-google-oauth20").Strategy;

const googleId = process.env.GOOGLE_CLIENT_ID;
const googleSecret = process.env.GOOGLE_CLIENT_SECRET;

// Initialize express app
const app = express();

// Connect to database
connectDB();

// Use CORS middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from this origin
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Allow cookies and credentials
  })
);

// Set session
app.use(
  session({
    secret: "sfjjjdlsjasl23",
    resave: false,
    saveUninitialized: true,
  })
);

// Initialize passport and session middleware
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: googleId,
      clientSecret: googleSecret,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ["profile", "email"],
    },
    async function (accessToken, refreshToken, profile, done) {
      // console.log("Profile", profile);

      try {
        // Find a user by their email address
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          // If the user does not exist, create a new user
          user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            // Add provider field if you have it in your schema
          });

          // Save the new user to the database
          await user.save();
        }

        // Pass the user object to the `done` callback
        return done(null, user);
      } catch (error) {
        // Handle any errors that occur
        return done(error, null);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    if (user) {
      done(null, user);
    } else {
      done(new Error("User not found"), null);
    }
  } catch (error) {
    done(error, null);
  }
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login",
  }),
  function (req, res) {
    res.redirect("http://localhost:3000/dashboard");
  }
);

app.get("/login/success", (req, res) => {
  if (req.user) {
    res.json({
      success: true,
      message: "User has successfully authenticated",
      data: req.user.email,
      cookies: req.cookies,
    });
  } else {
    res.status(401).json({
      success: false,
      message: "User has not authenticated",
    });
  }
});

// Parse incoming JSON requests
app.use(express.json());

// Use routes
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);
// app.use('/api/auth', authRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.post("/api/contact", sendContactEmail);

// Define PORT
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
