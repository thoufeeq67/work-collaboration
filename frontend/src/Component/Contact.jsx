import React, { useState } from "react";

import Navbar from "./Landing/Home";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSending, setIsSending] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Message sent successfully");
      } else {
        alert(result.error || "Failed to send message");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* Header */}
      <Navbar />

      <div className="bg-gray-100 min-h-screen flex justify-between items-center px-14">
        <div className="w-full lg:w-2/6">
          <h2 className="font-bold text-2xl mb-4">ManagePro</h2>
          <p className="mb-4">
            ManagePro is committed to delivering top-notch project management
            solutions tailored to your needs. Our team is dedicated to helping
            you streamline your processes and achieve your goals efficiently.
          </p>
          <h3 className="font-semibold text-lg mb-2">Contact Information</h3>
          <p className="mb-2">📞 Phone: +1 (234) 567-8901</p>
          <p className="mb-2">📧 Email: support@managepro.com</p>
          <p>📍 Address: 123 Business Rd, Suite 400, Cityville, ST, 12345</p>
        </div>

        <div className="w-2/5 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-gray-700 font-medium mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="message"
                className="block text-gray-700 font-medium mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
                rows="4"
              />
            </div>
            <button
              type="submit"
              className={`w-full py-2 rounded-md text-white ${
                isSending ? "bg-gray-500" : "bg-blue-600"
              } hover:bg-blue-700`}
              disabled={isSending}
            >
              {isSending ? "Sending Message..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Contact;
