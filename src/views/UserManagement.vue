<template>
  <div class="user-management">
    <NavigationBar />
    
    <div class="container">
      <h1>👤 用户管理中心</h1>
      
      <div v-if="userStore.currentUser" class="user-content">
        <!-- 用户信息卡片 -->
        <div class="user-profile-card">
          <div class="profile-header">
            <UserAvatar size="large" :show-level="true" />
            <div class="profile-info">
              <h2>{{ userStore.currentUser.username }}</h2>
              <p class="user-email">{{ userStore.currentUser.email }}</p>
              <p class="join-date">加入时间: {{ formatDate(userStore.currentUser.createdAt) }}</p>
            </div>
          </div>
        </div>
        
        <!-- 游戏统计 -->
        <div class="stats-section">
          <h3>🎯 游戏统计</h3>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">🎮</div>
              <div class="stat-info">
                <div class="stat-value">{{ userStore.currentUser.gameStats.totalGames }}</div>
                <div class="stat-label">总游戏次数</div>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">🏆</div>
              <div class="stat-info">
                <div class="stat-value">{{ userStore.currentUser.gameStats.completedGames }}</div>
                <div class="stat-label">完成次数</div>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">💰</div>
              <div class="stat-info">
                <div class="stat-value">{{ userStore.currentUser.gameStats.totalGold }}</div>
                <div class="stat-label">总金币</div>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">⭐</div>
              <div class="stat-info">
                <div class="stat-value">{{ userStore.currentUser.gameStats.bestScore }}</div>
                <div class="stat-label">最佳得分</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 成就系统 -->
        <div class="achievements-section">
          <h3>🎖️ 成就</h3>
          <div class="achievements-grid">
            <div 
              v-for="achievement in achievements" 
              :key="achievement.id"
              class="achievement-card"
              :class="{ unlocked: achievement.unlocked }"
            >
              <div class="achievement-icon">{{ achievement.icon }}</div>
              <div class="achievement-info">
                <div class="achievement-name">{{ achievement.name }}</div>
                <div class="achievement-desc">{{ achievement.description }}</div>
              </div>
              <div v-if="achievement.unlocked" class="achievement-badge">已获得</div>
            </div>
          </div>
        </div>
        
        <!-- 操作按钮 -->
        <div class="actions-section">
          <GameButton @click="router.push('/game')" variant="primary">
            🎮 继续游戏
          </GameButton>
          
          <GameButton @click="router.push('/leaderboard')" variant="secondary">
            🏆 查看排行榜
          </GameButton>
          
          <GameButton @click="handleLogout" variant="danger">
            🚪 退出登录
          </GameButton>
        </div>
      </div>
      
      <div v-else class="not-logged-in">
        <h2>请先登录</h2>
        <p>登录后查看您的个人资料和游戏统计</p>
        <GameButton @click="router.push('/login')">
          🔑 立即登录
        </GameButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useGameStore } from '@/stores/gameStore'
import NavigationBar from '@/components/layout/NavigationBar.vue'
import UserAvatar from '@/components/layout/UserAvatar.vue'
import GameButton from '@/components/common/GameButton.vue'

const userStore = useUserStore()
const gameStore = useGameStore()
const router = useRouter()

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const achievements = computed(() => {
  if (!userStore.currentUser) return []
  
  const stats = userStore.currentUser.gameStats
  
  return [
    {
      id: 'first_game',
      name: '初出茅庐',
      description: '完成第一次游戏',
      icon: '🎯',
      unlocked: stats.totalGames > 0
    },
    {
      id: 'treasure_hunter',
      name: '宝藏猎人',
      description: '完成5次游戏',
      icon: '💰',
      unlocked: stats.completedGames >= 5
    },
    {
      id: 'wealthy',
      name: '富甲一方',
      description: '累计获得1000金币',
      icon: '🏦',
      unlocked: stats.totalGold >= 1000
    },
    {
      id: 'master',
      name: '寻宝大师',
      description: '最佳得分超过5000',
      icon: '👑',
      unlocked: stats.bestScore >= 5000
    }
  ]
})

const handleLogout = () => {
  userStore.logout()
  gameStore.resetGame()
  router.push('/')
}
</script>

<style scoped>
.user-management {
  background: linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d);
  min-height: 100vh;
  color: #fff;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #ffd700;
  margin-bottom: 30px;
  font-size: 2.5rem;
}

.user-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

/* 用户资料卡片 */
.user-profile-card {
  background: rgba(0, 0, 0, 0.7);
  border-radius: 15px;
  padding: 30px;
  border: 2px solid #ffd700;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
}

.profile-info h2 {
  color: #ffd700;
  margin: 0 0 8px 0;
  font-size: 1.8rem;
}

.user-email {
  color: #87CEEB;
  margin: 0 0 8px 0;
}

.join-date {
  color: #ccc;
  margin: 0;
  font-size: 0.9rem;
}

/* 统计部分 */
.stats-section h3,
.achievements-section h3 {
  color: #ffd700;
  margin-bottom: 20px;
  font-size: 1.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.15);
}

.stat-icon {
  font-size: 2rem;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: bold;
  color: #ffd700;
}

.stat-label {
  color: #ccc;
  font-size: 0.9rem;
}

/* 成就部分 */
.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 15px;
}

.achievement-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.achievement-card.unlocked {
  border-color: #ffd700;
  background: rgba(255, 215, 0, 0.1);
}

.achievement-card:not(.unlocked) {
  opacity: 0.6;
}

.achievement-icon {
  font-size: 2rem;
}

.achievement-info {
  flex: 1;
}

.achievement-name {
  font-weight: bold;
  color: #ffd700;
  margin-bottom: 4px;
}

.achievement-desc {
  color: #ccc;
  font-size: 0.9rem;
}

.achievement-badge {
  background: #ffd700;
  color: #000;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
}

/* 操作按钮 */
.actions-section {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
  padding-top: 20px;
  border-top: 1px solid #444;
}

/* 未登录状态 */
.not-logged-in {
  text-align: center;
  padding: 60px 20px;
}

.not-logged-in h2 {
  color: #ffd700;
  margin-bottom: 15px;
}

.not-logged-in p {
  color: #ccc;
  margin-bottom: 25px;
  font-size: 1.1rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .achievements-grid {
    grid-template-columns: 1fr;
  }
  
  .actions-section {
    flex-direction: column;
    align-items: center;
  }
  
  .actions-section .game-button {
    width: 100%;
    max-width: 250px;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .container {
    padding: 15px;
  }
}
</style>