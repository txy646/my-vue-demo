<template>
  <div class="player-stats">
    <h3>冒险者状态</h3>
    
    <div class="stat">
      <span>生命值:</span>
      <span>{{ player.health }}/100</span>
    </div>
    <div class="stat-bar">
      <div class="stat-fill health-fill" :style="{ width: player.health + '%' }"></div>
    </div>
    
    <div class="stat">
      <span>能量:</span>
      <span>{{ player.energy }}/100</span>
    </div>
    <div class="stat-bar">
      <div class="stat-fill energy-fill" :style="{ width: player.energy + '%' }"></div>
    </div>
    
    <div class="stat">
      <span>幸运值:</span>
      <span>{{ player.luck }}/100</span>
    </div>
    <div class="stat-bar">
      <div class="stat-fill luck-fill" :style="{ width: player.luck + '%' }"></div>
    </div>
    
    <div class="stat">
      <span>金币:</span>
      <span class="gold-value">{{ player.gold }}</span>
    </div>
    
    <div class="stat">
      <span>道具:</span>
      <span class="items-value">{{ itemsText }}</span>
    </div>

    <div v-if="userStore.currentUser" class="user-info">
      <div class="user-stat">
        <span>玩家:</span>
        <span class="username">{{ userStore.currentUser.username }}</span>
      </div>
      <div class="user-stat">
        <span>完成关卡:</span>
        <span>{{ userStore.currentUser.gameStats.completedGames }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { useUserStore } from '@/stores/userStore'

const gameStore = useGameStore()
const userStore = useUserStore()

const player = computed(() => gameStore.player)

const itemsText = computed(() => {
  return player.value.items.length > 0 ? player.value.items.join(', ') : '无'
})
</script>

<style scoped>
.player-stats {
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 15px;
}

.player-stats h3 {
  color: #ffd700;
  margin-bottom: 15px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 8px;
}

.stat {
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-bar {
  height: 10px;
  background: #333;
  border-radius: 5px;
  margin-top: 5px;
  margin-bottom: 12px;
  overflow: hidden;
}

.stat-fill {
  height: 100%;
  border-radius: 5px;
  transition: width 0.5s;
}

.health-fill {
  background: linear-gradient(90deg, #ff0000, #ff6b6b);
}

.energy-fill {
  background: linear-gradient(90deg, #00ff00, #90EE90);
}

.luck-fill {
  background: linear-gradient(90deg, #ffd700, #ffed4e);
}

.gold-value {
  color: #ffd700;
  font-weight: bold;
}

.items-value {
  color: #87CEEB;
  font-size: 0.9rem;
  max-width: 120px;
  text-align: right;
}

.user-info {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.user-stat {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.username {
  color: #ffd700;
  font-weight: bold;
}
</style>