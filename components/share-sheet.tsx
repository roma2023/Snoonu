"use client"

import { useApp } from "@/lib/app-context"
import { X, MessageCircle, Link2, MoreHorizontal, Clock, Star, Send, Search, Users, Check } from "lucide-react"
import { useState } from "react"

export function ShareSheet() {
  const { state, updateState, sendSharedPostToChat } = useApp()
  const [copied, setCopied] = useState(false)
  const [showChatList, setShowChatList] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedChats, setSelectedChats] = useState<string[]>([])
  const [showSentConfirmation, setShowSentConfirmation] = useState(false)
  const [sentToNames, setSentToNames] = useState<string[]>([])

  if (!state.selectedRestaurant) return null

  const handleCopyLink = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClose = () => {
    updateState({ showShareSheet: false })
    setShowChatList(false)
    setSelectedChats([])
    setSearchQuery("")
    setShowSentConfirmation(false)
  }

  const toggleChatSelection = (chatId: string) => {
    setSelectedChats((prev) => (prev.includes(chatId) ? prev.filter((id) => id !== chatId) : [...prev, chatId]))
  }

  const handleSendToSelected = () => {
    if (selectedChats.length > 0 && state.selectedRestaurant) {
      // Get names of selected chats for confirmation
      const names = selectedChats
        .map((chatId) => {
          const chat = state.chats.find((c) => c.id === chatId)
          return chat?.isGroup ? chat.groupName : chat?.participants[0]?.name
        })
        .filter(Boolean) as string[]

      // Send the post to each selected chat
      selectedChats.forEach((chatId) => {
        sendSharedPostToChat(chatId, state.selectedRestaurant!)
      })

      // Show confirmation briefly then navigate to first chat
      setSentToNames(names)
      setShowSentConfirmation(true)

      // After showing confirmation, navigate to the chat thread
      setTimeout(() => {
        const firstChatId = selectedChats[0]
        const updatedChat = state.chats.find((c) => c.id === firstChatId)

        if (updatedChat) {
          // Need to get the updated version after sendSharedPostToChat
          updateState({
            showShareSheet: false,
            showStoriesViewer: false, // Close stories if open
            activeTab: "snoocircle",
            snooCircleActiveTab: "chat",
            currentPage: "chat-thread",
            selectedChat: updatedChat,
          })
        }

        setShowSentConfirmation(false)
        setSelectedChats([])
      }, 1000)
    }
  }

  const filteredChats = state.chats.filter((chat) => {
    const displayName = chat.isGroup ? chat.groupName : chat.participants[0]?.name
    return displayName?.toLowerCase().includes(searchQuery.toLowerCase())
  })

  // Sent confirmation overlay
  if (showSentConfirmation) {
    return (
      <div className="fixed inset-0 z-50">
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-background rounded-3xl p-8 mx-8 text-center animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Sent!</h3>
            <p className="text-muted-foreground">Shared to {sentToNames.join(", ")}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      {/* Sheet */}
      <div className="absolute bottom-0 left-0 right-0 max-w-md mx-auto bg-background rounded-t-3xl animate-in slide-in-from-bottom">
        {/* Handle */}
        <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mt-3 mb-2" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 pb-4">
          <h2 className="text-xl font-bold">{showChatList ? "Send to" : "Share with SnooCircle"}</h2>
          <button onClick={handleClose} className="p-2">
            <X className="w-5 h-5" />
          </button>
        </div>

        {showChatList ? (
          <div className="px-6 pb-6">
            {/* Search bar */}
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chats or people..."
                className="w-full pl-12 pr-4 py-3 bg-muted rounded-full text-sm outline-none"
              />
            </div>

            {/* Chat list */}
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {filteredChats.map((chat) => {
                const displayName = chat.isGroup ? chat.groupName : chat.participants[0]?.name
                const isSelected = selectedChats.includes(chat.id)
                const lastSnippet =
                  chat.lastMessage.length > 30 ? chat.lastMessage.slice(0, 30) + "..." : chat.lastMessage

                return (
                  <button
                    key={chat.id}
                    onClick={() => toggleChatSelection(chat.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-colors ${
                      isSelected ? "bg-snoonu-red/10 border border-snoonu-red" : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    <div className="relative">
                      {chat.isGroup ? (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-snoonu-red to-amber-500 p-0.5">
                          <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                            <span className="font-semibold">{displayName?.charAt(0)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold">{displayName}</p>
                      <p className="text-xs text-muted-foreground">
                        {chat.isGroup ? `${chat.participants.length + 1} members` : lastSnippet}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs text-muted-foreground">{chat.lastMessageTime}</span>
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? "bg-snoonu-red border-snoonu-red" : "border-muted-foreground/50"
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Send button */}
            <div className="mt-4 space-y-3">
              <button
                onClick={handleSendToSelected}
                disabled={selectedChats.length === 0}
                className={`w-full py-4 rounded-full font-semibold flex items-center justify-center gap-2 ${
                  selectedChats.length > 0 ? "bg-snoonu-red text-white" : "bg-muted text-muted-foreground"
                }`}
              >
                <Send className="w-5 h-5" />
                {selectedChats.length > 0
                  ? `Send to ${selectedChats.length} chat${selectedChats.length > 1 ? "s" : ""}`
                  : "Select chats to send"}
              </button>
              <button
                onClick={() => {
                  setShowChatList(false)
                  setSelectedChats([])
                }}
                className="w-full py-3 text-center text-muted-foreground text-sm"
              >
                Back to share options
              </button>
            </div>
          </div>
        ) : (
          <div className="px-6 pb-6">
            {/* Restaurant Preview */}
            <div className="flex gap-4 bg-muted rounded-2xl p-4 mb-4">
              <img
                src={state.selectedRestaurant.image || "/placeholder.svg"}
                alt={state.selectedRestaurant.name}
                className="w-20 h-20 rounded-xl object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{state.selectedRestaurant.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    {state.selectedRestaurant.rating}
                  </div>
                  <span>·</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {state.selectedRestaurant.deliveryTime}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{state.selectedRestaurant.categories.join(", ")}</p>
              </div>
            </div>

            {/* Reward hint */}
            <div className="bg-amber-50 rounded-2xl p-4 mb-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-snoonu-gold flex items-center justify-center">
                <span className="text-white text-lg font-bold">S</span>
              </div>
              <div>
                <p className="font-semibold text-amber-800">You both earn SnooCoins</p>
                <p className="text-xs text-amber-700">When your friend places their first order</p>
              </div>
            </div>

            {/* Share Actions */}
            <div className="space-y-3">
              <button
                onClick={() => setShowChatList(true)}
                className="w-full bg-snoonu-red text-white py-4 rounded-full font-semibold flex items-center justify-center gap-3"
              >
                <Send className="w-5 h-5" />
                Send to Chat
              </button>

              <button
                onClick={handleCopyLink}
                className="w-full border border-border py-4 rounded-full font-semibold flex items-center justify-center gap-3"
              >
                <Link2 className="w-5 h-5" />
                {copied ? "Link Copied!" : "Copy Link"}
              </button>

              <button className="w-full border border-border py-4 rounded-full font-semibold flex items-center justify-center gap-3">
                <MoreHorizontal className="w-5 h-5" />
                More Options
              </button>
            </div>

            {/* Link Preview */}
            <div className="mt-4 p-4 bg-muted rounded-2xl">
              <p className="text-xs text-muted-foreground mb-2">Your friend will see:</p>
              <div className="bg-background rounded-xl p-3 border border-border">
                <p className="text-sm font-medium">"Hasan recommended {state.selectedRestaurant.name}"</p>
                <p className="text-xs text-snoonu-red mt-1">Order now and earn SnooCoins on your first order!</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
