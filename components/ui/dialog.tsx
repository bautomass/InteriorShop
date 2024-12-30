import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

interface DialogProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}

export function Dialog({ open, onClose, children, className = '' }: DialogProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (open) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [open, onClose])

  if (typeof window === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            if (e.target === overlayRef.current) onClose()
          }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            className={`bg-white dark:bg-primary-950 rounded-lg shadow-xl max-h-[90vh] w-full ${className}`}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}








// // components/ui/dialog.tsx
// import { AnimatePresence, motion } from 'framer-motion'
// import { useEffect, useRef } from 'react'
// import { createPortal } from 'react-dom'

// interface DialogProps {
//   open: boolean
//   onClose: () => void
//   children: React.ReactNode
//   className?: string
// }

// export function Dialog({ open, onClose, children, className = '' }: DialogProps) {
//   const overlayRef = useRef<HTMLDivElement>(null)

//   useEffect(() => {
//     const handleEscape = (e: KeyboardEvent) => {
//       if (e.key === 'Escape') onClose()
//     }

//     if (open) {
//       document.addEventListener('keydown', handleEscape)
//       document.body.style.overflow = 'hidden'
//     }

//     return () => {
//       document.removeEventListener('keydown', handleEscape)
//       document.body.style.overflow = 'unset'
//     }
//   }, [open, onClose])

//   if (typeof window === 'undefined') return null

//   return createPortal(
//     <AnimatePresence>
//       {open && (
//         <motion.div
//           ref={overlayRef}
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           onClick={(e) => {
//             if (e.target === overlayRef.current) onClose()
//           }}
//           className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//         >
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95, y: 20 }}
//             animate={{ opacity: 1, scale: 1, y: 0 }}
//             exit={{ opacity: 0, scale: 0.95, y: 20 }}
//             transition={{ type: "spring", duration: 0.5 }}
//             className={`bg-white dark:bg-primary-950 rounded-lg shadow-xl max-h-[90vh] w-full ${className}`}
//           >
//             {children}
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>,
//     document.body
//   )
// }