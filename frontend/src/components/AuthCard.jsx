import { motion } from "framer-motion";

export default function AuthCard({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1]
      }}
      className="w-full max-w-md bg-white rounded-2xl
                 shadow-[0_25px_70px_rgba(15,23,42,0.15)]
                 border border-slate-200 relative z-10"
    >
      {children}
    </motion.div>
  );
}
