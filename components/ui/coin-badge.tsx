"use client"

import { useApp } from "@/lib/app-context"

interface CoinBadgeProps {
  onClick?: () => void
}

export function CoinBadge({ onClick }: CoinBadgeProps) {
  const { state, updateState } = useApp()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      updateState({ currentPage: "wallet" })
    }
  }

  const formatCoins = (coins: number) => {
    if (coins >= 1000) {
      return `${(coins / 1000).toFixed(1).replace(/\.0$/, "")}k`
    }
    return coins.toString()
  }

  return (
    <button onClick={handleClick} className="relative flex flex-col items-center justify-end bg-muted/90 px-3 pb-1.5 pt-6 rounded-xl min-w-[60px] hover:bg-muted/80 transition-colors overflow-visible mt-2">
      <div className="absolute -top-3 w-11 h-11 rounded-full overflow-hidden">
        <img src="/snoocoin.png" alt="SnooCoin" className="w-full h-full object-cover" />
      </div>
      <span className="text-[10px] font-bold text-foreground leading-none mt-1">{formatCoins(state.coinBalance)}</span>
    </button>
  )
}
