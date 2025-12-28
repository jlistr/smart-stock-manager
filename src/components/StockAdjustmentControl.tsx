import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowUp, ArrowDown } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface StockAdjustmentControlProps {
  currentStock: number
  onAdjust: (type: 'add' | 'remove', quantity: number) => void
}

export function StockAdjustmentControl({ currentStock, onAdjust }: StockAdjustmentControlProps) {
  const [quantity, setQuantity] = useState(1)

  const handleQuickAdjust = (type: 'add' | 'remove', amount: number) => {
    onAdjust(type, amount)
  }

  const handleCustomAdjust = (type: 'add' | 'remove') => {
    if (quantity > 0) {
      onAdjust(type, quantity)
      setQuantity(1)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleQuickAdjust('remove', 1)}
          disabled={currentStock === 0}
          className="h-8 w-8 p-0"
        >
          <ArrowDown weight="bold" />
        </Button>
        
        <motion.div
          key={currentStock}
          initial={{ scale: 1.2, color: 'oklch(0.75 0.15 75)' }}
          animate={{ scale: 1, color: 'oklch(0.25 0.02 250)' }}
          className="font-mono text-2xl font-bold min-w-[60px] text-center"
        >
          {currentStock}
        </motion.div>
        
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleQuickAdjust('add', 1)}
          className="h-8 w-8 p-0"
        >
          <ArrowUp weight="bold" />
        </Button>
      </div>

      <div className="flex gap-2">
        <Input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          className="text-center font-mono"
          placeholder="Qty"
        />
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleCustomAdjust('remove')}
          disabled={currentStock === 0}
          className="flex-1"
        >
          Remove
        </Button>
        <Button
          size="sm"
          variant="default"
          onClick={() => handleCustomAdjust('add')}
          className="flex-1"
        >
          Add
        </Button>
      </div>
    </div>
  )
}
