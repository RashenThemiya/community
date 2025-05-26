import { useTranslation } from "react-i18next";

const ContactMap = () => {
  const { t } = useTranslation();

  return (
    
          <div className="w-full max-w-xl lg:max-w-[600px] h-[500px] rounded-xl overflow-hidden shadow-lg">
            <h2 className="text-lg sm:text-xl font-bold text-gray-700 mb-2">{t("contact.mapTitle")}</h2>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.277423359984!2d80.64919217568517!3d7.8660103061068485!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3afca5432c8b3317%3A0x7def86b17389191e!2sDambulla%20Dedicated%20Economic%20Center!5e0!3m2!1sen!2slk!4v1745987171143!5m2!1sen!2slk"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Dambulla Economic Centre Map"
            />
          </div>
       
  );
};

export default ContactMap;
