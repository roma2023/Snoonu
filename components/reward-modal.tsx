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

        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-snoonu-gold to-amber-400 flex items-center justify-center">
            <span className="text-4xl">🎉</span>
          </div>
        </div>

        {hasReferrer ? (
          <>
            <h2 className="text-2xl font-bold text-center mb-1">You earned {totalReward} SnooCoins!</h2>
            <p className="text-center text-muted-foreground mb-4">Pending until delivery</p>

            {/* Breakdown */}
            <div className="bg-muted rounded-2xl p-4 mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">SnooCircle Referral (1%)</span>
                <span className="font-semibold text-amber-600">+{snooCircleReward}</span>
              </div>
              <div className="flex justify-between mb-3">
                <span className="text-muted-foreground">Regular Snoonu Coins</span>
                <span className="font-semibold">+{regularCoinsEarned}</span>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">SnooCircle Reward</span>
                  <div className="text-right">
                    <span className="font-bold text-snoonu-red">+{snooCircleReward}</span>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Referrer notification */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 mb-4">
              <p className="text-sm text-amber-800 text-center">
                <span className="font-semibold">{state.referrer}</span> also earned +{snooCircleReward} SnooCoins from
                your order!
              </p>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center mb-1">Order Placed!</h2>
            <p className="text-center text-muted-foreground mb-4">You earned +{regularCoinsEarned} Snoonu Coins</p>

            <div className="bg-muted rounded-2xl p-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Regular Coins</span>
                <span className="font-semibold">+{regularCoinsEarned}</span>
              </div>
            </div>
          </>
        )}

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
            Share & earn more SnooCoins
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
