"use client"

import { useState } from "react"
import { useApp } from "@/lib/app-context"
import { Search, Edit, Users } from "lucide-react"

export function ChatTab() {
  const { state, updateState } = useApp()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredChats = state.chats.filter((chat) => {
    const name = chat.isGroup ? chat.groupName : chat.participants[0]?.name
    return name?.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const handleOpenChat = (chat: (typeof state.chats)[0]) => {
    updateState({
      currentPage: "chat-thread",
      selectedChat: chat,
    })
  }

  const handleNewChat = () => {
    // For prototype, just open first chat
    handleOpenChat(state.chats[0])
  }

  return (
    <div className="flex flex-col w-full">
      {/* Search + Action */}
      <div className="px-4 py-3 flex items-center gap-2 mt-4">
        <div className="flex-1 flex items-center gap-3 bg-muted rounded-full px-4 py-3">
          <Search className="w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <button onClick={handleNewChat} className="p-3 bg-muted rounded-full hover:bg-muted/80 transition-colors">
          <Edit className="w-5 h-5 text-snoonu-red" />
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 px-4">
        {filteredChats.map((chat) => {
          const displayName = chat.isGroup ? chat.groupName : chat.participants[0]?.name
          const initials = chat.isGroup
            ? chat.groupName
                ?.split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)
            : chat.participants[0]?.name.charAt(0)

          return (
            <button
              key={chat.id}
              onClick={() => handleOpenChat(chat)}
              className="w-full flex items-center gap-3 py-4 border-b border-border"
            >
              {/* Avatar */}
              <div className="relative">
                {chat.isGroup ? (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-snoonu-red to-amber-500 flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-snoonu-red to-amber-500 p-0.5">
                    <div className="w-full h-full rounded-full bg-muted flex items-center justify-center">
                      <span className="text-lg font-semibold">{initials}</span>
                    </div>
                  </div>
                )}
                {chat.unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-snoonu-red rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{chat.unreadCount}</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between">
                  <h3 className={`font-semibold ${chat.unreadCount > 0 ? "text-foreground" : "text-foreground"}`}>
                    {displayName}
                  </h3>
                  <span
                    className={`text-xs ${chat.unreadCount > 0 ? "text-snoonu-red font-medium" : "text-muted-foreground"}`}
                  >
                    {chat.lastMessageTime}
                  </span>
                </div>
                <p
                  className={`text-sm truncate ${chat.unreadCount > 0 ? "text-foreground font-medium" : "text-muted-foreground"}`}
                >
                  {chat.lastMessage}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
