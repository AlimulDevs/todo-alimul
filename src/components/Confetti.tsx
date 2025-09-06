import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Confetti: React.FC = () => {
  const [particles, setParticles] = useState<Array<{ id: number; color: string; delay: number }>>([]);

  useEffect(() => {
    const colors = ['#7B2FF7', '#F107A3', '#00F5A0', '#09FBD3', '#FFD700', '#FF69B4'];
    const newParticles = [];
    
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5,
      });
    }
    
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              x: '50vw',
              y: '50vh',
              rotate: 0,
              scale: 1,
              opacity: 1,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 100,
              rotate: Math.random() * 720,
              scale: [1, 0.8, 0.6],
              opacity: [1, 0.8, 0],
            }}
            transition={{
              duration: 3,
              delay: particle.delay,
              ease: 'easeOut',
            }}
            className="absolute w-3 h-3 rounded-full"
            style={{ backgroundColor: particle.color }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Confetti;