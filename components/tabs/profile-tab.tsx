"use client"

import { useApp } from "@/lib/app-context"
import { User, MapPin, CreditCard, Bell, HelpCircle, Settings, Crown, ChevronRight } from "lucide-react"

const coinsToQAR = (coins: number) => (coins / 100).toFixed(coins % 100 === 0 ? 0 : 1)

export function ProfileTab() {
  const { state, updateState } = useApp()

  return (
    <div className="flex flex-col">
      {/* User Header */}
      <div className="px-4 py-6 bg-muted/50">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-snoonu-red flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Hasan Jobs</h1>
            <p className="text-sm text-muted-foreground">+974 **** 5678</p>
          </div>
        </div>
      </div>

      {/* Royal Club & Coins Card */}
      <div className="px-4 py-4">
        <button
          onClick={() => updateState({ currentPage: "wallet" })}
          className="w-full bg-gradient-to-r from-amber-800 to-amber-600 rounded-2xl p-4 text-white"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown className="w-6 h-6 text-amber-300" />
              <div className="text-left">
                <p className="font-semibold">Royal Club & SnooCoins</p>
                <p className="text-sm opacity-80">
                  {state.coinBalance.toLocaleString()} coins (≈ {coinsToQAR(state.coinBalance)} QAR)
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5" />
          </div>
        </button>
      </div>


    </div>
  )
}
