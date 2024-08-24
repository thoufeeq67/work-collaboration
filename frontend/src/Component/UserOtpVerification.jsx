import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "./Landing/Home";
import { BiArrowBack } from "react-icons/bi";

const OtpVerification = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = location.state || {}; // Extract userId from the state

  const handleInputChange = (e) => {
    setOtp(e.target.value);
  };

  const handleVerifyOtp = async () => {
    // Logic for verifying OTP
    try {
      console.log("UserId:", userId);
      const response = await fetch(
        "http://localhost:5000/api/users/VerifyOTP",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ otp, userId }), // Include userId in the API call
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Handle successful OTP verification
        const email = data.email;
        console.log("Email", email);
        alert("OTP Verified");
        navigate("/dashboard", { state: { email } }); // Redirect to a success page or dashboard
      } else {
        // Handle OTP verification failure
        alert("Invalid OTP");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("An error occurred while verifying OTP");
    }
  };

  const backToSignUP = async () => {
    const response = await fetch("http://localhost:5000/api/users/ResendOTP", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    navigate("/signup");
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
        {/* Back to Signup button positioned at the top left */}
        <button
          onClick={backToSignUP}
          className="absolute flex items-center justify-center top-4 left-4 p-2 text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          <BiArrowBack /> <span className="pl-2">Back to Signup</span>
        </button>

        <div className="w-full max-w-xs mt-12">
          <h2 className="text-center text-2xl font-bold mb-6">
            OTP Verification
          </h2>
          <input
            type="number"
            value={otp}
            onChange={handleInputChange}
            maxLength={5}
            placeholder="Enter OTP"
            className="w-full p-3 mb-4 text-center text-xl border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleVerifyOtp}
            className="w-full p-3 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Verify OTP
          </button>
        </div>
      </div>
    </>
  );
};

export default OtpVerification;
