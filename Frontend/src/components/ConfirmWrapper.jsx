import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ConfirmWrapper = ({ onConfirm, children }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChildClick = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    onConfirm();
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  return (
    <>
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg space-y-4 w-60 h-35 flex flex-col items-center justify-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-center text-lg font-semibold">Are you sure?</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleCancel}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  No
                </button>
                <button
                  onClick={handleConfirm}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Yes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div onClick={handleChildClick}>
        {children}
      </div>
    </>
  );
};

export default ConfirmWrapper;
