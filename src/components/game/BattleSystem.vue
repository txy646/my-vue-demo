<template>
  <CustomModal :show="show" @close="$emit('close')" title="战斗系统">
    <div class="battle-system">
      <div class="battle-header">
        <h2>⚔️ {{ enemy }} 来袭！</h2>
      </div>
      
      <div class="battle-content">
        <div class="combatants">
          <div class="player-combatant">
            <div class="combatant-icon">🧙</div>
            <div class="combatant-info">
              <h3>冒险者</h3>
              <div class="health-bar">
                <div class="health-fill" :style="{ width: playerHealth + '%' }"></div>
                <span class="health-text">{{ playerHealth }}/100</span>
              </div>
            </div>
          </div>
          
          <div class="vs">VS</div>
          
          <div class="enemy-combatant">
            <div class="combatant-icon">{{ enemyIcon }}</div>
            <div class="combatant-info">
              <h3>{{ enemy }}</h3>
              <div class="health-bar">
                <div class="health-fill" :style="{ width: enemyHealth + '%' }"></div>
                <span class="health-text">{{ enemyHealth }}/100</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="battle-log">
          <div 
            v-for="(log, index) in battleLogs" 
            :key="index"
            class="battle-log-entry"
            :class="log.type"
          >
            {{ log.message }}
          </div>
          <div v-if="battleLogs.length === 0" class="empty-log">
            战斗即将开始...
          </div>
        </div>
        
        <div class="battle-actions" v-if="!battleEnded">
          <GameButton 
            variant="danger" 
            @click="performAction('attack')"
            :disabled="isProcessing"
          >
            ⚔️ 攻击
          </GameButton>
          
          <GameButton 
            variant="secondary" 
            @click="performAction('defend')"
            :disabled="isProcessing"
          >
            🛡️ 防御
          </GameButton>
          
          <GameButton 
            variant="success" 
            @click="performAction('flee')"
            :disabled="isProcessing"
          >
            🏃 逃跑
          </GameButton>
        </div>
        
        <div v-else class="battle-result">
          <h3 :class="battleResultClass">{{ battleResultMessage }}</h3>
          <GameButton @click="$emit('close')">
            继续冒险
          </GameButton>
        </div>
      </div>
    </div>
  </CustomModal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import CustomModal from '@/components/common/CustomModal.vue'
import GameButton from '@/components/common/GameButton.vue'

const props = defineProps({
  show: Boolean,
  enemy: String
})

const emit = defineEmits(['complete', 'close'])

const gameStore = useGameStore()

// 战斗状态
const playerHealth = ref(100)
const enemyHealth = ref(100)
const battleLogs = ref([])
const isProcessing = ref(false)
const battleEnded = ref(false)

const enemyIcon = computed(() => {
  const icons = {
    '神庙守卫': '👹',
    '洞穴蝙蝠': '🦇',
    '森林精灵': '🧚',
    '宝藏守护者': '🐉'
  }
  return icons[props.enemy] || '👾'
})

const battleResultClass = computed(() => {
  return playerHealth.value <= 0 ? 'defeat' : 'victory'
})

const battleResultMessage = computed(() => {
  if (playerHealth.value <= 0) {
    return '战斗失败！'
  } else if (enemyHealth.value <= 0) {
    return '战斗胜利！'
  }
  return '成功逃脱！'
})

// 战斗动作
const performAction = async (action) => {
  if (isProcessing.value || battleEnded.value) return
  
  isProcessing.value = true
  
  switch (action) {
    case 'attack':
      await attack()
      break
    case 'defend':
      await defend()
      break
    case 'flee':
      await flee()
      break
  }
  
  if (!battleEnded.value) {
    // 敌人回合
    setTimeout(() => {
      enemyAttack()
      isProcessing.value = false
    }, 1000)
  } else {
    isProcessing.value = false
  }
}

const attack = () => {
  return new Promise((resolve) => {
    const playerDamage = Math.floor(Math.random() * 20) + 10 + Math.floor(gameStore.player.luck / 10)
    enemyHealth.value = Math.max(0, enemyHealth.value - playerDamage)
    
    addLog(`你对 ${props.enemy} 造成了 ${playerDamage} 点伤害！`, 'player-action')
    
    setTimeout(() => {
      checkBattleEnd()
      resolve()
    }, 500)
  })
}

const defend = () => {
  return new Promise((resolve) => {
    const damageReduction = 0.5 + (gameStore.player.luck / 200)
    const enemyDamage = Math.floor((Math.random() * 10 + 5) * damageReduction)
    playerHealth.value = Math.max(0, playerHealth.value - enemyDamage)
    
    addLog(`你采取了防御姿态，只受到了 ${enemyDamage} 点伤害！`, 'player-action')
    
    setTimeout(() => {
      checkBattleEnd()
      resolve()
    }, 500)
  })
}

const flee = () => {
  return new Promise((resolve) => {
    const fleeChance = gameStore.player.luck / 100
    if (Math.random() < fleeChance) {
      addLog('你成功逃脱了！', 'success')
      endBattle(false, true)
    } else {
      const enemyDamage = Math.floor(Math.random() * 15) + 10
      playerHealth.value = Math.max(0, playerHealth.value - enemyDamage)
      addLog('逃跑失败！', 'error')
      addLog(`${props.enemy} 对你造成了 ${enemyDamage} 点伤害！`, 'enemy-action')
    }
    
    setTimeout(() => {
      checkBattleEnd()
      resolve()
    }, 500)
  })
}

const enemyAttack = () => {
  if (battleEnded.value) return
  
  const enemyDamage = Math.floor(Math.random() * 15) + 5
  playerHealth.value = Math.max(0, playerHealth.value - enemyDamage)
  
  addLog(`${props.enemy} 对你造成了 ${enemyDamage} 点伤害！`, 'enemy-action')
  checkBattleEnd()
}

const addLog = (message, type = 'info') => {
  battleLogs.value.push({ message, type, timestamp: Date.now() })
  
  // 保持日志数量
  if (battleLogs.value.length > 8) {
    battleLogs.value.shift()
  }
}

const checkBattleEnd = () => {
  if (playerHealth.value <= 0) {
    endBattle(false, false)
  } else if (enemyHealth.value <= 0) {
    endBattle(true, false)
  }
}

const endBattle = (victory, fled) => {
  battleEnded.value = true
  emit('complete', { 
    victory, 
    fled,
    playerHealth: playerHealth.value,
    enemyHealth: enemyHealth.value
  })
}

const resetBattle = () => {
  playerHealth.value = gameStore.player.health
  enemyHealth.value = 100
  battleLogs.value = []
  isProcessing.value = false
  battleEnded.value = false
}

// 监听显示状态
watch(() => props.show, (newVal) => {
  if (newVal) {
    resetBattle()
    addLog(`遇到了 ${props.enemy}！战斗开始！`, 'event')
  }
})
</script>

<style scoped>
.battle-system {
  max-width: 600px;
}

.battle-header {
  text-align: center;
  margin-bottom: 20px;
}

.battle-header h2 {
  color: #ff6b6b;
  margin: 0;
}

.combatants {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 20px;
}

.player-combatant,
.enemy-combatant {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.combatant-icon {
  font-size: 3rem;
  margin-bottom: 10px;
}

.combatant-info {
  text-align: center;
}

.combatant-info h3 {
  margin: 0 0 8px 0;
  color: #ffd700;
}

.health-bar {
  width: 100px;
  height: 12px;
  background: #333;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
}

.health-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff0000, #ff6b6b);
  transition: width 0.3s ease;
}

.health-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.7rem;
  color: white;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.8);
}

.vs {
  font-size: 1.5rem;
  font-weight: bold;
  color: #ffd700;
}

.battle-log {
  height: 120px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 20px;
  overflow-y: auto;
  border: 1px solid #444;
}

.battle-log-entry {
  padding: 4px 0;
  font-size: 0.9rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.battle-log-entry:last-child {
  border-bottom: none;
}

.battle-log-entry.player-action {
  color: #87CEEB;
}

.battle-log-entry.enemy-action {
  color: #FF6B6B;
}

.battle-log-entry.success {
  color: #90EE90;
}

.battle-log-entry.error {
  color: #FF6B6B;
}

.battle-log-entry.event {
  color: #FFA500;
}

.empty-log {
  text-align: center;
  color: #888;
  padding: 20px;
  font-style: italic;
}

.battle-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

.battle-result {
  text-align: center;
  padding: 20px;
}

.battle-result h3 {
  margin-bottom: 15px;
}

.battle-result h3.victory {
  color: #90EE90;
}

.battle-result h3.defeat {
  color: #FF6B6B;
}
</style>