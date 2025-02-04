'use client'
import { Dialog, Transition } from '@headlessui/react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Fragment, useState } from 'react'

interface SizeGuideModalProps {
  isOpen: boolean
  onClose: () => void
}

const SizeGuideModal = ({ isOpen, onClose }: SizeGuideModalProps) => {
  const sizes = [
    {
      size: "D30 x H150cm",
      description: "Perfect for small dining areas or as bedside lighting. Creates an intimate atmosphere in corners or over small tables. Ideal for spaces with ceiling height of 2.4m or more.",
      recommended: "Small dining nooks, bedside tables, reading corners"
    },
    {
      size: "D40 x H150cm",
      description: "A versatile size that works well in medium-sized spaces. Provides balanced lighting for dining tables seating 2-4 people.",
      recommended: "Small dining tables, kitchen islands, entryways"
    },
    {
      size: "D50 x H150cm",
      description: "Creates a striking presence while maintaining elegance. Perfect for medium to large dining areas or as a centerpiece in living spaces.",
      recommended: "Medium dining tables, living room seating areas"
    },
    {
      size: "D60 x H150cm",
      description: "Makes a bold statement while providing ample illumination. Ideal for larger dining tables or as a focal point in spacious rooms.",
      recommended: "Large dining tables, open-plan living areas"
    },
    {
      size: "D80 x H150cm",
      description: "Our largest size, perfect for grand spaces. Creates a dramatic impact while maintaining the characteristic gentle illumination of wabi-sabi design.",
      recommended: "Large dining halls, hotel lobbies, expansive living spaces"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 2;

  const handleNext = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + itemsPerPage, sizes.length - 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - itemsPerPage, 0));
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="div" className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-[#6B5E4C]">Size Guide</h3>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-[#6B5E4C]/5 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-[#6B5E4C]" />
                  </button>
                </Dialog.Title>

                <div className="space-y-6">
                  <p className="text-sm text-[#8C7E6A]">
                    Our Wabi-Sabi pendant light comes in various sizes to suit different spaces. 
                    The measurements are given as Diameter (D) × Height (H) in centimeters.
                  </p>

                  <div className="grid gap-4">
                    {sizes.slice(currentIndex, currentIndex + itemsPerPage).map((item) => (
                      <div key={item.size} className="p-4 rounded-lg bg-[#F9F7F4] border border-[#B5A48B]/20">
                        <h4 className="font-medium text-[#6B5E4C] mb-2">{item.size}</h4>
                        <p className="text-sm text-[#8C7E6A] mb-2">{item.description}</p>
                        <p className="text-sm">
                          <span className="text-[#6B5E4C] font-medium">Recommended for: </span>
                          <span className="text-[#8C7E6A]">{item.recommended}</span>
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="relative h-10 mt-4">
                    {currentIndex > 0 && (
                      <button 
                        onClick={handlePrev} 
                        className="absolute left-0 p-2 bg-[#6B5E4C] text-white rounded hover:bg-[#6B5E4C]/80 transition transform hover:scale-110"
                      >
                        <ChevronLeft className="w-5 h-5 transition-transform duration-200" />
                      </button>
                    )}
                    {currentIndex + itemsPerPage < sizes.length && (
                      <button 
                        onClick={handleNext} 
                        className="absolute right-0 p-2 bg-[#6B5E4C] text-white rounded hover:bg-[#6B5E4C]/80 transition transform hover:scale-110"
                      >
                        <ChevronRight className="w-5 h-5 transition-transform duration-200" />
                      </button>
                    )}
                  </div>

                  <div className="mt-6 p-4 bg-[#6B5E4C]/5 rounded-lg">
                    <p className="text-sm text-[#6B5E4C]">
                      <strong>Note:</strong> All sizes come with 150cm height, which includes the hanging cord. 
                      The cord length can be adjusted during installation to achieve your desired hanging height.
                    </p>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default SizeGuideModal 