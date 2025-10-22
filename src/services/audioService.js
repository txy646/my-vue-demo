import { MUSIC_CONFIG } from '@/utils/constants'

class AudioService {
  constructor() {
    this.bgmAudio = new Audio()
    this.sfxAudio = new Audio()
    this.isMuted = false
    this.currentBGM = null
    
    // 配置音频
    this.bgmAudio.loop = true
    this.bgmAudio.volume = MUSIC_CONFIG.VOLUME.BGM
    this.sfxAudio.volume = MUSIC_CONFIG.VOLUME.SFX
    
    // 预加载音乐（可选）
    this.preloadAudio()
  }

  // 预加载音频文件
  preloadAudio() {
    const audioFiles = Object.values(MUSIC_CONFIG.BGM).concat(Object.values(MUSIC_CONFIG.SFX))
    audioFiles.forEach(src => {
      const audio = new Audio()
      audio.src = src
    })
  }

  // 播放背景音乐
  playBGM(musicKey) {
    if (this.isMuted || !MUSIC_CONFIG.BGM[musicKey]) return
    
    const musicPath = MUSIC_CONFIG.BGM[musicKey]
    
    // 如果已经在播放同一首音乐，则不重复播放
    if (this.currentBGM === musicPath && !this.bgmAudio.paused) {
      return
    }
    
    this.bgmAudio.src = musicPath
    this.currentBGM = musicPath
    
    this.bgmAudio.play().catch(error => {
      console.warn('自动播放被阻止:', error)
      // 可以在这里添加用户交互后重新播放的逻辑
    })
  }

  // 停止背景音乐
  stopBGM() {
    this.bgmAudio.pause()
    this.bgmAudio.currentTime = 0
    this.currentBGM = null
  }

  // 暂停背景音乐
  pauseBGM() {
    this.bgmAudio.pause()
  }

  // 恢复背景音乐
  resumeBGM() {
    if (this.currentBGM && !this.isMuted) {
      this.bgmAudio.play().catch(console.error)
    }
  }

  // 播放音效
  playSFX(sfxKey) {
    if (this.isMuted || !MUSIC_CONFIG.SFX[sfxKey]) return
    
    this.sfxAudio.src = MUSIC_CONFIG.SFX[sfxKey]
    this.sfxAudio.play().catch(console.error)
  }

  // 设置音量
  setVolume(type, volume) {
    const clampedVolume = Math.max(0, Math.min(1, volume))
    
    switch (type) {
      case 'bgm':
        this.bgmAudio.volume = clampedVolume
        MUSIC_CONFIG.VOLUME.BGM = clampedVolume
        break
      case 'sfx':
        this.sfxAudio.volume = clampedVolume
        MUSIC_CONFIG.VOLUME.SFX = clampedVolume
        break
      case 'master':
        this.bgmAudio.volume = clampedVolume * MUSIC_CONFIG.VOLUME.BGM
        this.sfxAudio.volume = clampedVolume * MUSIC_CONFIG.VOLUME.SFX
        MUSIC_CONFIG.VOLUME.MASTER = clampedVolume
        break
    }
  }

  // 静音/取消静音
  toggleMute() {
    this.isMuted = !this.isMuted
    
    if (this.isMuted) {
      this.bgmAudio.volume = 0
      this.sfxAudio.volume = 0
    } else {
      this.bgmAudio.volume = MUSIC_CONFIG.VOLUME.BGM * MUSIC_CONFIG.VOLUME.MASTER
      this.sfxAudio.volume = MUSIC_CONFIG.VOLUME.SFX * MUSIC_CONFIG.VOLUME.MASTER
    }
    
    return this.isMuted
  }

  // 获取当前播放状态
  getPlaybackState() {
    return {
      isMuted: this.isMuted,
      currentBGM: this.currentBGM,
      isPlaying: !this.bgmAudio.paused,
      volume: {
        bgm: this.bgmAudio.volume,
        sfx: this.sfxAudio.volume
      }
    }
  }

  // 淡入效果
  fadeIn(duration = 2000) {
    const initialVolume = this.bgmAudio.volume
    this.bgmAudio.volume = 0
    
    let startVolume = 0
    const targetVolume = initialVolume
    const stepTime = 50
    const steps = duration / stepTime
    const volumeStep = targetVolume / steps
    
    const fadeInterval = setInterval(() => {
      startVolume += volumeStep
      this.bgmAudio.volume = startVolume
      
      if (startVolume >= targetVolume) {
        this.bgmAudio.volume = targetVolume
        clearInterval(fadeInterval)
      }
    }, stepTime)
  }

  // 淡出效果
  fadeOut(duration = 2000) {
    const initialVolume = this.bgmAudio.volume
    let currentVolume = initialVolume
    const stepTime = 50
    const steps = duration / stepTime
    const volumeStep = initialVolume / steps
    
    const fadeInterval = setInterval(() => {
      currentVolume -= volumeStep
      this.bgmAudio.volume = Math.max(0, currentVolume)
      
      if (currentVolume <= 0) {
        this.bgmAudio.pause()
        this.bgmAudio.volume = initialVolume
        clearInterval(fadeInterval)
      }
    }, stepTime)
  }
}

// 创建单例实例
export const audioService = new AudioService()
export default audioService