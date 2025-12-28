import { Product, StockStatus } from '@/lib/types'
import { getStockStatus } from '@/lib/inventory'
import { Badge } from '@/components/ui/badge'
import { WarningCircle, CheckCircle, XCircle } from '@phosphor-icons/react'

interface StockBadgeProps {
  product: Product
  showIcon?: boolean
}

export function StockBadge({ product, showIcon = true }: StockBadgeProps) {
  const status = getStockStatus(product)

  const statusConfig: Record<StockStatus, { label: string; className: string; icon: React.ReactNode }> = {
    healthy: {
      label: 'In Stock',
      className: 'bg-success/10 text-success border-success/20',
      icon: <CheckCircle className="w-3 h-3" weight="fill" />,
    },
    low: {
      label: 'Low Stock',
      className: 'bg-warning/10 text-warning-foreground border-warning/30',
      icon: <WarningCircle className="w-3 h-3" weight="fill" />,
    },
    out: {
      label: 'Out of Stock',
      className: 'bg-destructive/10 text-destructive border-destructive/20',
      icon: <XCircle className="w-3 h-3" weight="fill" />,
    },
  }

  const config = statusConfig[status]

  return (
    <Badge variant="outline" className={`${config.className} flex items-center gap-1 font-medium`}>
      {showIcon && config.icon}
      {config.label}
    </Badge>
  )
}
