import { STORAGE_KEYS } from '@/utils/constants'

// 用户服务 - 处理用户相关操作
export class UserService {
  static validateUsername(username) {
    if (!username || username.length < 3) {
      return { valid: false, message: '用户名至少3个字符' }
    }
    
    if (username.length > 20) {
      return { valid: false, message: '用户名不能超过20个字符' }
    }
    
    if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(username)) {
      return { valid: false, message: '用户名只能包含字母、数字、下划线和中文字符' }
    }
    
    return { valid: true }
  }

  static validatePassword(password) {
    if (!password || password.length < 6) {
      return { valid: false, message: '密码至少6个字符' }
    }
    
    return { valid: true }
  }

  static validateEmail(email) {
    if (!email) {
      return { valid: false, message: '邮箱不能为空' }
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { valid: false, message: '邮箱格式不正确' }
    }
    
    return { valid: true }
  }

  static calculateUserLevel(completedGames) {
    return Math.floor(completedGames / 5) + 1
  }

  static calculateExperience(completedGames, totalGold) {
    return completedGames * 100 + totalGold
  }

  static getRankTitle(score) {
    if (score >= 5000) return '寻宝大师'
    if (score >= 3000) return '资深猎人'
    if (score >= 1500) return '冒险专家'
    if (score >= 500) return '新手探险家'
    return '初学者'
  }
}

export default UserService