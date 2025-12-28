import { useState, useMemo } from 'react'
import { useKV } from '@github/spark/hooks'
import { Product } from '@/lib/types'
import { getStockStatus } from '@/lib/inventory'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ProductCard } from '@/components/ProductCard'
import { ProductForm } from '@/components/ProductForm'
import { StatsOverview } from '@/components/StatsOverview'
import { ReorderReport } from '@/components/ReorderReport'
import { Plus, MagnifyingGlass, Funnel, Package } from '@phosphor-icons/react'
import { toast } from 'sonner'

function App() {
  const [products, setProducts] = useKV<Product[]>('inventory-products', [])
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined)

  const productList = products || []

  const categories = useMemo(() => {
    const cats = new Set(productList.map((p) => p.category))
    return ['all', ...Array.from(cats)]
  }, [productList])

  const filteredProducts = useMemo(() => {
    let filtered = productList

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.sku.toLowerCase().includes(query)
      )
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter((p) => p.category === categoryFilter)
    }

    return filtered
  }, [productList, searchQuery, categoryFilter])

  const lowStockProducts = useMemo(
    () => productList.filter((p) => getStockStatus(p) === 'low' || getStockStatus(p) === 'out'),
    [productList]
  )

  const handleAddProduct = (data: Omit<Product, 'id' | 'lastUpdated'>) => {
    const newProduct: Product = {
      ...data,
      id: crypto.randomUUID(),
      lastUpdated: new Date().toISOString(),
    }

    setProducts((current) => [...(current || []), newProduct])
    toast.success('Product added successfully', {
      description: `${newProduct.name} has been added to inventory`,
    })
  }

  const handleEditProduct = (data: Omit<Product, 'id' | 'lastUpdated'>) => {
    if (!editingProduct) return

    setProducts((current) => {
      const currentList = current || []
      return currentList.map((p) =>
        p.id === editingProduct.id
          ? { ...data, id: p.id, lastUpdated: new Date().toISOString() }
          : p
      )
    })
    toast.success('Product updated', {
      description: `${data.name} has been updated`,
    })
    setEditingProduct(undefined)
  }

  const handleDeleteProduct = (productId: string) => {
    const product = productList.find((p) => p.id === productId)
    setProducts((current) => (current || []).filter((p) => p.id !== productId))
    toast.success('Product deleted', {
      description: `${product?.name} has been removed from inventory`,
    })
  }

  const handleStockAdjust = (productId: string, type: 'add' | 'remove', quantity: number) => {
    setProducts((current) => {
      const currentList = current || []
      return currentList.map((p) => {
        if (p.id !== productId) return p

        const newStock =
          type === 'add'
            ? p.currentStock + quantity
            : Math.max(0, p.currentStock - quantity)

        return {
          ...p,
          currentStock: newStock,
          lastUpdated: new Date().toISOString(),
        }
      })
    })

    const product = productList.find((p) => p.id === productId)
    toast.success('Stock updated', {
      description: `${type === 'add' ? 'Added' : 'Removed'} ${quantity} units ${type === 'add' ? 'to' : 'from'} ${product?.name}`,
    })
  }

  const handleOpenAddForm = () => {
    setEditingProduct(undefined)
    setIsFormOpen(true)
  }

  const handleOpenEditForm = (product: Product) => {
    setEditingProduct(product)
    setIsFormOpen(true)
  }

  const existingSkus = productList.map((p) => p.sku)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-primary" weight="duotone" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">StockSync</h1>
                <p className="text-sm text-muted-foreground">Inventory Management</p>
              </div>
            </div>
            <Button onClick={handleOpenAddForm} size="lg" className="shadow-md">
              <Plus className="w-5 h-5 md:mr-2" weight="bold" />
              <span className="hidden md:inline">Add Product</span>
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 md:px-6 py-6 space-y-6">
        <StatsOverview products={productList} />

        {lowStockProducts.length > 0 && (
          <Alert className="border-warning/30 bg-warning/5">
            <AlertDescription className="flex items-center gap-2">
              <span className="font-semibold">{lowStockProducts.length} product{lowStockProducts.length !== 1 ? 's' : ''}</span>
              <span>below minimum threshold. Check the Reorder Report for details.</span>
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="all" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">
                All Products
                {productList.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-mono">
                    {productList.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="low-stock">
                Low Stock
                {lowStockProducts.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-warning/20 text-warning-foreground text-xs font-mono">
                    {lowStockProducts.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="report">Reorder Report</TabsTrigger>
            </TabsList>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search products or SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full sm:w-[300px]"
                />
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Funnel className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories
                    .filter((cat) => cat !== 'all')
                    .map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="all" className="space-y-4">
            {filteredProducts.length === 0 && productList.length === 0 && (
              <div className="text-center py-16 space-y-4">
                <Package className="w-16 h-16 mx-auto text-muted-foreground/50" weight="duotone" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">No products yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Get started by adding your first product to the inventory
                  </p>
                  <Button onClick={handleOpenAddForm}>
                    <Plus className="w-4 h-4 mr-2" weight="bold" />
                    Add Your First Product
                  </Button>
                </div>
              </div>
            )}

            {filteredProducts.length === 0 && productList.length > 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground">No products match your search or filter criteria</p>
              </div>
            )}

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={handleOpenEditForm}
                  onDelete={handleDeleteProduct}
                  onStockAdjust={handleStockAdjust}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="low-stock" className="space-y-4">
            {lowStockProducts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground">All products are above minimum threshold</p>
              </div>
            )}

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {lowStockProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={handleOpenEditForm}
                  onDelete={handleDeleteProduct}
                  onStockAdjust={handleStockAdjust}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="report">
            <ReorderReport products={productList} />
          </TabsContent>
        </Tabs>
      </main>
      <ProductForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
        product={editingProduct}
        existingSkus={existingSkus}
      />
    </div>
  );
}

export default App