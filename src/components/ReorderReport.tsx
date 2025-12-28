import { Product } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getStockStatus, calculateReorderQuantity, formatCurrency } from '@/lib/inventory'
import { Button } from '@/components/ui/button'
import { FileText, Download } from '@phosphor-icons/react'
import { Separator } from '@/components/ui/separator'

interface ReorderReportProps {
  products: Product[]
}

export function ReorderReport({ products }: ReorderReportProps) {
  const lowStockProducts = products.filter((p) => getStockStatus(p) === 'low' || getStockStatus(p) === 'out')

  const totalReorderCost = lowStockProducts.reduce((sum, product) => {
    const reorderQty = calculateReorderQuantity(product)
    return sum + reorderQty * product.unitPrice
  }, 0)

  const handlePrint = () => {
    window.print()
  }

  if (lowStockProducts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-muted-foreground" />
            <div>
              <CardTitle>Reorder Report</CardTitle>
              <CardDescription>Products below minimum threshold</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-muted-foreground">All products are above minimum threshold. No reorders needed!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-muted-foreground" />
            <div>
              <CardTitle>Reorder Report</CardTitle>
              <CardDescription>{lowStockProducts.length} product{lowStockProducts.length !== 1 ? 's' : ''} need reordering</CardDescription>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Download className="w-4 h-4 mr-2" />
            Print Report
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {lowStockProducts.map((product) => {
            const reorderQty = calculateReorderQuantity(product)
            const reorderCost = reorderQty * product.unitPrice

            return (
              <div key={product.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold">{product.name}</h4>
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <span className="font-mono uppercase">{product.sku}</span>
                      <span>•</span>
                      <span>{product.category}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-semibold text-lg">{formatCurrency(reorderCost)}</div>
                    <div className="text-xs text-muted-foreground">Estimated cost</div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Current</div>
                    <div className="font-mono font-semibold">{product.currentStock}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Minimum</div>
                    <div className="font-mono">{product.minimumThreshold}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Suggested Qty</div>
                    <div className="font-mono font-semibold text-accent-foreground">{reorderQty}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Unit Price</div>
                    <div className="font-mono">{formatCurrency(product.unitPrice)}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <Separator />

        <div className="flex justify-between items-center pt-2">
          <div className="text-sm text-muted-foreground">
            Total Estimated Reorder Cost
          </div>
          <div className="font-mono font-bold text-2xl">{formatCurrency(totalReorderCost)}</div>
        </div>
      </CardContent>
    </Card>
  )
}
