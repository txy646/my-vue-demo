import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from './userStore'
import { audioService } from '@/services/audioService'
import { STORAGE_KEYS } from '@/utils/constants'

// 小工具：延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const useGameStore = defineStore('game', () => {
  const userStore = useUserStore()
  
  // 游戏状态
  const steps = ref([
    { id: 'step1', name: '寻找线索', active: false, completed: false, location: 'library' },
    { id: 'step2', name: '解码古文字', active: false, completed: false, location: 'temple' },
    { id: 'step3', name: '探索神庙', active: false, completed: false, location: 'cave' },
    { id: 'step4', name: '打开宝箱', active: false, completed: false, location: 'forest' }
  ])
  
  const currentStep = ref(0)
  const isPlaying = ref(false)
  const gameLogs = ref([])
  const showTreasure = ref(false)
  
  // 玩家状态
  const player = ref({
    health: 100,
    energy: 100,
    luck: 50,
    gold: 0,
    items: []
  })
  
  // 冒险者位置
  const adventurerPosition = ref({ x: 10, y: 10 })
  
  // 地点状态
  const locations = ref({
    library: { explored: false, accessible: true },
    temple: { explored: false, accessible: false },
    cave: { explored: false, accessible: false },
    forest: { explored: false, accessible: false }
  })

  // 计算属性
  const progress = computed(() => {
    const completedSteps = steps.value.filter(step => step.completed).length
    return (completedSteps / steps.value.length) * 100
  })
  
  const currentActiveLocation = computed(() => {
    const activeStep = steps.value.find(step => step.active)
    return activeStep ? activeStep.location : null
  })

  // 操作方法
  const startGame = () => {
    if (!userStore.isLoggedIn) {
      addLog('请先登录再开始游戏', 'error')
      return false
    }
    
    // 初始化并启动背景音乐
    resetGame()
    isPlaying.value = true
    setStepActive(0)
    moveAdventurer(20, 30)
    audioService.playBGM('library')
    addLog('寻宝之旅开始！点击地图上的地点开始冒险。', 'info')
    saveGame()
    return true
  }

  const setStepActive = (stepIndex) => {
    steps.value.forEach((step, index) => {
      step.active = index === stepIndex
      // 更新地点可访问性
      if (index === stepIndex) {
        locations.value[step.location].accessible = true
      }
    })
    currentStep.value = stepIndex
  }

  // 异步完成某一关（包含动画/延迟/音乐切换）
  const completeStep = async (stepIndex) => {
    if (stepIndex < 0 || stepIndex >= steps.value.length) return

    steps.value[stepIndex].completed = true
    steps.value[stepIndex].active = false
    locations.value[steps.value[stepIndex].location].explored = true
    addLog(`完成了关卡：${steps.value[stepIndex].name}`, 'success')

    // 模拟奖励动画
    await delay(800)

    // 激活下一步或完成游戏
    if (stepIndex < steps.value.length - 1) {
      setStepActive(stepIndex + 1)
      // 切换背景音乐到下一地点（if available）
      const nextLoc = steps.value[stepIndex + 1].location
      audioService.playBGM(nextLoc)
    } else {
      await completeGame()
    }

    saveGame()
  }

  const completeGame = async () => {
    // 最终庆祝动画
    audioService.playSFX && audioService.playSFX('success')
    await delay(600)

    isPlaying.value = false
    showTreasure.value = true
    const score = calculateScore()

    // 更新用户统计
    userStore.updateGameStats({
      completed: true,
      gold: player.value.gold,
      score: score,
      time: Date.now()
    })

    addLog(`🎉 恭喜！寻宝任务完成！最终得分: ${score}`, 'success')
    addLog(`💰 获得金币: ${player.value.gold}`, 'success')

    // 保存与停止音乐
    saveGame()
    audioService.fadeOut && audioService.fadeOut(1200)
  }

  const calculateScore = () => {
    const baseScore = 1000
    const goldBonus = player.value.gold * 2
    const healthBonus = player.value.health
    const luckBonus = player.value.luck
    return baseScore + goldBonus + healthBonus + luckBonus
  }

  const moveAdventurer = (x, y) => {
    adventurerPosition.value = { x, y }
  }

  const updatePlayerStats = (updates) => {
    Object.assign(player.value, updates)
    // 确保数值在合理范围内
    player.value.health = Math.max(0, Math.min(100, player.value.health))
    player.value.energy = Math.max(0, Math.min(100, player.value.energy))
    player.value.luck = Math.max(0, Math.min(100, player.value.luck))
  }

  const addLog = (message, type = 'info') => {
    gameLogs.value.push({
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    })
    
    // 保持日志数量不超过50条
    if (gameLogs.value.length > 50) {
      gameLogs.value.shift()
    }
  }

  const resetGame = () => {
    steps.value.forEach(step => {
      step.active = false
      step.completed = false
    })
    
    Object.keys(locations.value).forEach(location => {
      locations.value[location] = { explored: false, accessible: location === 'library' }
    })
    
    player.value = {
      health: 100,
      energy: 100,
      luck: 50,
      gold: 0,
      items: []
    }
    
    gameLogs.value = []
    showTreasure.value = false
    currentStep.value = 0
    adventurerPosition.value = { x: 10, y: 10 }
    // 停止背景音乐
    audioService.stopBGM && audioService.stopBGM()
    // 清除存档
    try { localStorage.removeItem(STORAGE_KEYS.GAME_SAVE) } catch (e) {}
  }

  // 存档与恢复
  const saveGame = () => {
    try {
      const snapshot = {
        steps: steps.value,
        currentStep: currentStep.value,
        isPlaying: isPlaying.value,
        player: player.value,
        locations: locations.value,
        adventurerPosition: adventurerPosition.value,
        showTreasure: showTreasure.value
      }
      localStorage.setItem(STORAGE_KEYS.GAME_SAVE, JSON.stringify(snapshot))
    } catch (e) {
      console.warn('保存游戏失败', e)
    }
  }

  const restoreGame = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.GAME_SAVE)
      if (!raw) return false
      const snap = JSON.parse(raw)
      steps.value = snap.steps || steps.value
      currentStep.value = snap.currentStep || currentStep.value
      isPlaying.value = snap.isPlaying || isPlaying.value
      player.value = snap.player || player.value
      locations.value = snap.locations || locations.value
      adventurerPosition.value = snap.adventurerPosition || adventurerPosition.value
      showTreasure.value = snap.showTreasure || showTreasure.value

      // 恢复后根据当前步骤播放相应音乐
      const active = steps.value.find(s => s.active) || steps.value[currentStep.value]
      if (active) audioService.playBGM(active.location)
      addLog('恢复了存档进度', 'info')
      return true
    } catch (e) {
      console.warn('恢复游戏失败', e)
      return false
    }
  }

  const isLocationAccessible = (locationId) => {
    return locations.value[locationId]?.accessible && !locations.value[locationId]?.explored
  }

  const isLocationExplored = (locationId) => {
    return locations.value[locationId]?.explored
  }

  return {
    // 状态
    steps,
    currentStep,
    isPlaying,
    player,
    gameLogs,
    showTreasure,
    adventurerPosition,
    locations,
    
    // 计算属性
    progress,
    currentActiveLocation,
    
    // 方法
    startGame,
    setStepActive,
    completeStep,
    completeGame,
    moveAdventurer,
    updatePlayerStats,
    addLog,
    resetGame,
    isLocationAccessible,
    isLocationExplored
  }
})