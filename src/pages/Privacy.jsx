import React from "react";
import { motion } from "framer-motion";

const lines = [
  "ResumeAI does not store or share any resumes or job descriptions submitted through the tool.",
  "All processing happens in your browser — nothing is uploaded or saved.",
  "We don’t collect personal data. No tracking. No analytics.",
  "No cookies. No hidden scripts. Just your resume and your job description.",
  "Use it freely. No accounts, no limits.",
  "Contact: spsinghrathore1807@gmail.com",
];

export default function Privacy() {
  return (
    <div className="bg-white text-black">
      {/* HERO SECTION */}
      <section className="h-screen flex flex-col items-center justify-center text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl sm:text-7xl md:text-8xl font-extrabold leading-tight"
        >
          Resume<span className="bg-yellow-300 px-3 py-1 rounded ml-2">AI.</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="mt-10 text-lg text-neutral-500 animate-bounce"
        >
          ↓ scroll to read
        </motion.div>
      </section>

      {/* SCROLL REVEAL SECTION */}
      <section className="px-4 sm:px-6 py-24 max-w-4xl mx-auto space-y-24">
        {lines.map((text, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl sm:text-3xl font-light tracking-wide leading-snug text-center"
          >
            {text}
          </motion.p>
        ))}
      </section>
    </div>
  );
}
