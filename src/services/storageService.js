import { STORAGE_KEYS } from '@/utils/constants'

// 存储服务 - 处理本地存储操作
export class StorageService {
  static getItem(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error)
      return defaultValue
    }
  }

  static setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error)
      return false
    }
  }

  static removeItem(key) {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error(`Error removing from localStorage key "${key}":`, error)
      return false
    }
  }

  static clear() {
    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.error('Error clearing localStorage:', error)
      return false
    }
  }

  // 特定的存储方法
  static saveGameState(gameState) {
    return this.setItem(STORAGE_KEYS.GAME_SAVE, gameState)
  }

  static loadGameState() {
    return this.getItem(STORAGE_KEYS.GAME_SAVE)
  }

  static clearGameState() {
    return this.removeItem(STORAGE_KEYS.GAME_SAVE)
  }

  static saveUsers(users) {
    return this.setItem(STORAGE_KEYS.USERS, users)
  }

  static loadUsers() {
    return this.getItem(STORAGE_KEYS.USERS, [])
  }

  static saveSettings(settings) {
    return this.setItem(STORAGE_KEYS.SETTINGS, settings)
  }

  static loadSettings() {
    return this.getItem(STORAGE_KEYS.SETTINGS, {
      sound: true,
      music: true,
      notifications: true
    })
  }
}

export default StorageService