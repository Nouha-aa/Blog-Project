import React from 'react';
import { motion } from 'framer-motion';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { Button } from 'flowbite-react';

// Varianti per Framer Motion animations
const footerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const iconVariants = {
  hover: { scale: 1.2 },
};

const Footer = () => {
  return (
    <motion.footer
      variants={footerVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="bg-white text-black py-8"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h2 className="text-2xl font-bold mb-2">Pic Me</h2>
            <p className="text-gray-700">
              Share your photography experiences and explore stunning visuals captured through the lens.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-6 text-center mb-4 md:mb-0">
            <div>
              <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
              <div className="flex justify-center md:justify-start gap-4">
                <motion.a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={iconVariants}
                  whileHover="hover"
                  className="text-gray-700 hover:text-black transition-colors"
                >
                  <FaFacebookF />
                </motion.a>
                <motion.a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={iconVariants}
                  whileHover="hover"
                  className="text-gray-700 hover:text-black transition-colors"
                >
                  <FaTwitter />
                </motion.a>
                <motion.a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={iconVariants}
                  whileHover="hover"
                  className="text-gray-700 hover:text-black transition-colors"
                >
                  <FaInstagram />
                </motion.a>
                <motion.a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={iconVariants}
                  whileHover="hover"
                  className="text-gray-700 hover:text-black transition-colors"
                >
                  <FaLinkedinIn />
                </motion.a>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-300 pt-4 text-center">
          <p className="text-gray-700">&copy; {new Date().getFullYear()} Pic_Me. All rights reserved.</p>
          <Button
            size="sm"
            className="mt-2"
            outline
            color="gray"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Back to Top
          </Button>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
