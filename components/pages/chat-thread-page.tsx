"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useApp } from "@/lib/app-context"
import { restaurants, friends } from "@/lib/data"
import {
  ChevronLeft,
  MoreVertical,
  Send,
  ImageIcon,
  Plus,
  Star,
  Clock,
  Camera,
  ImageIcon as ImageIconLucide,
  Check,
} from "lucide-react"

export function ChatThreadPage() {
  const { state, updateState, sendMessageToChat } = useApp()
  const [messageText, setMessageText] = useState("")
  const [showAttachmentSheet, setShowAttachmentSheet] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const currentChat = state.chats.find((c) => c.id === state.selectedChat?.id) || state.selectedChat

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [currentChat?.messages])

  if (!currentChat) return null

  const displayName = currentChat.isGroup ? currentChat.groupName : currentChat.participants[0]?.name

  const handleBack = () => {
    updateState({ currentPage: null, selectedChat: null, snooCircleActiveTab: "chat" })
  }

  const handleSend = () => {
    if (messageText.trim() && currentChat) {
      sendMessageToChat(currentChat.id, messageText.trim(), "text")
      setMessageText("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSendImage = (type: "camera" | "gallery") => {
    const mockImages = ["/food-photo-shared-in-chat.jpg", "/restaurant-meal-photo.jpg", "/delicious-dish-photo.jpg"]
    const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)]
    sendMessageToChat(currentChat.id, "", "image", randomImage)
    setShowAttachmentSheet(false)
  }

  const handleOrderFromCard = (restaurantId: string) => {
    const restaurant = restaurants.find((r) => r.id === restaurantId)
    if (restaurant) {
      // Set up cart with a default item from this restaurant
      updateState({
        showCartSheet: true,
        cartRestaurantName: restaurant.name,
        cartItems: [
          {
            id: "item-1",
            name:
              restaurant.name === "KFC"
                ? "Zinger Combo - Medium"
                : restaurant.name === "Burger Boutique"
                  ? "Cheese Melt Burger"
                  : restaurant.name === "Captain Shawarma"
                    ? "Shawarma Wrap"
                    : restaurant.name === "Healthy Bowl Co."
                      ? "Grilled Chicken Bowl"
                      : "Popular Item",
            description: "Delicious meal",
            price: 28,
            quantity: 1,
            image: restaurant.image,
          },
        ],
        selectedRestaurant: restaurant,
        referrer: currentChat.isGroup
          ? currentChat.groupName || "Friend"
          : currentChat.participants[0]?.name || "Friend",
      })
    }
  }

  const handleOpenRestaurant = (restaurantId: string) => {
    const restaurant = restaurants.find((r) => r.id === restaurantId)
    if (restaurant) {
      updateState({
        currentPage: "restaurant",
        selectedRestaurant: restaurant,
      })
    }
  }

  const getSenderName = (senderId: string) => {
    if (senderId === "me") return null
    const sender = friends.find((f) => f.id === senderId)
    return sender?.name.split(" ")[0] || "Unknown"
  }

  return (
    <div className="flex flex-col min-h-screen bg-background relative">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 max-w-md mx-auto z-40 bg-background flex items-center justify-between px-2 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <button onClick={handleBack} className="p-2">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="relative">
            <img 
              src={!currentChat.isGroup && currentChat.participants[0]?.avatar ? currentChat.participants[0].avatar : "/placeholder.svg"} 
              alt={displayName} 
              className="w-10 h-10 rounded-full object-cover"
            />
            {!currentChat.isGroup && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h1 className="font-semibold">{displayName}</h1>
              {!currentChat.isGroup && currentChat.participants[0]?.isVerified && (
                <div className="w-4 h-4 bg-snoonu-red rounded-full flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </div>
            <p className={`text-xs ${!currentChat.isGroup ? "text-green-600 font-medium" : "text-muted-foreground"}`}>
              {currentChat.isGroup ? `${currentChat.participants.length + 1} members · Active now` : "Online"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2">
            <MoreVertical className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 pb-32 pt-24">
        {currentChat.messages.map((message, index) => {
          const isMe = message.senderId === "me"
          const senderName = currentChat.isGroup ? getSenderName(message.senderId) : null
          const showSenderName =
            currentChat.isGroup &&
            !isMe &&
            (index === 0 || currentChat.messages[index - 1].senderId !== message.senderId)

          if (message.type === "image" && message.imageUrl) {
            return (
              <div key={message.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[280px]`}>
                  {showSenderName && <p className="text-xs text-muted-foreground mb-1 ml-1">{senderName}</p>}
                  <div className={`rounded-2xl overflow-hidden ${isMe ? "rounded-br-md" : "rounded-bl-md"}`}>
                    <img
                      src={message.imageUrl || "/placeholder.svg"}
                      alt="Shared image"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <p className={`text-xs mt-1 ${isMe ? "text-right" : "text-left"} text-muted-foreground`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            )
          }

          if (message.type === "shared_post" && message.sharedPost) {
            return (
              <div key={message.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[280px] ${isMe ? "items-end" : "items-start"}`}>
                  {showSenderName && <p className="text-xs text-muted-foreground mb-1 ml-1">{senderName}</p>}
                  <div className={`rounded-2xl overflow-hidden ${isMe ? "bg-snoonu-red" : "bg-muted"}`}>
                    <button
                      onClick={() => handleOpenRestaurant(message.sharedPost!.restaurantId)}
                      className="w-full text-left"
                    >
                      <img
                        src={message.sharedPost.restaurantImage || "/placeholder.svg"}
                        alt={message.sharedPost.restaurantName}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-3">
                        <p className={`text-xs ${isMe ? "text-white/70" : "text-muted-foreground"}`}>
                          Shared from SnooCircle
                        </p>
                        <p className={`font-semibold ${isMe ? "text-white" : "text-foreground"}`}>
                          {message.sharedPost.restaurantName}
                        </p>
                        <div
                          className={`flex items-center gap-2 text-xs mt-1 ${isMe ? "text-white/80" : "text-muted-foreground"}`}
                        >
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            <span>4.5</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>25 mins</span>
                          </div>
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleOrderFromCard(message.sharedPost!.restaurantId)}
                      className={`mx-3 mb-3 w-[calc(100%-24px)] py-2 rounded-lg text-sm font-semibold text-center ${
                        isMe ? "bg-white/20 text-white" : "bg-snoonu-red text-white"
                      }`}
                    >
                      Order
                    </button>
                  </div>
                  <p className={`text-xs mt-1 ${isMe ? "text-right" : "text-left"} text-muted-foreground`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            )
          }

          return (
            <div key={message.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[280px]`}>
                {showSenderName && <p className="text-xs text-muted-foreground mb-1 ml-1">{senderName}</p>}
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    isMe ? "bg-snoonu-red text-white rounded-br-md" : "bg-muted rounded-bl-md"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
                <p className={`text-xs mt-1 ${isMe ? "text-right" : "text-left"} text-muted-foreground`}>
                  {message.timestamp}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="fixed bottom-[70px] left-0 right-0 max-w-md mx-auto px-4 py-3 border-t border-border bg-background z-40">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowAttachmentSheet(true)} 
            className="p-2 -ml-2 text-muted-foreground hover:text-snoonu-red transition-colors"
          >
            <Plus className="w-6 h-6" />
          </button>
          
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Message..."
            className="flex-1 bg-muted text-foreground px-4 py-3 rounded-full text-sm outline-none focus:ring-2 focus:ring-snoonu-red/20 transition-all placeholder:text-muted-foreground"
          />
          
          <button
            onClick={handleSend}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              messageText.trim() 
                ? "bg-snoonu-red text-white shadow-md hover:scale-105 active:scale-95" 
                : "bg-muted text-muted-foreground"
            }`}
          >
            <Send className="w-5 h-5 ml-0.5" />
          </button>
        </div>
      </div>

      {showAttachmentSheet && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setShowAttachmentSheet(false)}>
          <div
            className="absolute bottom-0 left-0 right-0 bg-background rounded-t-3xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-6" />
            <h2 className="text-lg font-semibold mb-4">Send Photo</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleSendImage("camera")}
                className="flex flex-col items-center gap-3 p-6 bg-muted rounded-2xl"
              >
                <Camera className="w-8 h-8 text-snoonu-red" />
                <span className="font-medium">Take Photo</span>
              </button>
              <button
                onClick={() => handleSendImage("gallery")}
                className="flex flex-col items-center gap-3 p-6 bg-muted rounded-2xl"
              >
                <ImageIconLucide className="w-8 h-8 text-snoonu-red" />
                <span className="font-medium">Choose from Gallery</span>
              </button>
            </div>
            <button
              onClick={() => setShowAttachmentSheet(false)}
              className="w-full mt-4 py-3 text-muted-foreground font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
