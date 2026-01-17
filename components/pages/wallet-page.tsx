"use client"

import { useState } from "react"
import { useApp } from "@/lib/app-context"
import { SectionHeader } from "@/components/ui/section-header"
import { Chip } from "@/components/ui/chip"
import { ChevronLeft, HelpCircle, FileText, ArrowLeftRight, Clock, Check } from "lucide-react"

const transactions = [
  { id: "1", name: "KFC", amount: 38, status: "confirmed", type: "SnooCircle referral", date: "Today" },
  { id: "2", name: "Burger Boutique", amount: 40, status: "pending", type: "SnooCircle referral", date: "Today" },
  { id: "3", name: "Red Cream Sweets", amount: 100, status: "confirmed", type: "First order bonus", date: "Yesterday" },
  {
    id: "4",
    name: "Captain Shawarma",
    amount: 20,
    status: "confirmed",
    type: "SnooCircle referral",
    date: "Yesterday",
  },
]

const redeemOffers = [
  { id: "1", name: "Captain Shawarma", discount: "8 QAR Off", coins: 38, image: "/shawarma-wrap.jpg" },
  { id: "2", name: "Namous", discount: "5 QAR Off", coins: 28, image: "/arabic-dessert.jpg" },
  { id: "3", name: "KFC", discount: "10 QAR Off", coins: 28, image: "/crispy-fried-chicken.png" },
]

export function WalletPage() {
  const { state, updateState } = useApp()
  const [activeFilter, setActiveFilter] = useState<"all" | "confirmed" | "pending">("all")

  const filteredTransactions = transactions.filter((t) => {
    if (activeFilter === "all") return true
    return t.status === activeFilter
  })

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <button onClick={() => updateState({ currentPage: null })} className="p-2">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold">Royal Club</h1>
        <button className="p-2">
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>

      {/* Greeting */}
      <div className="px-4 py-4 bg-muted/50">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-xl font-bold">Hi, Hasan Jobs!</h2>
        </div>
        <p className="text-muted-foreground">Unlock rewards and exclusive benefits</p>
      </div>

      {/* Coin Balance Card - Removed QAR conversion display */}
      <div className="px-4 py-4">
        <div className="bg-gradient-to-r from-zinc-900 to-zinc-700 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
              <img src="/snoocoin.png" alt="SnooCoin" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-sm opacity-80">Your SnooCoins balance</p>
              <p className="text-2xl font-bold">{state.coinBalance.toLocaleString()} coins</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex-1 bg-white/20 py-3 rounded-xl font-semibold flex items-center justify-center gap-2">
              <FileText className="w-4 h-4" />
              Transactions
            </button>
            <button className="flex-1 bg-white/20 py-3 rounded-xl font-semibold flex items-center justify-center gap-2">
              <ArrowLeftRight className="w-4 h-4" />
              Redeem
            </button>
          </div>
        </div>
      </div>

      {/* SnooCircle Earnings Info */}
      <div className="px-4 pb-4">
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4">
          <h3 className="font-semibold text-amber-800 mb-1">Earn coins by sharing</h3>
          <p className="text-sm text-amber-700">
            Share restaurants with friends on SnooCircle. When they order, you both earn SnooCoins!
          </p>
        </div>
      </div>

      {/* Transactions - Removed QAR equivalents from transaction amounts */}
      <div className="bg-muted/50 flex-1">
        <div className="px-4 py-3 flex items-center justify-between">
          <h2 className="text-lg font-bold ml-2">Transactions</h2>
          <div className="flex gap-2">
            <Chip label="All" active={activeFilter === "all"} onClick={() => setActiveFilter("all")} />
            <Chip
              label="Confirmed"
              active={activeFilter === "confirmed"}
              onClick={() => setActiveFilter("confirmed")}
            />
            <Chip label="Pending" active={activeFilter === "pending"} onClick={() => setActiveFilter("pending")} />
          </div>
        </div>
        <div className="px-4 space-y-3">
          {filteredTransactions.map((tx) => (
            <div key={tx.id} className="bg-background rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  {tx.status === "pending" ? (
                    <Clock className="w-5 h-5 text-amber-500" />
                  ) : (
                    <Check className="w-5 h-5 text-green-500" />
                  )}
                </div>
                <div>
                  <p className="font-semibold">{tx.name}</p>
                  <p className="text-xs text-muted-foreground">{tx.type}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${tx.status === "pending" ? "text-amber-500" : "text-green-600"}`}>
                  +{tx.amount.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">{tx.status}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Redeem Section - Removed QAR equivalents from redeem offers */}
        <div className="py-4">
          <SectionHeader title="Redeem Your Coins" onAction={() => {}} />
          <div className="px-4">
            <div className="flex gap-3 overflow-x-auto scrollbar-hide">
              {redeemOffers.map((offer) => (
                <div key={offer.id} className="min-w-[180px] bg-background rounded-2xl overflow-hidden">
                  <div className="relative">
                    <img
                      src={offer.image || "/placeholder.svg?height=96&width=180&query=food discount offer"}
                      alt={offer.name}
                      className="w-full h-24 object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                      {offer.name}
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="font-semibold">{offer.discount}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center overflow-hidden">
                         <img src="/snoocoin.png" alt="SnooCoin" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-sm font-medium">{offer.coins.toLocaleString()} coins</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
