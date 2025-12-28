export interface Product {
  id: string
  name: string
  sku: string
  category: string
  currentStock: number
  minimumThreshold: number
  unitPrice: number
  lastUpdated: string
}

export interface StockAdjustment {
  productId: string
  type: 'add' | 'remove'
  quantity: number
  timestamp: string
}

export type StockStatus = 'healthy' | 'low' | 'out'
