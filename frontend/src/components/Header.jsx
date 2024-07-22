import React from 'react';
import { motion } from 'framer-motion';

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const movingTextVariants = {
  initial: { x: '-100%' },
  animate: { x: '100%' },
};

const Header = () => {
  return (
    <div className="relative bg-white text-black py-20">
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        {/* Background Animation */}
        <motion.div
          variants={movingTextVariants}
          initial="initial"
          animate="animate"
          transition={{ duration: 40, repeat: Infinity, repeatType: 'loop' }}
          className="whitespace-nowrap text-4xl font-semibold opacity-10 absolute"
        >
          Capturing Moments with Artistic Flair
        </motion.div>
      </div>
      <div className="relative z-10 text-center px-4">
        <h1 className="text-4xl font-bold mb-6 leading-tight">
          Explore the Art of Photography
        </h1>
        <p className="text-lg max-w-2xl mx-auto">
          Discover breathtaking shots and stories behind the lens.
        </p>
      </div>
    </div>
  );
};

export default Header;


