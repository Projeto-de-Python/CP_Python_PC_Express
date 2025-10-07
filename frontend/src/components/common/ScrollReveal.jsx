import { motion, useInView } from 'framer-motion';
import PropTypes from 'prop-types';
import { useRef } from 'react';

/**
 * ScrollReveal - Component that animates children when they come into view
 * Inspired by premium web experiences like Lusion.co
 */
const ScrollReveal = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  distance = 50,
  once = true,
  threshold = 0.1
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: once,
    margin: '0px 0px -100px 0px',
    amount: threshold
  });

  // Direction variants
  const variants = {
    up: {
      hidden: { opacity: 0, y: distance },
      visible: { opacity: 1, y: 0 }
    },
    down: {
      hidden: { opacity: 0, y: -distance },
      visible: { opacity: 1, y: 0 }
    },
    left: {
      hidden: { opacity: 0, x: distance },
      visible: { opacity: 1, x: 0 }
    },
    right: {
      hidden: { opacity: 0, x: -distance },
      visible: { opacity: 1, x: 0 }
    },
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 }
    },
    scale: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants[direction]}
      transition={{
        duration: duration,
        delay: delay,
        ease: [0.25, 0.46, 0.45, 0.94] // Smooth easing curve
      }}
    >
      {children}
    </motion.div>
  );
};

ScrollReveal.propTypes = {
  children: PropTypes.node.isRequired,
  direction: PropTypes.oneOf(['up', 'down', 'left', 'right', 'fade', 'scale']),
  delay: PropTypes.number,
  duration: PropTypes.number,
  distance: PropTypes.number,
  once: PropTypes.bool,
  threshold: PropTypes.number
};

export default ScrollReveal;

