'use client';

import { useAuth } from '@/providers/AuthProvider';
import { AnimatePresence, motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { Lock, Mail, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TABS = ['Sign In', 'Create Account'] as const;
type Tab = typeof TABS[number];

interface FormInputProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
  error?: string;
}

interface SocialButtonProps {
  Icon: LucideIcon;
  label: string;
  onClick: () => void;
  className?: string;
}

const FormInput = ({ 
  label, 
  type, 
  value, 
  onChange, 
  placeholder, 
  required = true, 
  error = '' 
}: FormInputProps) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-medium text-[#6B5E4C]">
      {label}
    </label>
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full rounded-lg border ${error ? 'border-red-300' : 'border-[#B5A48B]/20'} 
                   px-4 py-2.5 text-[#6B5E4C] bg-white/80 backdrop-blur-sm
                   placeholder:text-[#8C7E6A]/50 
                   focus:border-[#9C826B] focus:outline-none focus:ring-2 focus:ring-[#9C826B]/20
                   transition-all duration-200`}
        placeholder={placeholder}
      />
      {(type === 'email' || type === 'password') && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C7E6A]">
          {type === 'email' ? (
            <Mail className="h-4 w-4" />
          ) : (
            <Lock className="h-4 w-4" />
          )}
        </div>
      )}
    </div>
    {error && (
      <p className="text-xs text-red-500 mt-1">{error}</p>
    )}
  </div>
);

export const AccountModal = ({ isOpen, onClose }: AccountModalProps) => {
  const { signIn, signUp, error: authError, clearError } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('Sign In');
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (activeTab === 'Create Account' && !name) {
      newErrors.name = 'Name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    clearError();
    setErrors({});

    try {
      if (activeTab === 'Sign In') {
        await signIn(email, password);
      } else {
        await signUp(email, password, name);
      }
      onClose();
    } catch (error: any) {
      setErrors({
        form: error.message || 'An error occurred. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setErrors({});
    clearError();
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setPassword('');
      setName('');
      setErrors({});
      clearError();
      setActiveTab('Sign In');
    }
  }, [isOpen, clearError]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        />

        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-[#FAF7F2] shadow-xl
                     border border-[#B5A48B]/20"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 text-[#8C7E6A] transition-colors 
                     hover:text-[#6B5E4C] z-10"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="p-8">
            {/* Heading */}
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-light text-[#6B5E4C]">
                {activeTab === 'Sign In' ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="mt-2 text-sm text-[#8C7E6A]">
                {activeTab === 'Sign In' 
                  ? 'Sign in to your account to continue'
                  : 'Join us to start shopping'}
              </p>
            </div>

            {/* Tabs */}
            <div className="mx-auto mb-6 flex max-w-xs space-x-2 rounded-lg bg-white/50 p-1
                          border border-[#B5A48B]/10">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200
                    ${activeTab === tab
                      ? 'bg-white text-[#6B5E4C] shadow-sm'
                      : 'text-[#8C7E6A] hover:text-[#6B5E4C]'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === 'Create Account' && (
                <FormInput
                  label="Full Name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  error={errors.name}
                />
              )}

              <FormInput
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                error={errors.email}
              />

              <FormInput
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                error={errors.password}
              />

              {(errors.form || authError) && (
                <div className="rounded-md bg-red-50 p-3">
                  <p className="text-sm text-red-500">{errors.form || authError}</p>
                </div>
              )}

              <motion.button
                type="submit"
                disabled={isLoading}
                whileTap={{ scale: 0.98 }}
                className="relative w-full overflow-hidden rounded-lg bg-[#6B5E4C] 
                         py-2.5 text-sm font-medium text-white shadow-sm
                         hover:bg-[#5A4D3B] focus:outline-none focus:ring-2
                         focus:ring-[#9C826B]/20 focus:ring-offset-2
                         disabled:cursor-not-allowed disabled:opacity-50
                         transition-colors duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 
                                  border-white border-t-transparent" />
                    <span>{activeTab === 'Sign In' ? 'Signing in...' : 'Creating account...'}</span>
                  </div>
                ) : (
                  activeTab
                )}
              </motion.button>
            </form>

            {activeTab === 'Sign In' && (
              <div className="mt-6 flex items-center justify-center">
                <button
                  type="button"
                  className="text-sm text-[#8C7E6A] hover:text-[#6B5E4C] 
                           transition-colors duration-200"
                >
                  Forgot password?
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};









// 'use client';

// import { AnimatePresence, motion } from 'framer-motion';
// import type { LucideIcon } from 'lucide-react';
// import {
//     Lock,
//     Mail,
//     X
// } from 'lucide-react';
// import { useEffect, useRef, useState } from 'react';

// interface AccountModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const TABS = ['Sign In', 'Create Account'] as const;
// type Tab = typeof TABS[number];

// interface FormInputProps {
//   label: string;
//   type: string;
//   value: string;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   placeholder: string;
//   required?: boolean;
//   error?: string;
// }

// interface SocialButtonProps {
//   Icon: LucideIcon;
//   label: string;
//   onClick: () => void;
//   className?: string;
// }

// const FormInput = ({ 
//   label, 
//   type, 
//   value, 
//   onChange, 
//   placeholder, 
//   required = true, 
//   error = '' 
// }: FormInputProps) => (
//   <div className="space-y-1.5">
//     <label className="block text-sm font-medium text-[#6B5E4C]">
//       {label}
//     </label>
//     <div className="relative">
//       <input
//         type={type}
//         value={value}
//         onChange={onChange}
//         required={required}
//         className={`w-full rounded-lg border ${error ? 'border-red-300' : 'border-[#B5A48B]/20'} 
//                    px-4 py-2.5 text-[#6B5E4C] bg-white/80 backdrop-blur-sm
//                    placeholder:text-[#8C7E6A]/50 
//                    focus:border-[#9C826B] focus:outline-none focus:ring-2 focus:ring-[#9C826B]/20
//                    transition-all duration-200`}
//         placeholder={placeholder}
//       />
//       {(type === 'email' || type === 'password') && (
//         <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C7E6A]">
//           {type === 'email' ? (
//             <Mail className="h-4 w-4" />
//           ) : (
//             <Lock className="h-4 w-4" />
//           )}
//         </div>
//       )}
//     </div>
//     {error && (
//       <p className="text-xs text-red-500 mt-1">{error}</p>
//     )}
//   </div>
// );

// const SocialButton = ({ Icon, label, onClick, className = '' }: SocialButtonProps) => (
//   <button
//     onClick={onClick}
//     className={`group relative flex w-full items-center justify-center gap-2 rounded-lg
//               border border-[#B5A48B]/20 bg-white/80 backdrop-blur-sm px-4 py-2.5
//               text-sm font-medium text-[#6B5E4C] shadow-sm
//               hover:bg-[#6B5E4C] hover:text-white hover:border-[#6B5E4C]
//               focus:outline-none focus:ring-2 focus:ring-[#9C826B]/20
//               transition-all duration-200 ${className}`}
//   >
//     {Icon ? <Icon className="h-4 w-4" /> : <span>No Icon</span>}
//     <span>{label}</span>
//   </button>
// );

// export const AccountModal = ({ isOpen, onClose }: AccountModalProps) => {
//   const [activeTab, setActiveTab] = useState<Tab>('Sign In');
//   const [isLoading, setIsLoading] = useState(false);
//   const modalRef = useRef<HTMLDivElement>(null);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [name, setName] = useState('');
//   const [errors, setErrors] = useState<{[key: string]: string}>({});

//   const validateForm = () => {
//     const newErrors: {[key: string]: string} = {};
    
//     if (!email) {
//       newErrors.email = 'Email is required';
//     } else if (!/\S+@\S+\.\S+/.test(email)) {
//       newErrors.email = 'Please enter a valid email';
//     }

//     if (!password) {
//       newErrors.password = 'Password is required';
//     } else if (password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters';
//     }

//     if (activeTab === 'Create Account' && !name) {
//       newErrors.name = 'Name is required';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     setIsLoading(true);
//     setErrors({});

//     try {
//       // Here will be your auth logic
//       await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
//       onClose();
//     } catch (error: any) {
//       setErrors({
//         form: error.message || 'An error occurred. Please try again.'
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleTabChange = (tab: Tab) => {
//     setActiveTab(tab);
//     setErrors({});
//   };

//   useEffect(() => {
//     const handleEscape = (e: KeyboardEvent) => {
//       if (e.key === 'Escape') onClose();
//     };

//     const handleClickOutside = (e: MouseEvent) => {
//       if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
//         onClose();
//       }
//     };

//     if (isOpen) {
//       document.addEventListener('keydown', handleEscape);
//       document.addEventListener('mousedown', handleClickOutside);
//       document.body.style.overflow = 'hidden';
//     }

//     return () => {
//       document.removeEventListener('keydown', handleEscape);
//       document.removeEventListener('mousedown', handleClickOutside);
//       document.body.style.overflow = '';
//     };
//   }, [isOpen, onClose]);

//   if (!isOpen) return null;

//   return (
//     <AnimatePresence>
//       <div className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center p-4">
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           transition={{ duration: 0.2 }}
//           className="fixed inset-0 bg-black/30 backdrop-blur-sm"
//         />

//         <motion.div
//           ref={modalRef}
//           initial={{ opacity: 0, scale: 0.95, y: 20 }}
//           animate={{ opacity: 1, scale: 1, y: 0 }}
//           exit={{ opacity: 0, scale: 0.95, y: 20 }}
//           transition={{ duration: 0.2 }}
//           className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-[#FAF7F2] shadow-xl
//                      border border-[#B5A48B]/20"
//         >
//           {/* Close Button */}
//           <button
//             onClick={onClose}
//             className="absolute right-4 top-4 p-2 text-[#8C7E6A] transition-colors 
//                      hover:text-[#6B5E4C] z-10"
//             aria-label="Close modal"
//           >
//             <X className="h-5 w-5" />
//           </button>

//           <div className="p-8">
//             {/* Heading */}
//             <div className="mb-8 text-center">
//               <h2 className="text-2xl font-light text-[#6B5E4C]">
//                 {activeTab === 'Sign In' ? 'Welcome Back' : 'Create Account'}
//               </h2>
//               <p className="mt-2 text-sm text-[#8C7E6A]">
//                 {activeTab === 'Sign In' 
//                   ? 'Sign in to your account to continue'
//                   : 'Join us to start shopping'}
//               </p>
//             </div>

//             {/* Tabs */}
//             <div className="mx-auto mb-6 flex max-w-xs space-x-2 rounded-lg bg-white/50 p-1
//                           border border-[#B5A48B]/10">
//               {TABS.map((tab) => (
//                 <button
//                   key={tab}
//                   onClick={() => handleTabChange(tab)}
//                   className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200
//                     ${activeTab === tab
//                       ? 'bg-white text-[#6B5E4C] shadow-sm'
//                       : 'text-[#8C7E6A] hover:text-[#6B5E4C]'
//                     }`}
//                 >
//                   {tab}
//                 </button>
//               ))}
//             </div>

//             {/* Form */}
//             <form onSubmit={handleSubmit} className="space-y-4">
//               {activeTab === 'Create Account' && (
//                 <FormInput
//                   label="Full Name"
//                   type="text"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   placeholder="Enter your name"
//                   error={errors.name}
//                 />
//               )}

//               <FormInput
//                 label="Email"
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="Enter your email"
//                 error={errors.email}
//               />

//               <FormInput
//                 label="Password"
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Enter your password"
//                 error={errors.password}
//               />

//               {errors.form && (
//                 <div className="rounded-md bg-red-50 p-3">
//                   <p className="text-sm text-red-500">{errors.form}</p>
//                 </div>
//               )}

//               <motion.button
//                 type="submit"
//                 disabled={isLoading}
//                 whileTap={{ scale: 0.98 }}
//                 className="relative w-full overflow-hidden rounded-lg bg-[#6B5E4C] 
//                          py-2.5 text-sm font-medium text-white shadow-sm
//                          hover:bg-[#5A4D3B] focus:outline-none focus:ring-2
//                          focus:ring-[#9C826B]/20 focus:ring-offset-2
//                          disabled:cursor-not-allowed disabled:opacity-50
//                          transition-colors duration-200"
//               >
//                 {isLoading ? (
//                   <div className="flex items-center justify-center gap-2">
//                     <div className="h-4 w-4 animate-spin rounded-full border-2 
//                                   border-white border-t-transparent" />
//                     <span>{activeTab === 'Sign In' ? 'Signing in...' : 'Creating account...'}</span>
//                   </div>
//                 ) : (
//                   activeTab
//                 )}
//               </motion.button>
//             </form>
//             {activeTab === 'Sign In' && (
//               <div className="mt-6 flex items-center justify-center">
//                 <button
//                   type="button"
//                   className="text-sm text-[#8C7E6A] hover:text-[#6B5E4C] 
//                            transition-colors duration-200"
//                 >
//                   Forgot password?
//                 </button>
//               </div>
//             )}
//           </div>
//         </motion.div>
//       </div>
//     </AnimatePresence>
//   );
// };

// export default AccountModal;