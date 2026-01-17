"use client"

import { useApp } from "@/lib/app-context"
import { SectionHeader } from "@/components/ui/section-header"
import { ChevronLeft, Search, MessageCircle, Link2, Trophy, BadgeCheck } from "lucide-react"
import { friends } from "@/lib/data"

const leaderboard = [
  { rank: 1, name: "Ahmed K.", coins: 24500, badge: "gold" },
  { rank: 2, name: "Sara M.", coins: 18200, badge: "silver" },
  { rank: 3, name: "Omar H.", coins: 15400, badge: "bronze" },
  { rank: 4, name: "You", coins: 5700, badge: null },
]

const coinsToQAR = (coins: number) => (coins / 100).toFixed(coins % 100 === 0 ? 0 : 1)

export function MyCirclePage() {
  const { updateState } = useApp()

  const handleUserTap = (userId: string) => {
    const user = friends.find((f) => f.id === userId)
    if (user) {
      updateState({
        currentPage: "user-profile",
        selectedUser: user,
      })
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <button onClick={() => updateState({ currentPage: null })} className="p-2">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold">My Circle</h1>
        <div className="w-10" />
      </div>

      {/* Search */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-3 bg-muted rounded-full px-4 py-3">
          <Search className="w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search people"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Invite Friends */}
      <div className="px-4 pb-4">
        <h2 className="font-bold mb-3">Invite friends</h2>
        <div className="flex gap-3">
          <button className="flex-1 border border-border py-3 rounded-full font-semibold flex items-center justify-center gap-2">
            <Link2 className="w-5 h-5" />
            Copy Link
          </button>
        </div>
      </div>

      {/* Your Circle */}
      <div className="bg-muted/50 py-2">
        <SectionHeader title="Your Circle" action={`${friends.length} friends`} />
        <div className="px-4 space-y-3">
          {friends.map((friend) => (
            <button
              key={friend.id}
              onClick={() => handleUserTap(friend.id)}
              className="w-full bg-background rounded-2xl p-4 flex items-center gap-3"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-snoonu-red to-amber-500 p-0.5">
                <div className="w-full h-full rounded-full bg-muted flex items-center justify-center relative">
                  <span className="text-lg font-semibold">{friend.name.charAt(0)}</span>
                </div>
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-1">
                  <p className="font-semibold">{friend.name}</p>
                  {friend.isVerified && (
                    <BadgeCheck
                      className={`w-4 h-4 ${friend.verificationBadge === "blue" ? "text-blue-500" : "text-snoonu-red"}`}
                      fill={friend.verificationBadge === "blue" ? "#3b82f6" : "#E31837"}
                      stroke="white"
                    />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{friend.recommendations} recommendations</p>
              </div>
              <p className="text-xs text-muted-foreground">{friend.mutualFriends} mutual</p>
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="py-4">
        <div className="px-4 flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-amber-500" />
          <h2 className="font-bold">Top promoters this week</h2>
        </div>
        <div className="px-4 space-y-3">
          {leaderboard.map((entry) => (
            <div
              key={entry.rank}
              className={`rounded-2xl p-4 flex items-center gap-3 ${
                entry.name === "You" ? "bg-snoonu-red/10 border border-snoonu-red" : "bg-muted"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  entry.badge === "gold"
                    ? "bg-amber-400 text-white"
                    : entry.badge === "silver"
                      ? "bg-gray-300 text-gray-700"
                      : entry.badge === "bronze"
                        ? "bg-amber-700 text-white"
                        : "bg-muted text-muted-foreground"
                }`}
              >
                {entry.rank}
              </div>
              <div className="flex-1">
                <p className={`font-semibold ${entry.name === "You" ? "text-snoonu-red" : ""}`}>{entry.name}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <div className="w-5 h-5 rounded-full bg-snoonu-gold flex items-center justify-center">
                    <span className="text-white text-xs font-bold">S</span>
                  </div>
                  <span className="font-semibold">{entry.coins.toLocaleString()}</span>
                </div>
                <p className="text-xs text-muted-foreground">≈ {coinsToQAR(entry.coins)} QAR</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
