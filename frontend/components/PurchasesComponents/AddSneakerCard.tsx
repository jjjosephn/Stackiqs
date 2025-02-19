import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Plus, Minus } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { useCreateProductMutation, useGetPurchasesQuery } from "@/app/state/api"

type StockItem = {
   stockId: string
   price: number
   size: number
   quantity: number
}

type ProductFormData = {
   productId: string
   name: string
   stock: StockItem[]
}
 
const AddSneakerCard = () => {
   const [addSneaker] = useCreateProductMutation()
   const {refetch} = useGetPurchasesQuery()

   const [formData, setFormData] = useState<ProductFormData>({
      productId: uuidv4(),
      name: '',
      stock: [{ stockId: uuidv4(), price: 0, size: 0, quantity: 0 }]
   })
   
   const handleAddSneaker = async (e: React.FormEvent) => {
      e.preventDefault()
      await addSneaker(formData)
      await refetch()
      console.log('New sneaker data:', formData)
      
      setFormData({
         productId: uuidv4(),
         name: '',
         stock: [{ stockId: uuidv4(), price: 0, size: 0, quantity: 0 }]
      })
   }
   
   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setFormData(prev => ({
         ...prev,
         [name]: value
      }))
   }
   
   const handleStockChange = (index: number, field: keyof StockItem, value: string) => {
      setFormData(prev => ({
         ...prev,
         stock: prev.stock.map((item, i) => 
         i === index ? { ...item, [field]: field === 'size' ? parseFloat(value) : parseInt(value, 10) } : item
         )
      }))
   }
   
   const addStockItem = () => {
      setFormData(prev => ({
         ...prev,
         stock: [...prev.stock, { stockId: uuidv4(), price: 0, size: 0, quantity: 0 }]
      }))
   }
   
   const removeStockItem = (index: number) => {
      setFormData(prev => ({
         ...prev,
         stock: prev.stock.filter((_, i) => i !== index)
      }))
   }

   return (
      <Card className="w-full max-w-4xl mx-auto">
         <CardHeader className="border-b bg-white">
            <div className="flex items-center space-x-3">
               <CardTitle className="text-2xl font-bold text-gray-900">Add New Sneaker</CardTitle>
            </div>
         </CardHeader>
         <CardContent className="p-6">
            <form onSubmit={handleAddSneaker} className="space-y-8">
               <div className="space-y-3">
                  <Label htmlFor="name" className="text-lg font-medium">
                     Sneaker Name
                  </Label>
                  <Input
                     id="name"
                     name="name"
                     placeholder="Enter sneaker name"
                     value={formData.name}
                     onChange={handleChange}
                     required
                     className="w-full h-12 text-lg"
                  />
               </div>

               <div className="space-y-4">
                  {formData.stock.map((item, index) => (
                     <div 
                        key={item.stockId} 
                        className="p-6 border rounded-lg bg-white shadow-sm transition-all hover:shadow-md"
                     >
                        <div className="flex justify-between items-center mb-4">
                           <h3 className="text-lg font-semibold text-blue-600">
                              Stock Item {index + 1}
                           </h3>
                           {index > 0 && (
                              <Button 
                                 type="button" 
                                 variant="ghost" 
                                 onClick={() => removeStockItem(index)} 
                                 className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                 <Minus className="h-4 w-4 mr-2" />
                                 Remove Item
                              </Button>
                           )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                           <div className="space-y-2">
                              <Label htmlFor={`size-${index}`} className="font-medium">
                                 Size
                              </Label>
                              <Input
                                 id={`size-${index}`}
                                 type="number"
                                 step="0.5"
                                 value={item.size}
                                 onChange={(e) => handleStockChange(index, 'size', e.target.value)}
                                 required
                                 className="h-12"
                              />
                           </div>
                           <div className="space-y-2">
                              <Label htmlFor={`price-${index}`} className="font-medium">
                                 Price ($)
                              </Label>
                              <Input
                                 id={`price-${index}`}
                                 type="number"
                                 step="0.01"
                                 value={item.price}
                                 onChange={(e) => handleStockChange(index, 'price', e.target.value)}
                                 required
                                 className="h-12"
                              />
                           </div>
                           <div className="space-y-2">
                              <Label htmlFor={`quantity-${index}`} className="font-medium">
                                 Quantity
                              </Label>
                              <Input
                                 id={`quantity-${index}`}
                                 type="number"
                                 value={item.quantity}
                                 onChange={(e) => handleStockChange(index, 'quantity', e.target.value)}
                                 required
                                 className="h-12"
                              />
                           </div>
                        </div>
                     </div>
                  ))}
               </div>

               <div className="space-y-4 pt-4">
                  <Button 
                     type="button" 
                     onClick={addStockItem} 
                     variant="outline" 
                     className="w-full h-12 text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                     <Plus className="h-5 w-5 mr-2" />
                     Add Another Size/Stock Item
                  </Button>
                  
                  <Button 
                     type="submit" 
                     className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium text-lg"
                  >
                     Add Sneaker to Inventory
                  </Button>
               </div>
            </form>
         </CardContent>
      </Card>
   )
}

export default AddSneakerCard