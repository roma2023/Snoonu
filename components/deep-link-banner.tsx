"use client"

import { useApp } from "@/lib/app-context"
import { X } from "lucide-react"

export function DeepLinkBanner() {
  const { state, updateState } = useApp()

  if (!state.referrer) return null

  return (
    <div className="bg-gradient-to-r from-snoonu-red to-amber-500 text-white px-4 py-3 flex items-center justify-between">
      <div className="flex-1">
        <p className="font-semibold text-sm">Recommended by {state.referrer}</p>
        <p className="text-xs opacity-90">Earn 1,200 SnooCoins (≈ 12 QAR) on your first order</p>
      </div>
      <div className="flex items-center gap-2">
        <button className="bg-white text-snoonu-red px-4 py-1.5 rounded-full text-sm font-semibold">Start Order</button>
        <button onClick={() => updateState({ showDeepLinkBanner: false, referrer: null })} className="p-1">
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
