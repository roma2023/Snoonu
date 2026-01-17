"use client"

import { useRef } from "react"
import { useApp } from "@/lib/app-context"
import { Users } from "lucide-react"
import { IoFastFoodSharp, IoStorefront } from "react-icons/io5"
import { HiMiniShoppingBag } from "react-icons/hi2"
import { BsPersonCircle } from "react-icons/bs"
import { RiVipCrownFill } from "react-icons/ri"

const tabs = [
  { id: "food" as const, label: "Food", icon: IoFastFoodSharp },
  { id: "grocery" as const, label: "Grocery", icon: IoStorefront },
  { id: "market" as const, label: "Market", icon: HiMiniShoppingBag },
  { id: "snoocircle" as const, label: "SnooCircle", icon: Users },
  { id: "royalclub" as const, label: "Royal Club", icon: RiVipCrownFill },
  { id: "profile" as const, label: "Profile", icon: BsPersonCircle },
]

export function BottomNav() {
  const { state, updateState } = useApp()

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-background border-t border-border">
      <div className="flex items-center justify-around h-[72px] max-w-md mx-auto px-2">
        {tabs.map((tab) => {
          const isActive = state.activeTab === tab.id
          const Icon = tab.icon

          return (
            <button
              key={tab.id}
              onClick={() => {
                const targetTab = tab.id === "profile" ? "profile" : "snoocircle"
                 updateState({ activeTab: targetTab, currentPage: null })
              }}
              className={`flex flex-col items-center justify-center gap-0.5 px-4 py-2 -mx-3 rounded-full transition-all ${
                isActive ? "bg-snoonu-red/10" : "hover:bg-muted/50"
              }`}
            >
              <Icon 
                className={`w-6 h-6 mb-0.5 transition-colors ${
                  isActive ? "text-snoonu-red" : "text-gray-400"
                }`}
              />
              <span className={`text-[10px] font-semibold transition-colors ${
                isActive ? "text-snoonu-red" : "text-gray-400"
              }`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
