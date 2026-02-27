import { motion } from 'framer-motion';
import { useMemo } from 'react';

const RainingRupees = () => {
  const rupees = useMemo(() => {
    return Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 8 + Math.random() * 7,
      size: 14 + Math.random() * 18,
      swayValues: [0, 20 + Math.random() * 30, -(15 + Math.random() * 25), 10 + Math.random() * 20, 0],
      rotation: Math.random() > 0.5 ? 720 : -720,
    }));
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {rupees.map((r) => (
        <motion.span
          key={r.id}
          className="absolute text-[hsl(var(--primary))] opacity-[0.12] dark:opacity-[0.05] font-bold select-none"
          style={{ left: `${r.x}%`, fontSize: `${r.size}px`, top: '-5%' }}
          animate={{
            y: ['0vh', '110vh'],
            x: r.swayValues,
            rotate: [0, r.rotation],
          }}
          transition={{
            duration: r.duration,
            delay: r.delay,
            repeat: Infinity,
            ease: 'linear',
            x: { duration: r.duration, delay: r.delay, repeat: Infinity, ease: 'easeInOut' },
            rotate: { duration: r.duration, delay: r.delay, repeat: Infinity, ease: 'linear' },
          }}
        >
          ₹
        </motion.span>
      ))}
    </div>
  );
};

export default RainingRupees;
