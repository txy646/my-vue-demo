import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useUserStore } from './userStore'

export const useLeaderboardStore = defineStore('leaderboard', () => {
  const userStore = useUserStore()
  
  const leaderboardData = computed(() => userStore?.leaderboard || [])
  
  const getTopPlayers = (count = 10) => {
  return (leaderboardData.value || []).slice(0, count)
  }
  
  const getUserRank = (username) => {
  const index = (leaderboardData.value || []).findIndex(player => player.username === username)
    return index !== -1 ? index + 1 : null
  }

  return {
    leaderboardData,
    getTopPlayers,
    getUserRank
  }
})