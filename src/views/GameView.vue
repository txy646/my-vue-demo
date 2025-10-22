<template>
  <div class="game-view">
    <NavigationBar />
    
    <div class="container">
      <h1>互动式异步寻宝之旅</h1>
      
      <div class="game-area">
        <TreasureMap 
          @locationSelected="handleLocationSelected"
        />
        <PlayerStats />
      </div>
      
      <GameProgress @stepSelected="handleStepSelected" />
      
      <div class="interaction-area">
        <div v-if="!gameStore.isPlaying" class="welcome-message">
          <h2>欢迎来到寻宝之旅！</h2>
          <p>准备好开始你的冒险了吗？点击开始按钮启程！</p>
        </div>
        
        <div v-else-if="currentLocationModal" class="location-interaction">
          <LocationInteraction 
            :location="currentLocationModal"
            @complete="handleLocationComplete"
            @close="closeLocationModal"
          />
        </div>
        
        <div v-else class="game-guidance">
          <p>点击地图上的高亮地点开始当前关卡的冒险！</p>
        </div>
      </div>
      
      <LogDisplay />
      
      <div class="controls">
        <GameButton 
          @click="startGame" 
          :disabled="gameStore.isPlaying || !userStore.isLoggedIn"
        >
          🎮 开始寻宝
        </GameButton>
        
        <GameButton 
          variant="secondary" 
          @click="resetGame" 
          :disabled="!gameStore.isPlaying"
        >
          🔄 重新开始
        </GameButton>
        
        <GameButton 
          variant="success" 
          @click="$router.push('/leaderboard')"
        >
          🏆 查看排行榜
        </GameButton>
      </div>
    </div>

    <!-- 谜题弹窗 -->
    <PuzzleModal 
      v-if="showPuzzleModal"
      @complete="handlePuzzleComplete"
      @close="closePuzzleModal"
    />
    
    <!-- 战斗系统 -->
    <BattleSystem 
      v-if="showBattleModal"
      :enemy="currentEnemy"
      @complete="handleBattleComplete"
      @close="closeBattleModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'

// 组件导入
import NavigationBar from '@/components/layout/NavigationBar.vue'
import TreasureMap from '@/components/game/TreasureMap.vue'
import PlayerStats from '@/components/game/PlayerStats.vue'
import GameProgress from '@/components/game/GameProgress.vue'
import LogDisplay from '@/components/common/LogDisplay.vue'
import GameButton from '@/components/common/GameButton.vue'
import PuzzleModal from '@/components/game/PuzzleModal.vue'
import BattleSystem from '@/components/game/BattleSystem.vue'
import LocationInteraction from '@/components/game/LocationInteraction.vue'

const gameStore = useGameStore()
const userStore = useUserStore()
const router = useRouter()

// 状态
const currentLocationModal = ref(null)
const showPuzzleModal = ref(false)
const showBattleModal = ref(false)
const currentEnemy = ref(null)

// 检查用户登录状态
onMounted(() => {
  if (!userStore.isLoggedIn) {
    gameStore.addLog('请先登录再开始游戏', 'info')
  }
})

const startGame = () => {
  if (!userStore.isLoggedIn) {
    router.push('/login')
    return
  }
  
  const started = gameStore.startGame()
  if (started) {
    gameStore.addLog(`欢迎 ${userStore.currentUser.username} 开始寻宝之旅！`, 'success')
  }
}

const resetGame = () => {
  gameStore.resetGame()
  gameStore.addLog('游戏已重置', 'info')
}

const handleLocationSelected = (location) => {
  currentLocationModal.value = location
  gameStore.addLog(`进入了${location.name}`, 'info')
}

const handleStepSelected = ({ step, index }) => {
  gameStore.addLog(`查看步骤: ${step.name}`, 'info')
}

const handleLocationComplete = (result) => {
  if (result.success) {
    const currentStep = gameStore.currentStep
    gameStore.completeStep(currentStep)
    gameStore.addLog(`成功完成${currentLocationModal.value.name}的挑战！`, 'success')
    
    // 根据结果更新玩家状态
    if (result.rewards) {
      gameStore.updatePlayerStats(result.rewards)
    }
  }
  
  closeLocationModal()
}

const closeLocationModal = () => {
  currentLocationModal.value = null
}

const handlePuzzleComplete = (success) => {
  showPuzzleModal.value = false
  if (success) {
    gameStore.addLog('谜题解答成功！', 'success')
    gameStore.updatePlayerStats({ luck: Math.min(100, gameStore.player.luck + 10) })
  } else {
    gameStore.addLog('谜题解答失败！', 'error')
    gameStore.updatePlayerStats({ health: Math.max(0, gameStore.player.health - 10) })
  }
}

const closePuzzleModal = () => {
  showPuzzleModal.value = false
}

const handleBattleComplete = (result) => {
  showBattleModal.value = false
  if (result.victory) {
    gameStore.addLog(`击败了${currentEnemy.value}！`, 'success')
    gameStore.updatePlayerStats({ gold: gameStore.player.gold + 100 })
  } else {
    gameStore.addLog(`被${currentEnemy.value}击败了！`, 'error')
    gameStore.updatePlayerStats({ health: 50 })
  }
  currentEnemy.value = null
}

const closeBattleModal = () => {
  showBattleModal.value = false
  currentEnemy.value = null
}
</script>

<style scoped>
.game-view {
  background: linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d);
  color: #fff;
  min-height: 100vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.container {
  max-width: 900px;
  width: 100%;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  margin-top: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 2.5rem;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
  color: #ffd700;
}

.game-area {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .game-area {
    flex-direction: column;
  }
}

.interaction-area {
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  padding: 20px;
  margin-top: 20px;
  border: 1px solid #444;
  min-height: 150px;
}

.welcome-message {
  text-align: center;
  padding: 20px;
}

.welcome-message h2 {
  color: #ffd700;
  margin-bottom: 10px;
}

.game-guidance {
  text-align: center;
  padding: 20px;
  color: #ffd700;
  font-size: 1.2rem;
}

.controls {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
  flex-wrap: wrap;
}

@media (max-width: 480px) {
  .controls {
    flex-direction: column;
    align-items: center;
  }
  
  .controls .game-button {
    width: 100%;
    max-width: 200px;
  }
}
</style>