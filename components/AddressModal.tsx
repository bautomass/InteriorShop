//components/AddressModal.tsx
'use client';

import { CustomerAddress } from '@/types/account';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { Fragment, useState } from 'react';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (address: Omit<CustomerAddress, 'id' | 'isDefault'>) => Promise<void>;
  initialAddress?: CustomerAddress;
  title: string;
}

export default function AddressModal({
  isOpen,
  onClose,
  onSubmit,
  initialAddress,
  title
}: AddressModalProps) {
  const [formData, setFormData] = useState({
    firstName: initialAddress?.firstName || '',
    lastName: initialAddress?.lastName || '',
    company: initialAddress?.company || '',
    address1: initialAddress?.address1 || '',
    address2: initialAddress?.address2 || '',
    city: initialAddress?.city || '',
    province: initialAddress?.province || '',
    zip: initialAddress?.zip || '',
    country: initialAddress?.country || '',
    phone: initialAddress?.phone || ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save address');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto pt-16">
          <div className="flex min-h-full items-start justify-center p-3 sm:p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white 
                                 p-4 shadow-xl transition-all mx-auto my-4 relative
                                 sm:p-6 sm:my-8">
                <div className="flex items-center justify-between mb-3">
                  <Dialog.Title className="text-base font-semibold text-gray-900">
                    {title}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {error && (
                  <div className="mb-4 p-2 bg-red-50 text-red-600 text-sm rounded">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-0.5">
                        First Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          firstName: e.target.value
                        }))}
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-1.5
                                 focus:border-[#9e896c] focus:ring-[#9e896c] focus:outline-none shadow-sm
                                 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-0.5">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          lastName: e.target.value
                        }))}
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-1.5
                                 focus:border-[#9e896c] focus:ring-[#9e896c] focus:outline-none shadow-sm
                                 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-0.5">
                      Company
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        company: e.target.value
                      }))}
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-1.5
                               focus:border-[#9e896c] focus:ring-[#9e896c] focus:outline-none shadow-sm
                               text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-0.5">
                      Address Line 1 *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address1}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        address1: e.target.value
                      }))}
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-1.5
                               focus:border-[#9e896c] focus:ring-[#9e896c] focus:outline-none shadow-sm
                               text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-0.5">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      value={formData.address2}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        address2: e.target.value
                      }))}
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-1.5
                               focus:border-[#9e896c] focus:ring-[#9e896c] focus:outline-none shadow-sm
                               text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-0.5">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          city: e.target.value
                        }))}
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-1.5
                                 focus:border-[#9e896c] focus:ring-[#9e896c] focus:outline-none shadow-sm
                                 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-0.5">
                        State/Province *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.province}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          province: e.target.value
                        }))}
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-1.5
                                 focus:border-[#9e896c] focus:ring-[#9e896c] focus:outline-none shadow-sm
                                 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-0.5">
                        ZIP/Postal Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.zip}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          zip: e.target.value
                        }))}
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-1.5
                                 focus:border-[#9e896c] focus:ring-[#9e896c] focus:outline-none shadow-sm
                                 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-0.5">
                        Country *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.country}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          country: e.target.value
                        }))}
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-1.5
                                 focus:border-[#9e896c] focus:ring-[#9e896c] focus:outline-none shadow-sm
                                 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-0.5">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        phone: e.target.value
                      }))}
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-1.5
                               focus:border-[#9e896c] focus:ring-[#9e896c] focus:outline-none shadow-sm
                               text-sm"
                    />
                  </div>

                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-4 py-2 bg-[#9e896c] text-white rounded-md
                               hover:bg-[#8a775d] text-sm font-medium disabled:opacity-50"
                    >
                      {isSaving ? 'Saving...' : 'Save Address'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}