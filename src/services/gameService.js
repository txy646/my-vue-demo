import { GAME_CONSTANTS, REWARDS, PENALTIES } from '@/utils/constants'

// 游戏服务 - 处理游戏逻辑
export class GameService {
  static calculateBattleDamage(attacker, defender, action) {
    const baseDamage = action === 'attack' ? 20 : 10
    const luckBonus = Math.floor(attacker.luck / 10)
    const randomFactor = Math.random() * 10
    
    let damage = baseDamage + luckBonus + randomFactor
    
    // 防御动作减伤
    if (action === 'defend') {
      damage *= 0.5
    }
    
    return Math.floor(damage)
  }

  static calculateFleeChance(luck) {
    const baseChance = 0.3
    const luckBonus = luck / 200
    return Math.min(0.8, baseChance + luckBonus)
  }

  static calculateStepReward(stepIndex, performance = 1) {
    const baseReward = REWARDS.STEP_COMPLETE
    const stepMultiplier = (stepIndex + 1) * 0.5
    return Math.floor(baseReward * stepMultiplier * performance)
  }

  static calculateFinalScore(playerStats, gameTime, stepsCompleted) {
    const goldScore = playerStats.gold * 2
    const healthScore = playerStats.health
    const luckScore = playerStats.luck
    const timeBonus = Math.max(0, 1000 - gameTime / 1000) // 时间越短分数越高
    const completionBonus = stepsCompleted * 500
    
    return goldScore + healthScore + luckScore + timeBonus + completionBonus
  }

  static generateRandomEvent() {
    const events = [
      {
        type: 'treasure',
        message: '发现了隐藏的宝箱！',
        effect: { gold: 50 }
      },
      {
        type: 'trap',
        message: '触发了陷阱！',
        effect: { health: -15 }
      },
      {
        type: 'discovery',
        message: '找到了有用的道具！',
        effect: { items: ['治疗药水'] }
      },
      {
        type: 'nothing',
        message: '这里什么都没有发现...',
        effect: {}
      }
    ]
    
    return events[Math.floor(Math.random() * events.length)]
  }

  static checkGameCompletion(steps) {
    return steps.every(step => step.completed)
  }

  static getGameProgress(steps) {
    const completedSteps = steps.filter(step => step.completed).length
    return (completedSteps / steps.length) * 100
  }

  static validatePlayerStats(stats) {
    return {
      health: Math.max(0, Math.min(GAME_CONSTANTS.MAX_HEALTH, stats.health)),
      energy: Math.max(0, Math.min(GAME_CONSTANTS.MAX_ENERGY, stats.energy)),
      luck: Math.max(0, Math.min(GAME_CONSTANTS.MAX_LUCK, stats.luck)),
      gold: Math.max(0, stats.gold),
      items: stats.items || []
    }
  }
}

export default GameService