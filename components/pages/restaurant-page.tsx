"use client"

import { useApp } from "@/lib/app-context"
import { ChevronLeft, Heart, Share2, Star, Clock, MapPin, Plus, Minus } from "lucide-react"
import { useState } from "react"

const menuItems = [
  {
    id: "1",
    name: "Zinger Combo - Medium",
    description: "Zinger Sandwich, Medium Fries, Pepsi Can",
    price: 28,
    image: "/zinger-burger-combo.jpg",
  },
  {
    id: "2",
    name: "Arabic Chicken Shawarma",
    description: "Grilled chicken, garlic sauce, pickles",
    price: 32,
    image: "/chicken-shawarma.jpg",
  },
  {
    id: "3",
    name: "Cheese Melt Sliders Duo",
    description: "Two sliders with melted cheese",
    price: 24,
    image: "/cheese-sliders.jpg",
  },
  {
    id: "4",
    name: "Firewood Chicken",
    description: "Slow-roasted chicken, herbs & spices",
    price: 40,
    image: "/grilled-chicken.png",
  },
]

export function RestaurantPage() {
  const { state, updateState } = useApp()
  const [cart, setCart] = useState<Record<string, number>>({})

  if (!state.selectedRestaurant) return null

  const handleBack = () => {
    updateState({ currentPage: null, selectedRestaurant: null, showDeepLinkBanner: false, referrer: null })
  }

  const handleShare = () => {
    updateState({ showShareSheet: true })
  }

  const addToCart = (itemId: string) => {
    setCart((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }))
  }

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const newCart = { ...prev }
      if (newCart[itemId] > 1) {
        newCart[itemId]--
      } else {
        delete newCart[itemId]
      }
      return newCart
    })
  }

  const handleCheckout = () => {
    const cartItems = Object.entries(cart).map(([itemId, qty]) => {
      const item = menuItems.find((m) => m.id === itemId)!
      return {
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        quantity: qty,
        image: item.image,
      }
    })

    updateState({
      showCartSheet: true,
      cartItems,
      cartRestaurantName: state.selectedRestaurant?.name || "Restaurant",
    })
  }

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0)
  const totalPrice = Object.entries(cart).reduce((sum, [itemId, qty]) => {
    const item = menuItems.find((m) => m.id === itemId)
    return sum + (item?.price || 0) * qty
  }, 0)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Image */}
      <div className="relative">
        <img
          src={state.selectedRestaurant.image || "/placeholder.svg"}
          alt={state.selectedRestaurant.name}
          className="w-full h-56 object-cover"
        />
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4">
          <button onClick={handleBack} className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex gap-2">
            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </button>
            <button onClick={handleShare} className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="p-4 border-b border-border">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">{state.selectedRestaurant.name}</h1>
            <p className="text-muted-foreground">
              {state.selectedRestaurant.priceLevel} · {state.selectedRestaurant.categories.join(", ")}
            </p>
          </div>
          <div className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="font-semibold">{state.selectedRestaurant.rating}</span>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {state.selectedRestaurant.deliveryTime}
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {state.selectedRestaurant.distance}
          </div>
        </div>
        {state.selectedRestaurant.isLocal && (
          <div className="mt-3">
            <span className="bg-snoonu-red/10 text-snoonu-red text-sm px-3 py-1 rounded-full">Support Local</span>
          </div>
        )}
      </div>

      {state.referrer && (
        <div className="mx-4 mt-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-snoonu-gold flex items-center justify-center">
            <span className="text-white font-bold">S</span>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-amber-800">Order & earn SnooCoins</p>
            <p className="text-sm text-amber-700">Recommended by {state.referrer} — you both earn 1% back!</p>
          </div>
        </div>
      )}

      {/* Menu */}
      <div className="p-4 flex-1">
        <h2 className="text-lg font-bold mb-4">Popular Items</h2>
        <div className="space-y-4">
          {menuItems.map((item) => (
            <div key={item.id} className="flex gap-4 bg-muted rounded-2xl p-4">
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                className="w-20 h-20 rounded-xl object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                <p className="text-snoonu-red font-bold mt-1">{item.price} QR</p>
              </div>
              <div className="flex items-center">
                {cart[item.id] ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-semibold w-6 text-center">{cart[item.id]}</span>
                    <button
                      onClick={() => addToCart(item.id)}
                      className="w-8 h-8 rounded-full bg-snoonu-red text-white flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => addToCart(item.id)}
                    className="w-10 h-10 rounded-full bg-snoonu-red text-white flex items-center justify-center"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Footer */}
      {totalItems > 0 && (
        <div className="sticky bottom-20 p-4 bg-background border-t border-border">
          <button
            onClick={handleCheckout}
            className="w-full bg-snoonu-red text-white py-4 rounded-full font-semibold flex items-center justify-between px-6"
          >
            <span>{totalItems} items</span>
            <span>View Cart · {totalPrice} QR</span>
          </button>
        </div>
      )}
    </div>
  )
}
