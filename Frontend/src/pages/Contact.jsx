import React, { useEffect, useRef } from "react";
import Navbar from "../components/Navbar";

const Contact = () => {
  const weatherRef = useRef(null);

  useEffect(() => {
    if (!weatherRef.current) return;

    const existingScript = document.querySelector('script[src="https://weatherwidget.io/js/widget.min.js"]');
    if (existingScript) {
      window.__weatherwidget_init && window.__weatherwidget_init();
    } else {
      const script = document.createElement("script");
      script.src = "https://weatherwidget.io/js/widget.min.js";
      script.async = true;
      script.onload = () => {
        window.__weatherwidget_init && window.__weatherwidget_init();
      };
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-10">Contact Us</h1>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Left Side: Contact Info */}
          <div className="bg-white p-8 rounded-3xl shadow space-y-6">
            <div className="flex justify-center">
              <img
                src="https://via.placeholder.com/150"
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-blue-500"
              />
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold text-gray-800">Chris Wijerathna</h2>
              <p className="text-gray-600">Manager</p>
            </div>

            <div className="space-y-1">
              <p><strong>Phone:</strong> <a href="tel:+94662285181" className="text-blue-600">+94 66 228 5181</a></p>
              <p><strong>Email:</strong> <a href="mailto:dambulladec@gmail.com" className="text-blue-600">dambulladec@gmail.com</a></p>
              <p><strong>Office:</strong> Dambulla Dedicated Economic Center</p>
            </div>

            {/* Weather Widget */}
            
          </div>

          {/* Right Side: Google Map */}
          <div className="bg-white p-4 rounded-3xl shadow h-full">
            <iframe
              title="Dambulla Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.1641971879697!2d80.6495784154007!3d7.866005007973187!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae4a242b18c2e79%3A0x3b1f5c4bfa4a1c23!2sDedicated%20Economic%20Center%2C%20Dambulla!5e0!3m2!1sen!2slk!4v1617771726796!5m2!1sen!2slk"
              width="100%"
              height="400"
              className="rounded-lg"
              loading="lazy"
              allowFullScreen=""
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>&copy; 2025 Precious Center. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Contact;
