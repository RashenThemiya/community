import { motion } from 'framer-motion';
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
import React from 'react';
import { useTranslation } from 'react-i18next';
import treeAnimation from '../assets/Animation - 1746479551878.json';

const VisionMission = () => {
  const { t } = useTranslation();

  const items = [
    {
      icon: <Target className="text-green-700 w-6 h-6" />,
      text: t('mission.1'),
    },
    {
      icon: <DollarSign className="text-green-700 w-6 h-6" />,
      text: t('mission.2'),
    },
    {
      icon: <Leaf className="text-green-700 w-6 h-6" />,
      text: t('mission.3'),
    },
    {
      icon: <Repeat className="text-green-700 w-6 h-6" />,
      text: t('mission.4'),
    },
    {
      icon: <TrendingUp className="text-green-700 w-6 h-6" />,
      text: t('mission.5'),
    },
    {
      icon: <Users className="text-green-700 w-6 h-6" />,
      text: t('mission.6'),
    },
  ];

  // Fire-like glow animation as inline style
  const glowStyle = {
    animation: 'greenGlow 2s infinite ease-in-out',
    borderRadius: '1rem',
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <style>
        {`
          @keyframes greenGlow {
            0% {
              box-shadow: 0 0 5px #22c55e, 0 0 10px #22c55e, 0 0 15px #16a34a;
            }
            50% {
              box-shadow: 0 0 15px #22c55e, 0 0 30px #16a34a, 0 0 45px #15803d;
            }
            100% {
              box-shadow: 0 0 5px #22c55e, 0 0 10px #22c55e, 0 0 15px #16a34a;
            }
          }
        `}
      </style>

      <div className="flex flex-col lg:flex-row gap-8 items-stretch">
        {/* Vision */}
        <motion.div
          className="bg-green-600 text-white rounded-2xl p-8 shadow-lg w-full lg:w-1/2 flex flex-col justify-between"
          initial={{ x: 0 }}
          animate={{ x: -100 }}
          transition={{ duration: 3, ease: 'easeInOut' }}
          style={glowStyle}
        >
          <div className="flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-8 h-8 text-white" />
                <h2 className="text-3xl font-bold">{t('vision.title')}</h2>
              </div>
              <p className="text-lg leading-relaxed">{t('vision.text')}</p>
            </div>
            <div className="mt-8">
              <Lottie
                animationData={treeAnimation}
                loop={true}
                className="w-full max-w-xs mx-auto"
              />
            </div>
          </div>
        </motion.div>

        {/* Mission */}
        <motion.div
          className="bg-white rounded-2xl p-8 shadow-md w-full lg:w-1/2 border border-green-100 flex flex-col justify-between"
          initial={{ x: 0 }}
          animate={{ x: 100 }}
          transition={{ duration: 3, ease: 'easeInOut' }}
          style={glowStyle}
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Target className="text-green-700 w-8 h-8" />
              <h2 className="text-3xl font-bold text-green-800">
                {t('mission.title')}
              </h2>
            </div>
            <ul className="space-y-5 text-gray-700">
              {items.map((item, index) => (
                <motion.li
                  key={index}
                  className="flex gap-3 items-start"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {item.icon}
                  <span className="text-lg">{item.text}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VisionMission;
