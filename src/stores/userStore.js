import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const currentUser = ref(null)
  const users = ref(JSON.parse(localStorage.getItem('treasureUsers')) || [])
  const isLoggedIn = ref(false)

  // 注册用户
  const register = (userData) => {
    const user = {
      id: Date.now().toString(),
      username: userData.username,
      password: userData.password,
      email: userData.email,
      createdAt: new Date().toISOString(),
      gameStats: {
        totalGames: 0,
        completedGames: 0,
        totalGold: 0,
        bestTime: null,
        bestScore: 0
      }
    }
    users.value.push(user)
    saveToStorage()
    return user
  }

  // 用户登录
  const login = (credentials) => {
    const user = users.value.find(u => 
      u.username === credentials.username && 
      u.password === credentials.password
    )
    if (user) {
      currentUser.value = user
      isLoggedIn.value = true
      return true
    }
    return false
  }

  // 用户登出
  const logout = () => {
    currentUser.value = null
    isLoggedIn.value = false
  }

  // 更新游戏统计
  const updateGameStats = (gameResult) => {
    if (currentUser.value) {
      const stats = currentUser.value.gameStats
      stats.totalGames += 1
      
      if (gameResult.completed) {
        stats.completedGames += 1
        stats.totalGold += gameResult.gold
        stats.bestScore = Math.max(stats.bestScore, gameResult.score)
        
        if (!stats.bestTime || gameResult.time < stats.bestTime) {
          stats.bestTime = gameResult.time
        }
      }
      
      saveToStorage()
    }
  }

  // 保存到本地存储
  const saveToStorage = () => {
    localStorage.setItem('treasureUsers', JSON.stringify(users.value))
  }

  // 计算属性 - 排行榜
  const leaderboard = computed(() => {
    return users.value
      .filter(user => user.gameStats.completedGames > 0)
      .sort((a, b) => b.gameStats.bestScore - a.gameStats.bestScore)
      .slice(0, 10)
      .map((user, index) => ({
        rank: index + 1,
        username: user.username,
        score: user.gameStats.bestScore,
        completedGames: user.gameStats.completedGames,
        totalGold: user.gameStats.totalGold
      }))
  })

  return {
    currentUser,
    users,
    isLoggedIn,
    register,
    login,
    logout,
    updateGameStats,
    leaderboard
  }
})