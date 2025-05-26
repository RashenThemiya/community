import { useTranslation } from "react-i18next";

const ContactHeader = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center py-12 px-4 sm:px-6">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">{t("contact.title")}</h1>
      <p className="text-gray-500 mt-2">{t("contact.breadcrumb")}</p>
    </div>
  );
};

export default ContactHeader;
