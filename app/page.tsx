"use client"

import { useState } from "react"
import { BottomNav } from "@/components/bottom-nav"
import { SnooCircleTab } from "@/components/tabs/snoocircle-tab"
import { ProfileTab } from "@/components/tabs/profile-tab"
import { RestaurantPage } from "@/components/pages/restaurant-page"
import { WalletPage } from "@/components/pages/wallet-page"
import { MyCirclePage } from "@/components/pages/my-circle-page"
import { UserProfilePage } from "@/components/pages/user-profile-page"
import { ChatThreadPage } from "@/components/pages/chat-thread-page"
import { ShareSheet } from "@/components/share-sheet"
import { RewardModal } from "@/components/reward-modal"
import { DeepLinkBanner } from "@/components/deep-link-banner"
import { StoriesViewer } from "@/components/stories-viewer"
import { CartSheet } from "@/components/cart-sheet"
import { CreateSheet } from "@/components/create-sheet"
import { CreatePostSheet } from "@/components/create-post-sheet"
import { CreateStorySheet } from "@/components/create-story-sheet"
import { AppContext, type AppState, type Restaurant, type Recommendation, type Story } from "@/lib/app-context"
import { getInitialChats } from "@/lib/data"

export default function Home() {
  const [state, setState] = useState<AppState>({
    activeTab: "snoocircle",
    snooCircleActiveTab: "feed",
    currentPage: null,
    showShareSheet: false,
    showRewardModal: false,
    showDeepLinkBanner: false,
    showStoriesViewer: false,
    showCartSheet: false,
    showCreateSheet: false,
    showCreatePostSheet: false,
    showCreateStorySheet: false,
    currentStoryIndex: 0,
    currentStoryUserId: null,
    selectedRestaurant: null,
    selectedUser: null,
    selectedChat: null,
    referrer: null,
    coinBalance: 5700,
    pendingCoins: 0,
    cartItems: [],
    cartRestaurantName: "",
    chats: getInitialChats(),
    userPosts: [],
    userStories: [],
  })

  const updateState = (updates: Partial<AppState>) => {
    setState((prev) => ({ ...prev, ...updates }))
  }

  const sendSharedPostToChat = (chatId: string, restaurant: Restaurant) => {
    const now = new Date()
    const timestamp = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })

    const newMessage = {
      id: `shared-${Date.now()}`,
      senderId: "me",
      content: "",
      timestamp,
      type: "shared_post" as const,
      sharedPost: {
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        restaurantImage: restaurant.image,
      },
    }

    setState((prev) => {
      const updatedChats = prev.chats.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: [...chat.messages, newMessage],
            lastMessage: `Shared ${restaurant.name}`,
            lastMessageTime: "Just now",
          }
        }
        return chat
      })

      const updatedChat = updatedChats.find((c) => c.id === chatId)

      return {
        ...prev,
        chats: updatedChats,
        selectedChat: updatedChat || prev.selectedChat,
      }
    })
  }

  const sendMessageToChat = (chatId: string, content: string, type: "text" | "image" = "text", imageUrl?: string) => {
    const now = new Date()
    const timestamp = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })

    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: "me",
      content,
      timestamp,
      type,
      imageUrl,
    }

    setState((prev) => {
      const updatedChats = prev.chats.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: [...chat.messages, newMessage],
            lastMessage: type === "image" ? "Sent a photo" : content,
            lastMessageTime: "Just now",
          }
        }
        return chat
      })

      const updatedChat = updatedChats.find((c) => c.id === chatId)

      return {
        ...prev,
        chats: updatedChats,
        selectedChat: updatedChat || prev.selectedChat,
      }
    })
  }

  const addUserPost = (post: Recommendation) => {
    setState((prev) => ({
      ...prev,
      userPosts: [post, ...prev.userPosts],
    }))
  }

  const addUserStory = (story: Story) => {
    setState((prev) => ({
      ...prev,
      userStories: [story, ...prev.userStories],
    }))
  }

  const handleCartClose = () => {
    updateState({ showCartSheet: false })
  }

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      updateState({
        cartItems: state.cartItems.filter((item) => item.id !== itemId),
      })
    } else {
      updateState({
        cartItems: state.cartItems.map((item) => (item.id === itemId ? { ...item, quantity } : item)),
      })
    }
  }

  const handleCheckout = () => {
    const subtotal = state.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const total = subtotal + 10
    const snooCircleReward = state.referrer ? Math.round(total * 0.01 * 100) : 0

    updateState({
      showCartSheet: false,
      showRewardModal: true,
      coinBalance: state.coinBalance + snooCircleReward,
      pendingCoins: state.pendingCoins + snooCircleReward,
      cartItems: [],
    })
  }

  const renderContent = () => {
    if (state.currentPage === "restaurant" && state.selectedRestaurant) {
      return <RestaurantPage />
    }
    if (state.currentPage === "wallet") {
      return <WalletPage />
    }
    if (state.currentPage === "my-circle") {
      return <MyCirclePage />
    }
    if (state.currentPage === "user-profile" && state.selectedUser) {
      return <UserProfilePage />
    }
    if (state.currentPage === "chat-thread" && state.selectedChat) {
      return <ChatThreadPage />
    }

    switch (state.activeTab) {
      case "snoocircle":
        return <SnooCircleTab />
      case "profile":
        return <ProfileTab />
      default:
        return <SnooCircleTab />
    }
  }

  return (
    <AppContext.Provider
      value={{ state, updateState, sendSharedPostToChat, sendMessageToChat, addUserPost, addUserStory }}
    >
      <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto relative">
        {state.showDeepLinkBanner && <DeepLinkBanner />}

        <main className="flex-1 overflow-y-auto pb-20">{renderContent()}</main>

        <BottomNav />

        {state.showShareSheet && <ShareSheet />}

        {state.showRewardModal && <RewardModal />}

        {state.showStoriesViewer && <StoriesViewer />}

        {state.showCartSheet && state.cartItems.length > 0 && (
          <CartSheet
            onClose={handleCartClose}
            items={state.cartItems}
            restaurantName={state.cartRestaurantName}
            onUpdateQuantity={handleUpdateQuantity}
            onCheckout={handleCheckout}
            referrer={state.referrer}
          />
        )}

        <CreateSheet />
        <CreatePostSheet />
        <CreateStorySheet />
      </div>
    </AppContext.Provider>
  )
}
