import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);

  useEffect(() => {
    const addEventListeners = () => {
      document.addEventListener('mousemove', mMove);
      document.addEventListener('mousedown', mDown);
      document.addEventListener('mouseup', mUp);
      
      const hoverables = document.querySelectorAll('a, button, input, textarea, .hover-trigger');
      hoverables.forEach((el) => {
        el.addEventListener('mouseenter', () => setLinkHovered(true));
        el.addEventListener('mouseleave', () => setLinkHovered(false));
      });
    };

    const removeEventListeners = () => {
      document.removeEventListener('mousemove', mMove);
      document.removeEventListener('mousedown', mDown);
      document.removeEventListener('mouseup', mUp);
    };

    const mMove = (el: MouseEvent) => {
      setPosition({ x: el.clientX, y: el.clientY });
    };

    const mDown = () => setClicked(true);
    const mUp = () => setClicked(false);

    addEventListeners();
    return () => removeEventListeners();
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        animate={{
          x: position.x - 16,
          y: position.y - 16,
          scale: clicked ? 0.8 : linkHovered ? 1.5 : 1,
          rotate: clicked ? 45 : 0
        }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      >
        <div className={`w-full h-full border-2 border-white ${linkHovered ? 'bg-white rounded-full' : 'rounded-none'}`} />
      </motion.div>
      
      <motion.div 
        className="fixed top-0 left-0 w-2 h-2 bg-neo-primary pointer-events-none z-[9999] hidden md:block"
        animate={{
          x: position.x - 4,
          y: position.y - 4,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />
    </>
  );
};

export default CustomCursor;
