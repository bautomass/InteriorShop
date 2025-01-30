import { Dialog, Transition } from '@headlessui/react';
import { Heart, Package, X } from 'lucide-react';
import { Fragment, useState } from 'react';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: () => Promise<void>;
  customerData: {
    firstName: string;
    totalOrders?: number;
    joinedDate?: string;
    loyaltyPoints?: number;
  };
}

export default function DeleteAccountModal({
  isOpen,
  onClose,
  onConfirmDelete,
  customerData
}: DeleteAccountModalProps) {
  const [step, setStep] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirmDelete();
    } catch (error) {
      console.error('Error deleting account:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const resetModal = () => {
    setStep(1);
    setConfirmText('');
    onClose();
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={resetModal} className="relative z-50">
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

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div className="flex justify-between items-start mb-4">
                  <Dialog.Title className="text-lg font-semibold text-red-600">
                    {step === 1 ? 'Wait! Are You Sure?' : 'Final Confirmation'}
                  </Dialog.Title>
                  <button onClick={resetModal} className="text-gray-400 hover:text-gray-500">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {step === 1 ? (
                  <>
                    <div className="space-y-4">
                      <p className="text-gray-600">
                        Hey {customerData.firstName}, we'll be sad to see you go! Before you leave, here's what you'll be losing:
                      </p>
                      
                      <div className="space-y-3 py-4">
                        <div className="flex items-center gap-3">
                          <Package className="h-5 w-5 text-[#9e896c]" />
                          <div>
                            <p className="font-medium text-gray-900">Order History</p>
                            <p className="text-sm text-gray-500">
                              You've placed {customerData.totalOrders || 0} orders with us
                            </p>
                          </div>
                        </div>

                        {customerData.loyaltyPoints && (
                          <div className="flex items-center gap-3">
                            <Heart className="h-5 w-5 text-[#9e896c]" />
                            <div>
                              <p className="font-medium text-gray-900">Loyalty Points</p>
                              <p className="text-sm text-gray-500">
                                You'll lose {customerData.loyaltyPoints} points
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-3">
                          <div className="h-5 w-5 text-[#9e896c] flex items-center justify-center">
                            🎂
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Member Since</p>
                            <p className="text-sm text-gray-500">
                              {new Date(customerData.joinedDate || '').toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600">
                        Instead of deleting your account, would you like to:
                      </p>
                      <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                        <li>Unsubscribe from marketing emails?</li>
                        <li>Talk to our customer support?</li>
                        <li>Take a break and come back later?</li>
                      </ul>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                      <button
                        onClick={resetModal}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
                      >
                        Keep My Account
                      </button>
                      <button
                        onClick={() => setStep(2)}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded-md
                                 hover:bg-red-200 text-sm font-medium"
                      >
                        Continue with Deletion
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-4">
                      <p className="text-gray-600">
                        This action cannot be undone. Your account and all associated data will be permanently deleted.
                      </p>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Please type "DELETE" to confirm:
                        </label>
                        <input
                          type="text"
                          value={confirmText}
                          onChange={(e) => setConfirmText(e.target.value)}
                          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2
                                   text-gray-900 placeholder-gray-500
                                   focus:border-red-500 focus:ring-red-500 focus:outline-none text-sm"
                          placeholder="Type DELETE to confirm"
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                      <button
                        onClick={() => setStep(1)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
                      >
                        Go Back
                      </button>
                      <button
                        onClick={handleDelete}
                        disabled={confirmText !== 'DELETE' || isDeleting}
                        className="px-4 py-2 bg-red-600 text-white rounded-md
                                 hover:bg-red-700 text-sm font-medium disabled:opacity-50
                                 disabled:cursor-not-allowed"
                      >
                        {isDeleting ? 'Deleting...' : 'Delete My Account'}
                      </button>
                    </div>
                  </>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}