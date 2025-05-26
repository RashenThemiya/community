import ContactCallButton from "../components/contact/ContactCallButton";
import ContactCards from "../components/contact/ContactCards";
import ContactCentersList from "../components/contact/ContactCentersList";
import ContactHeader from "../components/contact/ContactHeader";
import ContactMap from "../components/Contact/ContactMap.jsx";
import ContactWeather from "../components/contact/ContactWeather";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const Contact = () => {
  return (
    <div className="relative bg-gray-50 min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-50"
        style={{
          backgroundImage: 'url("/images/ContactBg.jpg")',
          filter: "brightness(0.5)",
        }}
      ></div>

      <div className="absolute inset-0 bg-white/10 z-10"></div>

      <div className="relative z-20">
        <Navbar />
        <ContactHeader />

        <div className="flex flex-col lg:flex-row justify-center items-center lg:items-start px-4 sm:px-6 lg:px-20 py-8 gap-12">
          <div className="relative w-full max-w-xl lg:max-w-[600px] h-[500px] rounded-xl overflow-hidden shadow-lg">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: "url('/images/talk.jpg')",
                opacity: 0.5,
                zIndex: 0,
                filter: "blur(2px) brightness(0.8)",
              }}
            />
            <div className="relative z-10 p-8 sm:p-9 h-full w-full">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6">Talk to Us</h2>
              <p className="text-base sm:text-lg text-gray-700 mb-10">We are here to help you anytime.</p>
              <ContactCards />
            </div>
          </div>

          <ContactMap />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row justify-between items-start gap-12">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img src="/images/logo.jpg" alt="Gov Logo" className="w-10 h-10" />
              <p className="font-semibold text-center">
                Dambulla DEC<br />Sri Lanka
              </p>
            </div>
            <div className="mt-4 flex gap-4 text-gray-600 text-xl justify-center lg:justify-start">
              <a href="#"><i className="fab fa-facebook-square"></i></a>
              <a href="#"><i className="fab fa-twitter-square"></i></a>
              <a href="#"><i className="fab fa-linkedin"></i></a>
            </div>
            <ContactWeather />
          </div>

          <ContactCallButton />
          <ContactCentersList />
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Contact;
