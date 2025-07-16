// src/components/LoadingScreen.jsx
import { FaMapMarkedAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const loadingVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.5 } },
};

const LoadingScreen = ({ isVisible }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 flex flex-col items-center justify-center bg-gray-900 text-white z-50"
          variants={loadingVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <div className="text-emerald-400 text-5xl mb-6">
            <FaMapMarkedAlt />
          </div>

          {/* Animated Bar */}
          <div className="w-48 h-2 bg-gray-700 rounded overflow-hidden mb-4">
            <motion.div
              className="h-full bg-emerald-400"
              initial={{ x: '-100%' }}
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>

          <p className="text-sm text-gray-300">Memuat data, mohon tunggu...</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
