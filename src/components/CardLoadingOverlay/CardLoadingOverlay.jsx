import { FaMapMarkedAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const loadingVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.5 } },
};

const CardLoadingOverlay = ({ isVisible }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/20 backdrop-blur-md shadow-inner ring-1 ring-white/30 rounded-lg"
          variants={loadingVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <div className="text-emerald-400 text-3xl mb-4">
            <FaMapMarkedAlt />
          </div>

          <div className="w-32 h-2 bg-white/30 rounded overflow-hidden mb-3">
            <motion.div
              className="h-full bg-emerald-400"
              initial={{ x: '-100%' }}
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>

          <p className="text-xs text-white/90">Memproses data, mohon tunggu...</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CardLoadingOverlay;
