import React from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (localStorage.getItem("loggedIn") || localStorage.getItem("user")) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="text-white h-screen flex flex-col justify-center items-center">
      <div className="layer"></div>
      <div className="text-center">
        <h1 className="text-4xl font-bold">ManagePro</h1>
        <p className="mt-4 text-[1.5rem] text-lg">
          Streamline Your Projects, Achieve Your Goals
        </p>
      </div>

      <div className="mt-8">
        <button
          onClick={handleGetStarted}
          className="bg-orange-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Hero;
