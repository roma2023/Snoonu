"use client"

import type React from "react"

interface ChipProps {
  label: string
  active?: boolean
  icon?: React.ReactNode
  onClick?: () => void
}

export function Chip({ label, active = false, icon, onClick }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
        active ? "bg-foreground text-background" : "bg-muted text-foreground hover:bg-muted/80"
      }`}
    >
      {icon}
      {label}
    </button>
  )
}
