import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import React from "react";
import { useTranslation } from "react-i18next";

const ServiceSection = () => {
  const { t } = useTranslation();
  const services = t("ServiceSection.services", { returnObjects: true }) || [];
  const sectionTitle = t("ServiceSection.sectionTitle");
  const sectionDescription = t("ServiceSection.sectionDescription");

  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

        {/* 📸 Image Side */}
        <div className="w-full">
          <div className="aspect-w-4 aspect-h-3 rounded-3xl overflow-hidden shadow-lg">
            <img
              src="/images/farmer1.jpg"
              alt={t("imageAltText")}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>

        {/* 📋 Services Info Side */}
        <div className="text-center md:text-left">
          <h2 className="text-4xl font-extrabold text-green-800 mb-4">
            {sectionTitle}
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-8 whitespace-pre-line">
            {sectionDescription}
          </p>

          <div className="space-y-4">
            {Array.isArray(services) && services.length > 0 ? (
              services.map((service, idx) => (
                <Disclosure key={idx}>
                  {({ open }) => (
                    <div className="border border-green-200 rounded-xl shadow-sm overflow-hidden">
                      <Disclosure.Button className="flex w-full justify-between items-center px-4 py-3 text-left text-green-800 font-semibold text-lg bg-green-100 hover:bg-green-200 transition">
                        <span className="flex items-center gap-2">
                          {service.icon} {service.title}
                        </span>
                        <ChevronDownIcon
                          className={`h-5 w-5 text-green-700 transform duration-200 ${open ? "rotate-180" : ""
                            }`}
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel className="px-4 py-4 text-gray-700 text-justify whitespace-pre-line bg-white">
                        {service.description}
                      </Disclosure.Panel>
                    </div>
                  )}
                </Disclosure>
              ))
            ) : (
              <p className="text-gray-500">{t("ServiceSection.noServices")}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceSection;
