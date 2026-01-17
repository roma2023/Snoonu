"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useApp } from "@/lib/app-context"
import { stories, friends, restaurants } from "@/lib/data"
import { X, ChevronLeft, ChevronRight, Star, Clock, Send, Share2, BadgeCheck } from "lucide-react"

export function StoriesViewer() {
  const { state, updateState } = useApp()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [replyText, setReplyText] = useState("")
  const [isPaused, setIsPaused] = useState(false)

  const isViewingOwnStories = state.currentStoryUserId === "me"
  const userStories = isViewingOwnStories
    ? state.userStories
    : state.currentStoryUserId
      ? stories.filter((s) => s.userId === state.currentStoryUserId)
      : stories

  const currentStory = userStories[currentIndex]

  const storyUser = isViewingOwnStories ? null : friends.find((f) => f.id === currentStory?.userId)

  const handleClose = useCallback(() => {
    updateState({
      showStoriesViewer: false,
      currentStoryUserId: null,
      currentStoryIndex: 0,
    })
  }, [updateState])

  // Determine the sequence of users with stories
  const allStoryUserIds = ["me", ...Array.from(new Set(stories.map((s) => s.userId)))]
  // Filter out "me" if no user stories
  const validStoryUserIds = allStoryUserIds.filter((id) => {
    if (id === "me") return state.userStories.length > 0
    return true
  })

  // Determine current user ID safely
  const currentUserId = state.currentStoryUserId || "me"

  const handleNextUser = () => {
    const currentUserIndex = validStoryUserIds.indexOf(currentUserId)
    if (currentUserIndex !== -1 && currentUserIndex < validStoryUserIds.length - 1) {
      // Go to next user
      const nextUserId = validStoryUserIds[currentUserIndex + 1]
      updateState({
        currentStoryUserId: nextUserId,
        currentStoryIndex: 0,
      })
      setCurrentIndex(0)
      setProgress(0)
    } else {
      // No more users, close
      handleClose()
    }
  }

  useEffect(() => {
    if (state.showShareSheet) {
      setIsPaused(true)
    } else {
      setIsPaused(false)
    }
  }, [state.showShareSheet])

  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIndex < userStories.length - 1) {
            setCurrentIndex((prev) => prev + 1)
            return 0
          } else {
            handleNextUser()
            return prev
          }
        }
        return prev + 2
      })
    }, 100)

    return () => clearInterval(interval)
  }, [currentIndex, userStories.length, isPaused, handleNextUser])

  useEffect(() => {
    setProgress(0)
  }, [currentIndex])



  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    } else {
      // Ideally go to previous user? For now just stay start or close?
      // User request only mentioned "proceed to next story". 
      // We'll keep default behavior (do nothing or close) for start of list, 
      // or we could implement previous user logic too. 
      // Let's sticking to standard behavior: start of story = nothing or close. 
      // Instagram goes to previous user. 
      // Implementation:
      const currentUserIndex = validStoryUserIds.indexOf(currentUserId)
      if (currentUserIndex > 0) {
         const prevUserId = validStoryUserIds[currentUserIndex - 1]
         // We should technically go to the LAST story of the previous user. 
         // But finding that is complex without querying that user's stories length. 
         // For simplicity, let's go to start of previous user.
         updateState({
            currentStoryUserId: prevUserId,
            currentStoryIndex: 0, 
          })
          setCurrentIndex(0)
          setProgress(0)
      }
    }
  }

  const handleNext = () => {
    if (currentIndex < userStories.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      handleNextUser()
    }
  }

  const handleTap = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const width = rect.width

    if (x < width / 3) {
      handlePrevious()
    } else if (x > (width * 2) / 3) {
      handleNext()
    }
  }

  const handleOrder = () => {
    const restaurant = restaurants.find((r) => r.id === currentStory.content.restaurantId)
    if (restaurant) {
      const cartItem = {
        id: "story-item-1",
        name: currentStory.content.restaurantName + " Special",
        description: currentStory.content.note,
        price: 28,
        quantity: 1,
        image: currentStory.content.restaurantImage,
      }

      updateState({
        showStoriesViewer: false,
        showCartSheet: true,
        cartItems: [cartItem],
        cartRestaurantName: restaurant.name,
        selectedRestaurant: restaurant,
        referrer: isViewingOwnStories ? null : currentStory.userName,
      })
    }
  }

  const handleShare = () => {
    const restaurant = restaurants.find((r) => r.id === currentStory.content.restaurantId)
    if (restaurant) {
      updateState({
        selectedRestaurant: restaurant,
        showShareSheet: true,
      })
    }
  }

  const handleReply = () => {
    if (replyText.trim() && !isViewingOwnStories) {
      const user = friends.find((f) => f.id === currentStory.userId)
      if (user) {
        updateState({
          showStoriesViewer: false,
          activeTab: "chat",
          selectedUser: user,
        })
      }
      setReplyText("")
    }
  }

  if (!currentStory) return null

  const getDisplayName = () => {
    if (isViewingOwnStories) return "You"
    if (storyUser?.isVerified && storyUser.verificationBadge === "blue") {
      if (storyUser.name.startsWith("Dr.")) return storyUser.name
      return `Dr. ${currentStory.userName}`
    }
    return currentStory.userName
  }

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Progress bars */}
      <div className="absolute top-4 left-4 right-4 z-10 flex gap-1">
        {userStories.map((_, index) => (
          <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-100"
              style={{
                width: index < currentIndex ? "100%" : index === currentIndex ? `${progress}%` : "0%",
              }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-10 left-4 right-4 z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-snoonu-red to-amber-500 p-0.5">
            <div className="w-full h-full rounded-full bg-zinc-800 flex items-center justify-center">
              <span className="text-white font-semibold">
                {isViewingOwnStories ? "Y" : currentStory.userName.charAt(0)}
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <p className="text-white font-semibold">{getDisplayName()}</p>
              {storyUser?.isVerified && (
                <BadgeCheck
                  className={`w-4 h-4 ${storyUser.verificationBadge === "blue" ? "text-blue-400" : "text-snoonu-red"}`}
                  fill={storyUser.verificationBadge === "blue" ? "#60a5fa" : "#E31837"}
                  stroke="white"
                />
              )}
            </div>
            {storyUser?.verificationTitle ? (
              <p className="text-white/80 text-xs">{storyUser.verificationTitle}</p>
            ) : (
              <p className="text-white/60 text-xs">{isViewingOwnStories ? "Your story" : "2h ago"}</p>
            )}
          </div>
        </div>
        <button onClick={handleClose} className="p-2">
          <X className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Story content - tap areas */}
      <div className="absolute inset-0 flex" onClick={handleTap}>
        <div className="w-1/3 h-full flex items-center justify-start pl-2">
          {currentIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                handlePrevious()
              }}
              className="p-2 bg-white/20 rounded-full"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
          )}
        </div>
        <div className="w-1/3 h-full" />
        <div className="w-1/3 h-full flex items-center justify-end pr-2">
          {currentIndex < userStories.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleNext()
              }}
              className="p-2 bg-white/20 rounded-full"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          )}
        </div>
      </div>

      {/* Story Content Card */}
      <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 z-10">
        <div className="relative rounded-3xl overflow-hidden">
          <img
            src={currentStory.content.restaurantImage || "/placeholder.svg"}
            alt={currentStory.content.restaurantName}
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-white text-xl font-bold mb-1">{currentStory.content.restaurantName}</h3>
            <div className="flex items-center gap-3 text-white/80 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>{currentStory.content.restaurantRating}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{currentStory.content.deliveryTime}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-white/10 backdrop-blur rounded-2xl p-4">
          <p className="text-white text-center">"{currentStory.content.note}"</p>
        </div>

        <div className="mt-4 flex gap-3">
          <button onClick={handleOrder} className="flex-1 bg-snoonu-red text-white py-4 rounded-full font-semibold">
            Order Now
          </button>
          <button onClick={handleShare} className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
            <Share2 className="w-5 h-5 text-white" />
          </button>
        </div>

        {!isViewingOwnStories && (
          <div className="mt-3 bg-white/10 backdrop-blur rounded-full px-4 py-2 flex items-center justify-center gap-2">
            <div className="w-5 h-5 rounded-full bg-snoonu-gold flex items-center justify-center">
              <span className="text-white text-xs font-bold">S</span>
            </div>
            <p className="text-xs text-white/90">Earn SnooCoins when you order — {getDisplayName()} earns too!</p>
          </div>
        )}
      </div>

      {/* Reply input - only show for others' stories */}
      {!isViewingOwnStories && (
        <div className="absolute bottom-6 left-4 right-4 z-10">
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-full px-4 py-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Send message..."
              className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/50"
            />
            <button
              onClick={handleReply}
              className={`p-2 rounded-full ${replyText.trim() ? "bg-snoonu-red" : "bg-white/20"}`}
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
