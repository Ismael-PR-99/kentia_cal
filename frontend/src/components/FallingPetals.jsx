import { motion } from "framer-motion";

const SakuraPetal = () => (
  <svg viewBox="0 0 50 50" className="w-full h-full drop-shadow-lg">
    <defs>
      <radialGradient id="petalGradient" cx="50%" cy="50%">
        <stop offset="0%" stopColor="#fce7f3" />
        <stop offset="50%" stopColor="#fbcfe8" />
        <stop offset="100%" stopColor="#f9a8d4" />
      </radialGradient>
    </defs>
    {/* Pétalo de sakura con forma realista */}
    <path
      d="M 25 15 Q 20 20, 15 25 Q 20 30, 25 35 Q 30 30, 35 25 Q 30 20, 25 15 Z"
      fill="url(#petalGradient)"
      opacity="0.9"
    />
    {/* Detalle central */}
    <ellipse cx="25" cy="25" rx="3" ry="3" fill="#ec4899" opacity="0.6" />
  </svg>
);

export default function FallingPetals() {
  // Generar pétalos con posiciones y delays aleatorios
  const petals = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 5,
    duration: 10 + Math.random() * 6,
    size: 20 + Math.random() * 15,
    rotation: Math.random() * 360,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          initial={{
            top: -40,
            left: petal.left,
            opacity: 0,
            rotate: petal.rotation,
          }}
          animate={{
            top: "110vh",
            opacity: [0, 0.8, 0.8, 0],
            rotate: petal.rotation + 720,
            x: [0, 40, -40, 20, -20, 0],
          }}
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            repeat: Infinity,
            ease: "linear",
            x: {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
          className="absolute"
          style={{
            width: petal.size,
            height: petal.size,
          }}
        >
          <SakuraPetal />
        </motion.div>
      ))}
    </div>
  );
}
