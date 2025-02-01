// components/cart/sections/NavigationButtons.tsx
import { motion } from 'framer-motion';
import { ArrowLeft, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NavigationButtons() {
  const router = useRouter();

  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
      }}
      className="flex justify-center gap-3 mb-8 sm:mb-0 sm:justify-start sm:absolute sm:left-6 sm:top-14 lg:left-8 z-10"
    >
      <button
        onClick={() => router.back()}
        className="group flex items-center justify-center gap-2 px-4 py-2.5 sm:px-3 sm:py-2 
          text-sm rounded-lg bg-white shadow-sm ring-1 ring-[#6B5E4C]/5 
          transition-all duration-200 hover:shadow-md hover:bg-[#F8F6F3] text-[#6B5E4C]
          min-w-[100px] sm:min-w-0"
      >
        <ArrowLeft 
          className="w-4 h-4 transition-transform group-hover:-translate-x-1" 
          strokeWidth={1.5} 
        />
        <span className="sm:hidden">Back</span>
        <span className="hidden sm:inline">Back</span>
      </button>
      
      <button
        onClick={() => router.push('/')}
        className="group flex items-center justify-center gap-2 px-4 py-2.5 sm:px-3 sm:py-2 
          text-sm rounded-lg bg-white shadow-sm ring-1 ring-[#6B5E4C]/5 
          transition-all duration-200 hover:shadow-md hover:bg-[#F8F6F3] text-[#6B5E4C]
          min-w-[100px] sm:min-w-0"
      >
        <Home 
          className="w-4 h-4 transition-transform group-hover:scale-110" 
          strokeWidth={1.5} 
        />
        <span className="sm:hidden">Home</span>
        <span className="hidden sm:inline">Home</span>
      </button>
    </motion.div>
  );
}