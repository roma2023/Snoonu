"use client"

import { useState } from "react"
import { X, Trash2, Minus, Plus, ChevronRight, Info, Utensils, Ticket, CreditCard, Smartphone } from "lucide-react"

interface CartItem {
  id: string
  name: string
  description: string
  price: number
  quantity: number
  image: string
}

interface CartSheetProps {
  onClose: () => void
  items: CartItem[]
  restaurantName: string
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onCheckout: () => void
  referrer?: string | null
}

const recommendedItems = [
  { id: "r1", name: "Mighty Zinger Combo - M...", price: 33, image: "/zinger-burger-combo.jpg" },
  { id: "r2", name: "Zinger Combo - La...", price: 31, image: "/fried-chicken-bucket-meal.jpg" },
  { id: "r3", name: "Supreme Combo - M...", price: 31, image: "/gourmet-burger-sesame-bun.jpg" },
]

export function CartSheet({ onClose, items, restaurantName, onUpdateQuantity, onCheckout, referrer }: CartSheetProps) {
  const [showCheckout, setShowCheckout] = useState(false)
  const [deliveryOption, setDeliveryOption] = useState<"now" | "later">("now")
  const [charityEnabled, setCharityEnabled] = useState(false)
  const [useWallet, setUseWallet] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<"apple" | "card" | "naps">("apple")

  const deliveryFee = 10
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = subtotal + deliveryFee + (charityEnabled ? 2 : 0)
  const coinsEarned = Math.round(total * 0.1) // Regular coins earned

  const snooCircleRewardCoins = Math.round(total * 1) // 1% as coins directly

  const currentCoins = 57
  const coinsForFreeDelivery = 150
  const coinsNeeded = coinsForFreeDelivery - currentCoins

  if (showCheckout) {
    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center">
        <div className="absolute inset-0 bg-black/50" onClick={() => setShowCheckout(false)} />
        <div className="relative bg-background rounded-t-3xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom">
          {/* Header */}
          <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between">
            <button onClick={() => setShowCheckout(false)}>
              <X className="w-6 h-6" />
            </button>
            <h2 className="font-bold text-lg">Cart</h2>
            <button className="text-muted-foreground">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          {/* Recommended items grid (dimmed background) */}
          <div className="p-4 bg-muted/50">
            <div className="grid grid-cols-3 gap-2 opacity-50">
              {recommendedItems.map((item) => (
                <div key={item.id} className="bg-background rounded-xl p-2">
                  <div className="text-xs text-muted-foreground mb-1">FRIES</div>
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-full h-16 object-cover rounded-lg mb-2"
                  />
                  <p className="font-bold text-sm">{item.price} QR</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{item.name}</p>
                  <button className="w-full mt-2 py-1 text-sm font-medium border border-border rounded-lg">Add</button>
                </div>
              ))}
            </div>
          </div>

          {/* Charity Option */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                <span className="text-2xl">🧡</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold">Give 2 QR, Give Hope</p>
                <p className="text-sm text-muted-foreground">
                  Support a university student through Education Above All
                </p>
              </div>
              <button
                onClick={() => setCharityEnabled(!charityEnabled)}
                className={`w-12 h-7 rounded-full transition-colors ${charityEnabled ? "bg-snoonu-red" : "bg-muted"}`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${charityEnabled ? "translate-x-6" : "translate-x-1"}`}
                />
              </button>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="p-4 border-b border-border">
            <div className="flex gap-3 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedPayment("apple")}
                className={`flex-shrink-0 px-4 py-3 rounded-xl border-2 flex flex-col items-center gap-1 min-w-[100px] ${selectedPayment === "apple" ? "border-black" : "border-border"}`}
              >
                {selectedPayment === "apple" && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-black rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
                <Smartphone className="w-5 h-5" />
                <span className="text-xs font-medium">Apple Pay</span>
              </button>
              <button
                onClick={() => setSelectedPayment("card")}
                className={`flex-shrink-0 px-4 py-3 rounded-xl border-2 flex flex-col items-center gap-1 min-w-[100px] ${selectedPayment === "card" ? "border-black" : "border-border"}`}
              >
                <Plus className="w-5 h-5" />
                <span className="text-xs font-medium">Add New Card</span>
              </button>
              <button
                onClick={() => setSelectedPayment("naps")}
                className={`flex-shrink-0 px-4 py-3 rounded-xl border-2 flex flex-col items-center gap-1 min-w-[100px] ${selectedPayment === "naps" ? "border-black" : "border-border"}`}
              >
                <CreditCard className="w-5 h-5" />
                <span className="text-xs font-medium text-muted-foreground">NAPS</span>
                <span className="text-xs text-muted-foreground">Qatari Debit</span>
              </button>
            </div>
          </div>

          {/* Snoonu Wallet */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Snoonu Wallet</p>
                <p className="text-sm font-semibold">Use 1 QR</p>
              </div>
              <button
                onClick={() => setUseWallet(!useWallet)}
                className={`w-12 h-7 rounded-full transition-colors ${useWallet ? "bg-snoonu-red" : "bg-muted"}`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${useWallet ? "translate-x-6" : "translate-x-1"}`}
                />
              </button>
            </div>
          </div>

          {referrer && (
            <div className="p-4 border-b border-border bg-gradient-to-r from-amber-50 to-orange-50">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-snoonu-gold to-amber-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-amber-900">SnooCircle Reward</p>
                    <button className="text-amber-700">
                      <Info className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-amber-800 mt-1">
                    +{snooCircleRewardCoins} SnooCoins · <span className="text-amber-600">Pending</span>
                  </p>
                  <p className="text-xs text-amber-700 mt-1">You and {referrer} will receive coins after delivery.</p>
                </div>
              </div>
            </div>
          )}

          {/* Total & Pay Button */}
          <div className="p-4 bg-background">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-2xl font-bold">{total} QR</p>
                <p className="text-sm text-muted-foreground">Sub Total</p>
              </div>
              <button
                onClick={onCheckout}
                className="bg-black text-white px-12 py-4 rounded-full font-semibold flex items-center gap-2"
              >
                <Smartphone className="w-5 h-5" />
                Pay
              </button>
            </div>

            {referrer && (
              <p className="text-xs text-center text-amber-700 mt-2">
                SnooCircle reward: +{snooCircleRewardCoins} SnooCoins (Pending)
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-background rounded-t-3xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between">
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
          <h2 className="font-bold text-lg">Cart</h2>
          <button className="text-muted-foreground">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        {/* Delivery Address */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <div className="w-3 h-3 bg-black rounded-full" />
            </div>
            <div className="flex-1">
              <p className="font-semibold">Home</p>
              <p className="text-sm text-muted-foreground">
                Ar-Rayyan, Al Rayyan Municipality, Qatar, Male Student Housing
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>

        {/* Delivery By Info */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-snoonu-red flex items-center justify-center">
              <span className="text-white text-xs">🛵</span>
            </div>
            <p className="font-semibold">By {restaurantName}</p>
            <Info className="w-4 h-4 text-muted-foreground ml-auto" />
          </div>
          <div className="bg-blue-50 text-blue-700 text-sm p-3 rounded-xl">
            Delivery is by seller, so driver tracking & exact delivery time are unavailable.
          </div>
        </div>

        {/* Delivery Options */}
        <div className="p-4 border-b border-border">
          <h3 className="font-bold mb-3">Delivery Options</h3>
          <div className="flex gap-3">
            <button
              onClick={() => setDeliveryOption("now")}
              className={`flex-1 p-4 rounded-xl border-2 ${deliveryOption === "now" ? "border-black" : "border-border"}`}
            >
              <p className="font-semibold text-left">Deliver Now</p>
              <p className="text-sm text-muted-foreground text-left">in 20 mins</p>
              {deliveryOption === "now" && (
                <div className="mt-2 flex justify-end">
                  <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                </div>
              )}
            </button>
            <button
              onClick={() => setDeliveryOption("later")}
              className={`flex-1 p-4 rounded-xl border-2 ${deliveryOption === "later" ? "border-black" : "border-border"}`}
            >
              <p className="font-semibold text-left">Order for Later</p>
              <p className="text-sm text-muted-foreground text-left">Choose time</p>
            </button>
          </div>
        </div>

        {/* Restaurant & Items */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">{restaurantName}</h3>
            <button className="px-4 py-2 border border-border rounded-full text-sm font-medium">Add more</button>
          </div>

          {items.map((item) => (
            <div key={item.id} className="flex gap-4 mb-4">
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                className="w-24 h-24 rounded-xl object-cover"
              />
              <div className="flex-1">
                <h4 className="font-semibold">{item.name}</h4>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                <button className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
                  💬 Add Special Request
                </button>
                <div className="flex items-center justify-between mt-3">
                  <p className="font-bold">{item.price} QR</p>
                  <div className="flex items-center gap-3 bg-muted rounded-full px-2 py-1">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-semibold w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Voucher */}
        <div className="p-4 border-b border-border">
          <button className="flex items-center gap-3 w-full">
            <Ticket className="w-5 h-5" />
            <span className="font-medium">Add Voucher</span>
            <ChevronRight className="w-5 h-5 text-muted-foreground ml-auto" />
          </button>
        </div>

        {/* Avios Banner */}
        <div className="p-4 border-b border-border">
          <div className="bg-slate-100 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center">
              <span className="text-white text-xs font-bold">avios</span>
            </div>
            <div>
              <p className="font-semibold">Collect & spend Avios</p>
              <p className="text-sm text-muted-foreground">+1 Avios point for every 3 QR you sp...</p>
            </div>
            <Info className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>

        {/* Coins Progress */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center border-2 border-white">
                <span className="text-white text-xs">⚡</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-snoonu-gold flex items-center justify-center border-2 border-white">
                <span className="text-white text-xs">$</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm">
                You're just <span className="font-semibold">{coinsNeeded} coins</span> away from free delivery
              </p>
              <p className="text-xs text-muted-foreground">{coinsForFreeDelivery} coins needed</p>
            </div>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-green-500"
              style={{ width: `${(currentCoins / coinsForFreeDelivery) * 100}%` }}
            />
          </div>
        </div>

        {/* Something else dropdown */}
        <div className="p-4 border-b border-border flex justify-center">
          <button className="px-4 py-2 bg-muted rounded-full text-sm font-medium flex items-center gap-2">
            Something else? <ChevronRight className="w-4 h-4 rotate-90" />
          </button>
        </div>

        {/* Cutlery */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Utensils className="w-5 h-5" />
            <div className="flex-1">
              <p className="font-semibold">Cutlery</p>
              <p className="text-sm text-muted-foreground">Restaurant decides how many sets of cutlery to put</p>
            </div>
            <button className="px-4 py-2 border border-border rounded-full text-sm font-medium">Change</button>
          </div>
        </div>

        {/* Recommended for you */}
        <div className="p-4 border-b border-border">
          <h3 className="font-bold mb-4">Recommended for you</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {recommendedItems.map((item) => (
              <div key={item.id} className="flex-shrink-0 w-32 bg-muted rounded-xl p-3">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full h-20 object-cover rounded-lg mb-2"
                />
                <p className="font-bold text-sm">{item.price} QR</p>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{item.name}</p>
                <button className="w-full py-2 text-sm font-medium border border-border rounded-lg">Add</button>
              </div>
            ))}
          </div>
        </div>

        {referrer && (
          <div className="p-4 border-b border-border bg-gradient-to-r from-amber-50 to-orange-50">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-snoonu-gold to-amber-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-amber-900">SnooCircle Reward</p>
                  <button className="text-amber-700">
                    <Info className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-amber-800 mt-1">
                  +{snooCircleRewardCoins} SnooCoins · <span className="text-amber-600">Pending</span>
                </p>
                <p className="text-xs text-amber-700 mt-1">You and {referrer} will receive coins after delivery.</p>
              </div>
            </div>
          </div>
        )}

        {/* Totals */}
        <div className="p-4 border-b border-border">
          <div className="flex justify-between mb-2">
            <span className="text-muted-foreground">Delivery Fee</span>
            <span>{deliveryFee} QR</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-bold">Total</span>
            <span className="font-bold">{total} QR</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Snoonu Coins</span>
            <span className="text-amber-600 font-semibold">+{coinsEarned}</span>
          </div>
        </div>

        {/* Go to Checkout */}
        <div className="p-4">
          <button
            onClick={() => setShowCheckout(true)}
            className="w-full bg-snoonu-red text-white py-4 rounded-full font-semibold flex items-center justify-center gap-2"
          >
            Go to Checkout
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
