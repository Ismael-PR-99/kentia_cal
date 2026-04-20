import { motion } from "framer-motion";

export default function AnimatedInput({ label, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>

      <motion.input
        whileFocus={{ scale: 1.01 }}
        className="w-full rounded-lg border border-slate-300
                   px-4 py-2.5 text-slate-800
                   focus:outline-none focus:ring-2
                   focus:ring-slate-800 focus:border-slate-800
                   transition"
        {...props}
      />
    </motion.div>
  );
}
