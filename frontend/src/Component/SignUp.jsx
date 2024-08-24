import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import Navbar from "./Landing/Home";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/users", {
        name,
        email,
        password,
      });

      if (response.data.success) {
        setMessage("Signup successful!");
        console.log(response.data.Data._id);
        const userId = response.data.Data._id;
        console.log("Signup UserId", userId);
        navigate("/VerifyEmial", { state: { userId } });
      } else {
        setMessage(response.data.message || "Signup failed");
      }
    } catch (error) {
      setMessage(
        error.response ? error.response.data.message : "An error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async (response) => {
    try {
      const token = response.credential;
      const googleResponse = await axios.post(
        "http://localhost:5000/api/auth/google",
        {
          token,
        }
      );

      console.log(googleResponse);
      if (googleResponse.data.success) {
        setMessage("Signup successful!");
        navigate("/login");
      } else {
        setMessage(googleResponse.data.message || "Signup failed");
      }
    } catch (error) {
      setMessage(
        error.response ? error.response.data.message : "An error occurred"
      );
    }
  };

  useEffect(() => {
    if (localStorage.getItem("loggedIn") || localStorage.getItem("user")) {
      navigate("/");
    }
  }, []);

  return (
    <>
      <Navbar />
      <GoogleOAuthProvider clientId="697063750023-7nha10stlk2j37gijq3p2kvgbmpmpu9r.apps.googleusercontent.com">
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-800">Sign Up</h2>
            <form onSubmit={handleSignup} className="mt-4">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 mt-2 border border-gray-300 rounded"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 mt-2 border border-gray-300 rounded"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 mt-2 border border-gray-300 rounded"
                required
              />
              <button
                type="submit"
                className="w-full p-2 mt-4 bg-indigo-600 text-white rounded"
                disabled={loading}
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </button>
            </form>

            {message && (
              <p className="mt-4 text-center text-red-600">{message}</p>
            )}

            {/* Sign Up with Google Button */}

            {/* Login Button */}
            <div className="mt-4 text-center">
              <p className="text-gray-600">Already have an account?</p>
              <button
                onClick={() => navigate("/login")}
                className="mt-2 text-indigo-600 hover:text-indigo-800 font-bold"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </GoogleOAuthProvider>
    </>
  );
};

export default SignupPage;
