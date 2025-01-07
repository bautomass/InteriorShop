'use client'

import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { Fragment } from 'react';

interface StyleGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const StyleGuideModal = ({ isOpen, onClose }: StyleGuideModalProps) => {
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
          <div className="fixed inset-0 bg-black bg-opacity-25" />
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
                <Dialog.Title as="div" className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-[#6B5E4C]">Style Guide</h3>
                  <button
                    onClick={onClose}
                    className="p-1 rounded-full hover:bg-[#6B5E4C]/5 transition-colors"
                  >
                    <X className="w-5 h-5 text-[#6B5E4C]" />
                  </button>
                </Dialog.Title>

                <div className="mt-4 space-y-6">
                  {/* Style descriptions */}
                  <div className="space-y-4">
                    <StyleSection
                      title="White Series"
                      styles={[
                        { name: 'White-1', description: '36cm x 6cm - Coral-like textured surface with matte finish' },
                        { name: 'White-2', description: '25cm x 14cm - Ripple pattern with wave-like texture' },
                        { name: 'White-3', description: '21m x 40cm - Smooth surface with subtle radial lines' }
                      ]}
                    />
                    <StyleSection
                      title="Black Series"
                      styles={[
                        { name: 'Black-1', description: '36cm x 6cm - Deep black with coral texture pattern' },
                        { name: 'Black-2', description: '25cm x 14cm - Charcoal with ripple effect texture' },
                        { name: 'Black-3', description: '21cm x 40cm - Sleek black with radial pattern' }
                      ]}
                    />
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

const StyleSection = ({ title, styles }: { title: string, styles: { name: string, description: string }[] }) => (
  <div className="border-t border-[#6B5E4C]/10 pt-4">
    <h4 className="text-[#6B5E4C] font-medium mb-3">{title}</h4>
    <div className="space-y-3">
      {styles.map(style => (
        <div key={style.name} className="flex items-start gap-3">
          <div className="w-20 font-medium text-[#6B5E4C]">{style.name}</div>
          <div className="text-sm text-[#8C7E6A]">{style.description}</div>
        </div>
      ))}
    </div>
  </div>
);

export default StyleGuideModal; 