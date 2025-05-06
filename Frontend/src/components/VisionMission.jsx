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
import treeAnimation from '../../public/Animation - 1746479551878.json';

const items = [
  {
    icon: <Target className="text-green-700 w-6 h-6" />,
    text: 'To directly contribute to fulfilling the vegetable and fruit needs of the Sri Lankan population by supplying essential vegetables, fruits, and grains that are clean and affordable.',
  },
  {
    icon: <DollarSign className="text-green-700 w-6 h-6" />,
    text: 'To protect traditional vegetable and fruit producers by offering fair and attractive prices for their produce.',
  },
  {
    icon: <Leaf className="text-green-700 w-6 h-6" />,
    text: 'To ensure the continuous production of high-quality, waste-free vegetables and fruits, thereby increasing the income of farmers and uplifting their living standards.',
  },
  {
    icon: <Repeat className="text-green-700 w-6 h-6" />,
    text: 'To revive the declining local agricultural industry.',
  },
  {
    icon: <TrendingUp className="text-green-700 w-6 h-6" />,
    text: 'To enhance the income of wholesale traders through a well-planned and systematic wholesale business, supporting the development of the Dambulla region.',
  },
  {
    icon: <Users className="text-green-700 w-6 h-6" />,
    text: 'To provide direct employment to over 5,000 people and indirect employment to more than 15,000, making Dambulla a key human resource hub for Sri Lanka.',
  },
];

const VisionMission = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col lg:flex-row gap-8 items-stretch">
        
        {/* Left Column: Vision + Animation */}
        <motion.div
          className="bg-green-600 text-white rounded-2xl p-8 shadow-lg w-full lg:w-1/2 flex flex-col justify-between"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-8 h-8 text-white" />
                <h2 className="text-3xl font-bold">Vision</h2>
              </div>
              <p className="text-lg leading-relaxed">
                Progress of the nation through peace of mind for the farming community.
              </p>
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

        {/* Right Column: Mission */}
        <motion.div
          className="bg-white rounded-2xl p-8 shadow-md w-full lg:w-1/2 border border-green-100 flex flex-col justify-between"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Target className="text-green-700 w-8 h-8" />
              <h2 className="text-3xl font-bold text-green-800">Mission</h2>
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
