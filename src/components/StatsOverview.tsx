import { Card, CardContent } from '@/components/ui/card'
import { Package, WarningCircle, CurrencyDollar } from '@phosphor-icons/react'
import { Product } from '@/lib/types'
import { getStockStatus, getTotalInventoryValue, formatCurrency } from '@/lib/inventory'

interface StatsOverviewProps {
  products: Product[]
}

export function StatsOverview({ products }: StatsOverviewProps) {
  const lowStockCount = products.filter((p) => {
    const status = getStockStatus(p)
    return status === 'low' || status === 'out'
  }).length

  const totalValue = getTotalInventoryValue(products)

  const stats = [
    {
      label: 'Total Products',
      value: products.length,
      icon: Package,
      color: 'text-primary',
    },
    {
      label: 'Low Stock Items',
      value: lowStockCount,
      icon: WarningCircle,
      color: lowStockCount > 0 ? 'text-warning' : 'text-muted-foreground',
    },
    {
      label: 'Inventory Value',
      value: formatCurrency(totalValue),
      icon: CurrencyDollar,
      color: 'text-success',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold font-mono">
                    {stat.value}
                  </p>
                </div>
                <Icon className={`w-8 h-8 ${stat.color}`} weight="duotone" />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
