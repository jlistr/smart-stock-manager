import { Product } from '@/lib/types'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StockBadge } from '@/components/StockBadge'
import { StockAdjustmentControl } from '@/components/StockAdjustmentControl'
import { PencilSimple, Trash, Package, Barcode, Tag, CurrencyDollar } from '@phosphor-icons/react'
import { formatCurrency } from '@/lib/inventory'
import { Separator } from '@/components/ui/separator'

interface ProductCardProps {
  product: Product
  onEdit: (product: Product) => void
  onDelete: (productId: string) => void
  onStockAdjust: (productId: string, type: 'add' | 'remove', quantity: number) => void
}

export function ProductCard({ product, onEdit, onDelete, onStockAdjust }: ProductCardProps) {
  return (
    <Card className="flex flex-col hover:shadow-md transition-shadow">
      <CardHeader className="space-y-3 pb-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg leading-tight truncate">{product.name}</h3>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <Barcode className="w-4 h-4 flex-shrink-0" />
              <span className="font-mono uppercase">{product.sku}</span>
            </div>
          </div>
          <StockBadge product={product} />
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Tag className="w-4 h-4" />
            <span>{product.category}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <CurrencyDollar className="w-4 h-4" />
            <span className="font-mono">{formatCurrency(product.unitPrice)}</span>
          </div>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="flex-1 pt-6">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Current Stock</span>
            <span className="font-mono font-semibold">{product.currentStock}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Min. Threshold</span>
            <span className="font-mono">{product.minimumThreshold}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Value</span>
            <span className="font-mono font-semibold">{formatCurrency(product.currentStock * product.unitPrice)}</span>
          </div>
        </div>

        <Separator className="mb-4" />

        <StockAdjustmentControl
          currentStock={product.currentStock}
          onAdjust={(type, quantity) => onStockAdjust(product.id, type, quantity)}
        />
      </CardContent>

      <CardFooter className="flex gap-2 pt-4">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onEdit(product)}
        >
          <PencilSimple className="w-4 h-4 mr-1" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-destructive hover:text-destructive"
          onClick={() => onDelete(product.id)}
        >
          <Trash className="w-4 h-4 mr-1" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
}
