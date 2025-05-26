import { useTranslation } from "react-i18next";

const darkGreenBlack = "#145214";

const ContactCentersList = () => {
  const { t } = useTranslation();

  const mainCenters = [
    { label: t("footer.thambuththegama"), phone: "0252 275 171" },
    { label: t("footer.nuwaraEliya"), phone: "0522 223 176" },
    { label: t("footer.narahenpita"), phone: "0112 369 626" },
    { label: t("footer.welisara"), phone: "0112 981 896" },
    { label: t("footer.veyangoda"), phone: "0332 296 914" },
  ];

  const regionalCenters = [
    { label: t("footer.ratmalana"), phone: "0112 709 800" },
    { label: t("footer.meegoda"), phone: "0112 830 816" },
    { label: t("footer.kandeketiya"), phone: "0717 453 193" },
    { label: t("footer.kepptipola"), phone: "0572 280 208" },
  ];

  const renderList = (title, items) => (
    <div>
      <h3
        tabIndex={0}
        className="font-extrabold text-2xl sm:text-3xl mb-4 border-b-4 pb-1 cursor-pointer"
        style={{ borderColor: darkGreenBlack, color: darkGreenBlack }}
      >
        {title}
      </h3>
      <ul className="list-disc list-inside space-y-1 text-sm font-semibold text-green-900">
        {items.map(({ label, phone }) => (
          <li key={phone} className="hover:text-green-700 cursor-pointer">
            {label} - <span className="font-bold text-red-600 text-xs">{phone}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full">
      {renderList(t("footer.mainCenters"), mainCenters)}
      {renderList(t("footer.regionalCenters"), regionalCenters)}
    </div>
  );
};

export default ContactCentersList;
