import type { Product } from '@/lib/shopify/types'
import { useCallback, useState } from 'react'

export function useQuickView() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const openQuickView = useCallback((product: Product) => {
    console.log('Opening QuickView:', { product }) // Debug log
    setSelectedProduct(product)
    setIsOpen(true)
  }, [])

  const closeQuickView = useCallback(() => {
    console.log('Closing QuickView') // Debug log
    setIsOpen(false)
    setSelectedProduct(null)
  }, [])

  return {
    isOpen,
    selectedProduct,
    openQuickView,
    closeQuickView
  }
}