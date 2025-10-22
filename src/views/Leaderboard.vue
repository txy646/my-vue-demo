<template>
  <div class="leaderboard-view">
    <NavigationBar />
    
    <div class="container">
      <div class="leaderboard-header">
        <h1>🏆 寻宝之旅排行榜</h1>
        <p>看看谁是最厉害的宝藏猎人！</p>
      </div>

      <div class="leaderboard-content">
        <!-- 排行榜顶部 -->
        <div class="leaderboard-top">
          <div 
            v-for="player in topThreePlayers" 
            :key="player.rank"
            class="top-player"
            :class="getTopPlayerClass(player.rank)"
          >
            <div class="rank-medal">{{ getRankMedal(player.rank) }}</div>
            <div class="player-avatar">
              {{ player.username[0].toUpperCase() }}
            </div>
            <div class="player-info">
              <h3 class="player-name">{{ player.username }}</h3>
              <div class="player-stats">
                <span class="score">⭐ {{ player.score }}</span>
                <span class="gold">💰 {{ player.totalGold }}</span>
              </div>
            </div>
            <div class="player-rank">{{ player.rank }}</div>
          </div>
        </div>

        <!-- 排行榜列表 -->
        <div class="leaderboard-list">
          <div class="list-header">
            <div class="header-rank">排名</div>
            <div class="header-player">玩家</div>
            <div class="header-score">得分</div>
            <div class="header-gold">金币</div>
            <div class="header-games">完成次数</div>
          </div>

          <div 
            v-for="player in remainingPlayers" 
            :key="player.rank"
            class="leaderboard-item"
            :class="{ 'current-user': isCurrentUser(player.username) }"
          >
            <div class="item-rank">
              <span class="rank-number">{{ player.rank }}</span>
            </div>
            <div class="item-player">
              <div class="player-avatar-small">
                {{ player.username[0].toUpperCase() }}
              </div>
              <span class="player-name">{{ player.username }}</span>
              <span v-if="isCurrentUser(player.username)" class="you-badge">你</span>
            </div>
            <div class="item-score">{{ player.score }}</div>
            <div class="item-gold">{{ player.totalGold }}</div>
            <div class="item-games">{{ player.completedGames }}</div>
          </div>

          <div v-if="leaderboardStore.leaderboardData.length === 0" class="empty-leaderboard">
            <div class="empty-icon">📊</div>
            <h3>暂无排行榜数据</h3>
            <p>成为第一个完成寻宝之旅的玩家！</p>
            <GameButton @click="router.push('/game')" variant="primary">
              🎮 开始游戏
            </GameButton>
          </div>
        </div>

        <!-- 当前用户排名 -->
        <div v-if="userStore.isLoggedIn && currentUserRank" class="current-user-rank">
          <div class="user-rank-card">
            <div class="rank-info">
              <span class="rank-label">你的排名</span>
              <span class="rank-value">#{{ currentUserRank.rank }}</span>
            </div>
            <div class="user-info">
              <UserAvatar size="small" :show-name="true" />
              <div class="user-stats">
                <span>得分: {{ currentUserRank.score }}</span>
                <span>金币: {{ currentUserRank.totalGold }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 统计信息 -->
        <div class="leaderboard-stats">
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-icon">👥</div>
              <div class="stat-info">
                <div class="stat-value">{{ totalPlayers }}</div>
                <div class="stat-label">总玩家数</div>
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-icon">🎮</div>
              <div class="stat-info">
                <div class="stat-value">{{ totalGames }}</div>
                <div class="stat-label">总游戏次数</div>
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-icon">💰</div>
              <div class="stat-info">
                <div class="stat-value">{{ totalGold }}</div>
                <div class="stat-label">总金币数</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useLeaderboardStore } from '@/stores/leaderboardStore'
import NavigationBar from '@/components/layout/NavigationBar.vue'
import UserAvatar from '@/components/layout/UserAvatar.vue'
import GameButton from '@/components/common/GameButton.vue'

const userStore = useUserStore()
const leaderboardStore = useLeaderboardStore()
const router = useRouter()

// 计算属性
const topThreePlayers = computed(() => {
  return (leaderboardStore.leaderboardData || []).slice(0, 3)
})

const remainingPlayers = computed(() => {
  return (leaderboardStore.leaderboardData || []).slice(3)
})

const currentUserRank = computed(() => {
  if (!userStore.currentUser) return null
  return (leaderboardStore.leaderboardData || []).find(
    player => player.username === userStore.currentUser.username
  )
})

const totalPlayers = computed(() => {
  return userStore.users.filter(user => user.gameStats.completedGames > 0).length
})

const totalGames = computed(() => {
  return userStore.users.reduce((total, user) => total + user.gameStats.totalGames, 0)
})

const totalGold = computed(() => {
  return userStore.users.reduce((total, user) => total + user.gameStats.totalGold, 0)
})

// 方法
const getTopPlayerClass = (rank) => {
  return `rank-${rank}`
}

const getRankMedal = (rank) => {
  const medals = { 1: '🥇', 2: '🥈', 3: '🥉' }
  return medals[rank] || rank
}

const isCurrentUser = (username) => {
  return userStore.currentUser && userStore.currentUser.username === username
}
</script>

<style scoped>
.leaderboard-view {
  background: linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d);
  min-height: 100vh;
  color: #fff;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.leaderboard-header {
  text-align: center;
  margin-bottom: 40px;
}

.leaderboard-header h1 {
  color: #ffd700;
  font-size: 2.5rem;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.leaderboard-header p {
  color: #ccc;
  font-size: 1.1rem;
  margin: 0;
}

/* 顶部三名玩家 */
.leaderboard-top {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  margin-bottom: 40px;
}

.top-player {
  background: rgba(0, 0, 0, 0.7);
  border-radius: 15px;
  padding: 30px 20px;
  text-align: center;
  position: relative;
  border: 3px solid transparent;
  transition: transform 0.3s ease;
}

.top-player:hover {
  transform: translateY(-5px);
}

.top-player.rank-1 {
  border-color: #ffd700;
  order: 2;
  transform: scale(1.05);
}

.top-player.rank-2 {
  border-color: #c0c0c0;
  order: 1;
}

.top-player.rank-3 {
  border-color: #cd7f32;
  order: 3;
}

.rank-medal {
  font-size: 3rem;
  margin-bottom: 10px;
}

.player-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  color: white;
  margin: 0 auto 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.player-info h3 {
  margin: 0 0 10px 0;
  color: #ffd700;
  font-size: 1.3rem;
}

.player-stats {
  display: flex;
  justify-content: center;
  gap: 15px;
  font-size: 0.9rem;
}

.score {
  color: #ffd700;
}

.gold {
  color: #ffd700;
}

.player-rank {
  position: absolute;
  top: 10px;
  right: 15px;
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
}

/* 排行榜列表 */
.leaderboard-list {
  background: rgba(0, 0, 0, 0.7);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 30px;
  border: 2px solid #ffd700;
}

.list-header {
  display: grid;
  grid-template-columns: 80px 1fr 100px 100px 100px;
  gap: 15px;
  padding: 15px 20px;
  background: rgba(255, 215, 0, 0.1);
  border-radius: 10px;
  margin-bottom: 10px;
  font-weight: bold;
  color: #ffd700;
}

.leaderboard-item {
  display: grid;
  grid-template-columns: 80px 1fr 100px 100px 100px;
  gap: 15px;
  padding: 15px 20px;
  border-radius: 10px;
  margin-bottom: 8px;
  transition: background-color 0.3s ease;
  align-items: center;
}

.leaderboard-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.leaderboard-item.current-user {
  background: rgba(255, 215, 0, 0.2);
  border: 1px solid #ffd700;
}

.item-rank {
  text-align: center;
}

.rank-number {
  background: rgba(255, 255, 255, 0.1);
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: bold;
  display: inline-block;
  min-width: 40px;
}

.item-player {
  display: flex;
  align-items: center;
  gap: 12px;
}

.player-avatar-small {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
  font-size: 0.9rem;
}

.you-badge {
  background: #ffd700;
  color: #000;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: bold;
}

.item-score,
.item-gold,
.item-games {
  text-align: center;
  font-weight: 500;
}

.item-score {
  color: #ffd700;
}

.item-gold {
  color: #ffd700;
}

/* 空状态 */
.empty-leaderboard {
  text-align: center;
  padding: 60px 20px;
  color: #888;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.empty-leaderboard h3 {
  color: #ccc;
  margin-bottom: 10px;
}

.empty-leaderboard p {
  margin-bottom: 25px;
}

/* 当前用户排名 */
.current-user-rank {
  margin-bottom: 30px;
}

.user-rank-card {
  background: rgba(255, 215, 0, 0.2);
  border: 2px solid #ffd700;
  border-radius: 15px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.rank-info {
  text-align: center;
}

.rank-label {
  display: block;
  color: #ccc;
  font-size: 0.9rem;
  margin-bottom: 5px;
}

.rank-value {
  display: block;
  color: #ffd700;
  font-size: 2rem;
  font-weight: bold;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-stats {
  display: flex;
  gap: 15px;
  font-size: 0.9rem;
}

.user-stats span {
  background: rgba(255, 255, 255, 0.1);
  padding: 6px 12px;
  border-radius: 8px;
}

/* 统计信息 */
.leaderboard-stats {
  background: rgba(0, 0, 0, 0.7);
  border-radius: 15px;
  padding: 25px;
  border: 2px solid #444;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.stat-icon {
  font-size: 2.5rem;
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

/* 响应式设计 */
@media (max-width: 768px) {
  .leaderboard-top {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .top-player.rank-1 {
    transform: none;
    order: 1;
  }
  
  .list-header,
  .leaderboard-item {
    grid-template-columns: 60px 1fr 80px 80px;
  }
  
  .header-games,
  .item-games {
    display: none;
  }
  
  .user-rank-card {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .user-info {
    flex-direction: column;
    gap: 10px;
  }
  
  .user-stats {
    justify-content: center;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .list-header,
  .leaderboard-item {
    grid-template-columns: 50px 1fr 70px;
    gap: 10px;
    padding: 12px 15px;
  }
  
  .header-gold,
  .item-gold {
    display: none;
  }
  
  .player-avatar-small {
    width: 30px;
    height: 30px;
    font-size: 0.8rem;
  }
  
  .item-player {
    gap: 8px;
  }
}
</style>