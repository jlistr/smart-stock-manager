import { Product, StockStatus } from './types'

export const getStockStatus = (product: Product): StockStatus => {
  if (product.currentStock === 0) return 'out'
  if (product.currentStock <= product.minimumThreshold) return 'low'
  return 'healthy'
}

export const calculateReorderQuantity = (product: Product): number => {
  const deficit = product.minimumThreshold - product.currentStock
  return Math.max(deficit * 2, product.minimumThreshold)
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export const getTotalInventoryValue = (products: Product[]): number => {
  return products.reduce((sum, product) => sum + product.currentStock * product.unitPrice, 0)
}
