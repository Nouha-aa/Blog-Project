import React from 'react';
import { motion } from 'framer-motion';
import { Button } from 'flowbite-react';
import { FaExclamationCircle } from 'react-icons/fa';

// Variabili di animazione
const containerVariants = {
  hidden: { opacity: 0, y: 100 },
  visible: { opacity: 1, y: 0, transition: { duration: 1 } },
};

const iconVariants = {
  bounce: {
    y: [0, -20, 0],
    transition: {
      duration: 1,
      repeat: Infinity,
      repeatType: 'loop',
    },
  },
};

// Funzione per generare particelle casuali
const Particle = () => {
  const x = Math.random() * window.innerWidth;
  const y = Math.random() * window.innerHeight;
  const size = Math.random() * 10 + 5;
  const duration = Math.random() * 5 + 5;

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '50%',
      }}
      animate={{
        x: [x, x + (Math.random() - 0.5) * 200],
        y: [y, y + (Math.random() - 0.5) * 200],
        opacity: [1, 0],
      }}
      transition={{ duration, repeat: Infinity, repeatType: 'loop' }}
    />
  );
};

const NotFound = () => {
  return (
    <div className="relative flex items-center justify-center h-screen bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 overflow-hidden">
      {/* Particelle animate */}
      {Array.from({ length: 50 }).map((_, index) => (
        <Particle key={index} />
      ))}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center p-8 bg-white shadow-lg rounded-lg max-w-lg z-10"
      >
        <motion.div
          variants={iconVariants}
          className="text-6xl text-red-600 mb-4"
        >
          <FaExclamationCircle />
        </motion.div>
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-700 mb-6">
          Whoops! Looks like you're lost in space.
        </p>
        <Button gradientDuoTone="pinkToOrange" onClick={() => window.location.href = '/'}>
          Take Me Home
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFound;

