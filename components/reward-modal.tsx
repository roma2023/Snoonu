"use client"

import { useApp } from "@/lib/app-context"
import { X, Share2, Wallet } from "lucide-react"

export function RewardModal() {
  const { state, updateState } = useApp()

  const handleClose = () => {
    updateState({ showRewardModal: false })
  }

  const handleViewWallet = () => {
    updateState({ showRewardModal: false, currentPage: "wallet" })
  }

  const handleShare = () => {
    updateState({ showRewardModal: false, showShareSheet: true })
  }

  const hasReferrer = !!state.referrer
  const estimatedOrderTotal = 38 // QAR (demo value)

  // SnooCircle referral reward: 1% of order = 0.38 QAR = 38 SnooCoins each
  const snooCircleReward = hasReferrer ? Math.round(estimatedOrderTotal * 0.01 * 100) : 0

  // Regular Snoonu coins (unrelated to SnooCircle)
  const regularCoinsEarned = Math.round(estimatedOrderTotal * 0.1) // ~10% in regular coins

  const totalReward = snooCircleReward

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      <div className="relative bg-background rounded-3xl p-6 mx-4 max-w-sm w-full animate-in zoom-in-95">
        <button onClick={handleClose} className="absolute top-4 right-4 p-2">
          <X className="w-5 h-5" />
        </button>

        {/* Coin Image */}
        <div className="flex justify-center mb-4">
          <div className="w-24 h-24 rounded-full flex items-center justify-center relative">
             <img src="/snoocoin.png" alt="SnooCoin" className="w-full h-full object-contain drop-shadow-xl" />
          </div>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-4xl font-black text-foreground mb-1">+ 38</h2>
          <p className="text-sm font-medium text-muted-foreground">SnooCoins Earned</p>
        </div>

        {/* Status */}
        <div className="bg-amber-50 rounded-full px-4 py-2 mb-6 text-center">
          <p className="text-sm text-amber-800">
            {hasReferrer ? "SnooCircle reward pending until delivery" : "Coins pending until delivery"}
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleShare}
            className="w-full bg-snoonu-red text-white py-4 rounded-full font-semibold flex items-center justify-center gap-2"
          >
            <Share2 className="w-5 h-5" />
            Share & Earn More
          </button>
          <button
            onClick={handleViewWallet}
            className="w-full border border-border py-4 rounded-full font-semibold flex items-center justify-center gap-2"
          >
            <Wallet className="w-5 h-5" />
            View Wallet
          </button>
        </div>
      </div>
    </div>
  )
}
