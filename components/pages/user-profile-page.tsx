"use client"

import { useState } from "react"
import { useApp } from "@/lib/app-context"
import { recommendations } from "@/lib/data"
import { ChevronLeft, MoreHorizontal, MessageCircle, Grid3X3, Bookmark, BadgeCheck } from "lucide-react"

export function UserProfilePage() {
  const { state, updateState } = useApp()
  const [isFollowing, setIsFollowing] = useState(state.selectedUser?.isFollowing || false)
  const [activeTab, setActiveTab] = useState<"posts" | "saved">("posts")

  if (!state.selectedUser) return null

  const user = state.selectedUser

  const handleBack = () => {
    updateState({ currentPage: null, selectedUser: null })
  }

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
  }

  const handleMessage = () => {
    updateState({
      activeTab: "chat",
      currentPage: null,
    })
  }

  // Get user's posts (recommendations)
  const userPosts = recommendations.filter((r) => r.recommenderId === user.id)

  const getDisplayName = () => {
    if (user.isVerified && user.verificationBadge === "blue" && !user.name.startsWith("Dr.")) {
      return `Dr. ${user.name}`
    }
    return user.name
  }

  const getVerificationSubtitle = () => {
    if (user.verificationTitle) return user.verificationTitle
    if (user.isVerified) {
      return user.verificationBadge === "blue" ? "Verified Dietitian" : "Verified Creator"
    }
    return null
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-2 py-3 border-b border-border">
        <button onClick={handleBack} className="p-2">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-1">
          <h1 className="font-semibold">{user.username}</h1>
          {user.isVerified && (
            <BadgeCheck
              className={`w-5 h-5 ${user.verificationBadge === "blue" ? "text-blue-500" : "text-snoonu-red"}`}
              fill={user.verificationBadge === "blue" ? "#3b82f6" : "#E31837"}
              stroke="white"
            />
          )}
        </div>
        <button className="p-2">
          <MoreHorizontal className="w-6 h-6" />
        </button>
      </div>

      {/* Profile Header */}
      <div className="px-4 py-6">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-snoonu-red to-amber-500 p-0.5">
              <div className="w-full h-full rounded-full bg-muted flex items-center justify-center">
                <span className="text-2xl font-bold">{user.name.charAt(0)}</span>
              </div>
            </div>
            {user.isVerified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-background flex items-center justify-center">
                <BadgeCheck
                  className={`w-5 h-5 ${user.verificationBadge === "blue" ? "text-blue-500" : "text-snoonu-red"}`}
                  fill={user.verificationBadge === "blue" ? "#3b82f6" : "#E31837"}
                  stroke="white"
                />
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex-1 flex justify-around">
            <div className="text-center">
              <p className="font-bold text-lg">{user.posts}</p>
              <p className="text-xs text-muted-foreground">Posts</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-lg">
                {user.followers >= 1000 ? `${(user.followers / 1000).toFixed(1)}k` : user.followers}
              </p>
              <p className="text-xs text-muted-foreground">Followers</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-lg">{user.following}</p>
              <p className="text-xs text-muted-foreground">Following</p>
            </div>
          </div>
        </div>

        {/* Name & Bio */}
        <div className="mt-4">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-bold">{getDisplayName()}</h2>
            {user.isVerified && (
              <BadgeCheck
                className={`w-4 h-4 ${user.verificationBadge === "blue" ? "text-blue-500" : "text-snoonu-red"}`}
                fill={user.verificationBadge === "blue" ? "#3b82f6" : "#E31837"}
                stroke="white"
              />
            )}
          </div>
          {getVerificationSubtitle() && (
            <p
              className={`text-xs mt-0.5 ${user.verificationBadge === "blue" ? "text-blue-600" : "text-snoonu-red"} font-medium`}
            >
              {getVerificationSubtitle()}
            </p>
          )}
          {user.bio && <p className="text-sm text-muted-foreground mt-1">{user.bio}</p>}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={handleFollow}
            className={`flex-1 py-2.5 rounded-xl font-semibold ${
              isFollowing ? "bg-muted text-foreground" : "bg-snoonu-red text-white"
            }`}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
          <button
            onClick={handleMessage}
            className="flex-1 py-2.5 rounded-xl font-semibold bg-muted flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Message
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-t border-border">
        <button
          onClick={() => setActiveTab("posts")}
          className={`flex-1 py-3 flex items-center justify-center gap-2 border-b-2 ${
            activeTab === "posts" ? "border-foreground" : "border-transparent"
          }`}
        >
          <Grid3X3 className={`w-5 h-5 ${activeTab === "posts" ? "text-foreground" : "text-muted-foreground"}`} />
        </button>
        <button
          onClick={() => setActiveTab("saved")}
          className={`flex-1 py-3 flex items-center justify-center gap-2 border-b-2 ${
            activeTab === "saved" ? "border-foreground" : "border-transparent"
          }`}
        >
          <Bookmark className={`w-5 h-5 ${activeTab === "saved" ? "text-foreground" : "text-muted-foreground"}`} />
        </button>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-3 gap-0.5 flex-1">
        {(activeTab === "posts" ? userPosts : userPosts.slice(0, 3)).map((post, index) => (
          <button
            key={post.id || index}
            onClick={() =>
              updateState({
                currentPage: "restaurant",
                selectedRestaurant: post,
              })
            }
            className="aspect-square relative"
          >
            <img src={post.image || "/placeholder.svg"} alt={post.name} className="w-full h-full object-cover" />
          </button>
        ))}
        {/* Fill empty spots with placeholders */}
        {Array.from({ length: Math.max(0, 9 - userPosts.length) }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square bg-muted" />
        ))}
      </div>
    </div>
  )
}
