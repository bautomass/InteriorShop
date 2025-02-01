// components/cart/sections/HelpSection.tsx
import { motion } from 'framer-motion';

export default function HelpSection() {
  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
      }}
      className="mt-16 text-center border-t border-[#6B5E4C]/10 pt-12"
    >
      <h3 className="text-lg font-medium text-[#6B5E4C] mb-2">Need Assistance?</h3>
      <p className="text-sm text-[#8C7E6A] mb-4">
        Our customer service team is here to help you with any questions.
      </p>
      <div className="flex justify-center gap-4">
        <a href="/contact" className="text-sm text-[#6B5E4C] hover:text-[#9e896c] underline">
          Contact Us
        </a>
        <a href="/shipping" className="text-sm text-[#6B5E4C] hover:text-[#9e896c] underline">
          Shipping Info
        </a>
        <a href="/returns" className="text-sm text-[#6B5E4C] hover:text-[#9e896c] underline">
          Returns Policy
        </a>
      </div>
    </motion.div>
  );
}