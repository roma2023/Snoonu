"use client"

import { createContext, useContext } from "react"

export interface Restaurant {
  id: string
  name: string
  image: string
  rating: number
  deliveryTime: string
  distance: string
  priceLevel: string
  categories: string[]
  isLocal?: boolean
  recommendedBy?: string[]
}

export interface User {
  id: string
  name: string
  username: string
  avatar?: string
  bio?: string
  isVerified?: boolean
  verificationBadge?: "blue" | "red"
  verificationTitle?: string
  posts: number
  followers: number
  following: number
  isFollowing?: boolean
  recommendations: number
  mutualFriends: number
}

export interface Story {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  isNew: boolean
  content: {
    type: "recommendation"
    restaurantId: string
    restaurantName: string
    restaurantImage: string
    restaurantRating: number
    deliveryTime: string
    note: string
  }
}

export interface ChatMessage {
  id: string
  senderId: string
  content: string
  timestamp: string
  type: "text" | "shared_post" | "image"
  sharedPost?: {
    restaurantId: string
    restaurantName: string
    restaurantImage: string
  }
  imageUrl?: string
}

export interface Chat {
  id: string
  participants: User[]
  isGroup: boolean
  groupName?: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  messages: ChatMessage[]
}

export interface Recommendation {
  id: string
  name: string
  image: string
  rating: number
  deliveryTime: string
  distance: string
  priceLevel: string
  categories: string[]
  isLocal?: boolean
  recommendedBy?: string[]
  note: string
  recommendedAt: string
  recommenderId: string
  tags?: string[]
}

export interface AppState {
  activeTab: "food" | "grocery" | "market" | "snoocircle" | "chat" | "profile"
  snooCircleActiveTab: "feed" | "chat" | "friends"
  currentPage: "restaurant" | "wallet" | "my-circle" | "user-profile" | "chat-thread" | null
  showShareSheet: boolean
  showRewardModal: boolean
  showDeepLinkBanner: boolean
  showStoriesViewer: boolean
  showCartSheet: boolean
  showCreateSheet: boolean
  showCreatePostSheet: boolean
  showCreateStorySheet: boolean
  currentStoryIndex: number
  currentStoryUserId: string | null
  selectedRestaurant: Restaurant | null
  selectedUser: User | null
  selectedChat: Chat | null
  referrer: string | null
  coinBalance: number
  pendingCoins: number
  cartItems: Array<{
    id: string
    name: string
    description: string
    price: number
    quantity: number
    image: string
  }>
  cartRestaurantName: string
  chats: Chat[]
  userPosts: Recommendation[]
  userStories: Story[]
}

interface AppContextType {
  state: AppState
  updateState: (updates: Partial<AppState>) => void
  sendSharedPostToChat: (chatId: string, restaurant: Restaurant) => void
  sendMessageToChat: (chatId: string, content: string, type?: "text" | "image", imageUrl?: string) => void
  addUserPost: (post: Recommendation) => void
  addUserStory: (story: Story) => void
}

export const AppContext = createContext<AppContextType | null>(null)

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within AppContext.Provider")
  }
  return context
}
