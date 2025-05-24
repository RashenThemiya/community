import { AnimatePresence, motion } from 'framer-motion';
import Lottie from 'lottie-react';
import {
  DollarSign,
  Eye,
  Leaf,
  Repeat,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import treeAnimation from '../assets/Animation - 1746479551878.json';
import useIsLargeScreen from '../hook/useIsLargeScreen.js';

import backgroundImage1 from '/images/crops1.jpeg';
import backgroundImage2 from '/images/crops2.jpeg';
import backgroundImage3 from '/images/crops3.jpeg';
import backgroundImage4 from '/images/crops4.jpeg';

const VisionMission = () => {
  const { t } = useTranslation();
  const isLargeScreen = useIsLargeScreen();
  const [currentItemIndex, setCurrentItemIndex] = useState(0);

  const items = [
    { icon: <Target className="text-green-700 w-6 h-6" />, text: t('mission.1'), bg: backgroundImage1 },
    { icon: <DollarSign className="text-green-700 w-6 h-6" />, text: t('mission.2'), bg: backgroundImage2 },
    { icon: <Leaf className="text-green-700 w-6 h-6" />, text: t('mission.3'), bg: backgroundImage3 },
    { icon: <Repeat className="text-green-700 w-6 h-6" />, text: t('mission.4'), bg: backgroundImage4 },
    { icon: <TrendingUp className="text-green-700 w-6 h-6" />, text: t('mission.5'), bg: backgroundImage1 },
    { icon: <Users className="text-green-700 w-6 h-6" />, text: t('mission.6'), bg: backgroundImage2 },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentItemIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [items.length]);

  const glowStyle = {
    animation: 'greenGlow 2s infinite ease-in-out',
    borderRadius: '1rem',
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-6 sm:py-10">
      <style>
        {`
          @keyframes greenGlow {
            0% { box-shadow: 0 0 5px #22c55e, 0 0 10px #22c55e, 0 0 15px #16a34a; }
            50% { box-shadow: 0 0 15px #22c55e, 0 0 30px #16a34a, 0 0 45px #15803d; }
            100% { box-shadow: 0 0 5px #22c55e, 0 0 10px #22c55e, 0 0 15px #16a34a; }
          }
        `}
      </style>

<div className="flex flex-col lg:flex-row gap-4 items-stretch scale-[0.95]">
        {/* Vision */}
        <motion.div
          className="bg-green-600 text-white rounded-2xl p-6 sm:p-8 shadow-lg w-full lg:w-1/2 flex flex-col justify-between"
          initial={isLargeScreen ? { x: -50, opacity: 0 } : false}
          animate={isLargeScreen ? { x: 0, opacity: 1 } : false}
          transition={isLargeScreen ? { duration: 1, ease: 'easeOut' } : {}}
          style={glowStyle}
        >
          <div className="flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                <h2 className="text-2xl sm:text-3xl font-bold">{t('vision.title')}</h2>
              </div>
              <p className="text-base sm:text-lg leading-relaxed">{t('vision.text')}</p>
            </div>
            <div className="mt-6 sm:mt-8">
              <Lottie
                animationData={treeAnimation}
                loop={true}
                className="w-full max-w-xs sm:max-w-sm mx-auto"
              />
            </div>
          </div>
        </motion.div>

        {/* Mission */}
       {/* Mission */}
<motion.div
  className="relative overflow-hidden rounded-2xl p-6 sm:p-8 shadow-md w-full lg:w-1/2 border border-green-100 flex flex-col justify-between"
  initial={isLargeScreen ? { x: 50, opacity: 0 } : false}
  animate={isLargeScreen ? { x: 0, opacity: 1 } : false}
  transition={isLargeScreen ? { duration: 1, ease: 'easeOut' } : {}}
  style={glowStyle}
>
  {/* Dynamic Blurred Background with green overlay */}
  <div
    className="absolute inset-0 z-0 bg-cover bg-center"
    style={{
      backgroundImage: `url(${items[currentItemIndex].bg})`,
      filter: 'blur(1px)',
      opacity: 0.2,
    }}
  />
  {/* Green overlay */}
  <div className="absolute inset-0 bg-green-600 z-0 opacity-20 mix-blend-multiply" />

  {/* Foreground Content */}
  <div className="relative z-10">
    <div className="flex items-center gap-3 mb-4">
      <Target className="text-green-700 w-7 h-7 sm:w-8 sm:h-8" />
      <h2 className="text-2xl sm:text-3xl font-bold text-green-800">
        {t('mission.title')}
      </h2>
    </div>

    <AnimatePresence mode="wait">
      <motion.div
        key={currentItemIndex}
        className="flex gap-3 items-start text-green-900"
        initial={{ opacity: 2, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5 }}
      >
        {items[currentItemIndex].icon}
        <span className="text-xl sm:text-2xl font-semibold leading-relaxed tracking-wide">
          {items[currentItemIndex].text}
        </span>
      </motion.div>
    </AnimatePresence>
  </div>
</motion.div>

          
      </div>
    </section>
  );
};

export default VisionMission;
