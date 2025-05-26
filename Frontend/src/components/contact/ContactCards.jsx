import { useTranslation } from "react-i18next";

const ContactCards = () => {
  const { t } = useTranslation();

  const cards = [
    {
      icon: "📍",
      title: t("contact.address"),
      content: t("Kandy - Jaffna Highway, Dambulla"),
    },
    {
      icon: "✉️",
      title: t("contact.email"),
      content: "dambulladec@gmail.com",
      link: "mailto:dambulladec@gmail.com",
    },
    {
      icon: "📞",
      title: t("contact.phone"),
      content: "066-2285181",
      link: "tel:0662285181",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
      {cards.map(({ icon, title, content, link }, index) => (
        <div
          key={index}
          className="bg-white/90 p-2 sm:p-4 rounded-lg shadow-md text-center hover:shadow-xl transition h-full flex flex-col justify-between"
        >
          <div className="text-2xl sm:text-4xl mb-1 sm:mb-2">{icon}</div>
          <h3 className="text-base sm:text-xl font-semibold text-gray-800 mb-1 break-words">{title}</h3>
          {link ? (
            <a href={link} className="text-blue-700 text-xs sm:text-sm hover:underline break-words">
              {content}
            </a>
          ) : (
            <p className="text-gray-700 text-xs sm:text-sm break-words">{content}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ContactCards;
