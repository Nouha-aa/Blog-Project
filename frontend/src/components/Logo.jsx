import React, { useEffect } from 'react';
import { motion, useAnimate } from 'framer-motion';
import { SiPhotopea } from 'react-icons/si';

const Logo = () => {
  const [scope, animate] = useAnimate();

  // Funzione per l'animazione
  useEffect(() => {
    const animateLogo = async () => {
      // Animazione iniziale dell'icona
      await animate('.icon', { scale: [0, 1], rotate: [0, 360] }, { duration: 0.8, ease: "backOut" });
      
      // Animazione della scritta con effetto flash
      await animate('.text', { opacity: [0, 1, 0.5, 1] }, { duration: 0.4, times: [0, 0.2, 0.3, 1], ease: "easeOut" });
      
      // Animazione ciclica
      const infiniteAnimation = async () => {
        // Animazione dell'icona
        animate('.icon', 
          { rotate: [0, 15, -15, 0], scale: [1, 1.1, 1.1, 1] }, 
          { duration: 2, ease: "easeInOut", repeat: Infinity }
        );
        
        // Animazione della linea
        animate('.line', 
          { scaleX: [0, 1], originX: ["0%", "0%"], background: ["#00aaff", "#ff6b6b", "#4ecdc4", "#00aaff"] }, 
          { duration: 3, ease: "easeInOut", repeat: Infinity }
        );
      };
      
      infiniteAnimation();
    };
    
    animateLogo();
  }, [animate]);

  return (
    <div ref={scope} style={{ display: 'flex', alignItems: 'center', background: 'white', padding: '10px' }}>
      <motion.div className="icon" style={{ marginRight: '10px' }}>
        <SiPhotopea size={30} color="#5bcdaf" />
      </motion.div>
      <div style={{ position: 'relative' }}>
        <motion.h1 
          className="text" 
          style={{ 
            fontFamily: 'Arial, sans-serif', 
            fontSize: '1.5rem',
            color: '#333',
            margin: 0,
          }}
        >
          ic Me
        </motion.h1>
        <motion.div
          className="line"
          style={{
            position: 'absolute',
            bottom: -2,
            left: 0,
            right: 0,
            height: 2,
            background: '#00aaff'
          }}
        />
      </div>
    </div>
  );
};

export default Logo;


