import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const MarketOperations = () => {
  const { t } = useTranslation();

  return (
    <section className="bg-white px-6 py-16 md:px-20 lg:px-36">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-green-700 mb-6">
            {t('marketOperations.title')}
          </h2>
          <div className="space-y-6 text-gray-700 text-lg leading-relaxed text-justify">
            <p className="whitespace-pre-line">{t('marketOperations.para1')}</p>
            <p className="whitespace-pre-line">{t('marketOperations.para2')}</p>
            <p className="whitespace-pre-line">{t('marketOperations.para3')}</p>
            <p className="whitespace-pre-line">{t('marketOperations.para4')}</p>
          </div>
        </div>

        {/* Animated Image */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="w-full flex justify-center"
        >
          <motion.img
            src="/images/market.jpeg"
            alt={t('marketOperations.imageAlt')}
            className="w-full max-w-md rounded-2xl shadow-lg object-cover transition-transform duration-300 hover:scale-105"
            whileTap={{ scale: 0.97 }}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default MarketOperations;
