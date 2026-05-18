// src/app/template.js
"use client";

import { motion } from "framer-motion";

export default function Template({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.35,
        ease: "easeOut",
      }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}
