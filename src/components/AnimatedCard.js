import React from 'react';
import { motion } from 'framer-motion';
import './AnimatedCard.css';

const AnimatedCard = ({ 
  children, 
  className = '', 
  delay = 0, 
  duration = 0.5,
  hover = true,
  ...props 
}) => {
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: duration,
        delay: delay,
        ease: "easeOut"
      }
    }
  };

  const hoverVariants = hover ? {
    hover: {
      y: -8,
      scale: 1.02,
      rotateX: 5,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  } : {};

  return (
    <motion.div
      className={`animated-card ${className}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={hover ? "hover" : {}}
      {...hoverVariants}
      {...props}
    >
      <div className="card-content">
        {children}
      </div>
      <div className="card-glow"></div>
    </motion.div>
  );
};

export default AnimatedCard; 