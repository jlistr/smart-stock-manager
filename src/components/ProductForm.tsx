import { useForm } from 'react-hook-form'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Product } from '@/lib/types'

interface ProductFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: Omit<Product, 'id' | 'lastUpdated'>) => void
  product?: Product
  existingSkus: string[]
}

const categories = ['Electronics', 'Clothing', 'Food & Beverage', 'Hardware', 'Office Supplies', 'Raw Materials', 'Other']

export function ProductForm({ open, onOpenChange, onSubmit, product, existingSkus }: ProductFormProps) {
  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<Omit<Product, 'id' | 'lastUpdated'>>({
    defaultValues: product ? {
      name: product.name,
      sku: product.sku,
      category: product.category,
      currentStock: product.currentStock,
      minimumThreshold: product.minimumThreshold,
      unitPrice: product.unitPrice,
    } : {
      name: '',
      sku: '',
      category: 'Other',
      currentStock: 0,
      minimumThreshold: 10,
      unitPrice: 0,
    },
  })

  const selectedCategory = watch('category')

  const handleFormSubmit = (data: Omit<Product, 'id' | 'lastUpdated'>) => {
    const skuExists = existingSkus.includes(data.sku) && data.sku !== product?.sku
    if (skuExists) {
      return
    }
    onSubmit(data)
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <DialogDescription>
            {product ? 'Update product details' : 'Enter the product information to add it to your inventory'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              {...register('name', { required: 'Product name is required' })}
              placeholder="e.g., Wireless Mouse"
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                {...register('sku', {
                  required: 'SKU is required',
                  validate: (value) => {
                    const skuExists = existingSkus.includes(value) && value !== product?.sku
                    return !skuExists || 'SKU already exists'
                  }
                })}
                placeholder="e.g., WM-001"
                className="font-mono uppercase"
              />
              {errors.sku && <p className="text-sm text-destructive">{errors.sku.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={selectedCategory}
                onValueChange={(value) => setValue('category', value)}
              >
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentStock">Current Stock</Label>
              <Input
                id="currentStock"
                type="number"
                min="0"
                {...register('currentStock', {
                  required: 'Required',
                  min: { value: 0, message: 'Cannot be negative' },
                  valueAsNumber: true,
                })}
                className="font-mono"
              />
              {errors.currentStock && <p className="text-sm text-destructive">{errors.currentStock.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="minimumThreshold">Min. Threshold</Label>
              <Input
                id="minimumThreshold"
                type="number"
                min="0"
                {...register('minimumThreshold', {
                  required: 'Required',
                  min: { value: 0, message: 'Cannot be negative' },
                  valueAsNumber: true,
                })}
                className="font-mono"
              />
              {errors.minimumThreshold && <p className="text-sm text-destructive">{errors.minimumThreshold.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="unitPrice">Unit Price ($)</Label>
              <Input
                id="unitPrice"
                type="number"
                min="0"
                step="0.01"
                {...register('unitPrice', {
                  required: 'Required',
                  min: { value: 0, message: 'Cannot be negative' },
                  valueAsNumber: true,
                })}
                className="font-mono"
              />
              {errors.unitPrice && <p className="text-sm text-destructive">{errors.unitPrice.message}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {product ? 'Update Product' : 'Add Product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
