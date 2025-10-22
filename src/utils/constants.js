// 游戏常量定义

export const GAME_CONSTANTS = {
  // 玩家属性最大值
  MAX_HEALTH: 100,
  MAX_ENERGY: 100,
  MAX_LUCK: 100,
  
  // 游戏配置
  TOTAL_STEPS: 4,
  BATTLE_MAX_ATTEMPTS: 3,
  PUZZLE_TIME_LIMIT: 30000, // 30秒
  
  // 奖励配置
  REWARDS: {
    STEP_COMPLETE: 50,
    BATTLE_VICTORY: 100,
    PUZZLE_SUCCESS: 25,
    TREASURE_FINAL: 500
  },
  
  // 惩罚配置
  PENALTIES: {
    BATTLE_DEFEAT: 20, // 生命值减少
    PUZZLE_FAIL: 10,   // 生命值减少
    TRAP: 15           // 生命值减少
  }
}

// 地点配置
export const LOCATIONS = [
  { 
    id: 'library', 
    name: '古老图书馆', 
    icon: '📚', 
    step: 1,
    description: '尘封的书卷中藏着古老的智慧',
    challenges: ['find_book', 'decode_text'],
    difficulty: 'easy'
  },
  { 
    id: 'temple', 
    name: '神秘神庙', 
    icon: '🏛️', 
    step: 2,
    description: '石柱间回荡着远古的低语',
    challenges: ['solve_puzzle', 'avoid_traps'],
    difficulty: 'medium'
  },
  { 
    id: 'cave', 
    name: '幽深山洞', 
    icon: '🕳️', 
    step: 3,
    description: '黑暗中闪烁着未知的危险与机遇',
    challenges: ['battle', 'find_path'],
    difficulty: 'hard'
  },
  { 
    id: 'forest', 
    name: '魔法森林', 
    icon: '🌲', 
    step: 4,
    description: '荧光蘑菇指引着通往宝藏的道路',
    challenges: ['collect', 'final_battle'],
    difficulty: 'expert'
  }
]

// 敌人类型
export const ENEMY_TYPES = {
  GUARD: {
    name: "神庙守卫",
    health: 100,
    attack: 15,
    defense: 10,
    icon: "👹",
    description: "守护神庙的古老战士"
  },
  BAT: {
    name: "洞穴蝙蝠",
    health: 60,
    attack: 20,
    defense: 5,
    icon: "🦇",
    description: "敏捷的飞行生物"
  },
  SPIRIT: {
    name: "森林精灵",
    health: 80,
    attack: 25,
    defense: 8,
    icon: "🧚",
    description: "掌握自然魔法的神秘存在"
  },
  DRAGON: {
    name: "宝藏守护者",
    health: 150,
    attack: 30,
    defense: 15,
    icon: "🐉",
    description: "最终的守护者，力量强大"
  }
}

// 游戏事件类型
export const EVENT_TYPES = {
  BATTLE: 'battle',
  PUZZLE: 'puzzle',
  TREASURE: 'treasure',
  TRAP: 'trap',
  DISCOVERY: 'discovery'
}

// 日志消息类型
export const LOG_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  EVENT: 'event',
  BATTLE: 'battle'
}

// 本地存储键名
export const STORAGE_KEYS = {
  USERS: 'treasureUsers',
  GAME_SAVE: 'treasureGameSave',
  SETTINGS: 'treasureSettings'
}

// 音乐配置（指向 public/music 下的文件）
export const MUSIC_CONFIG = {
  BGM: {
    library: '/music/library.mp3',
    temple: '/music/temple.mp3',
    cave: '/music/cave.mp3',
    forest: '/music/forest.mp3'
  },
  SFX: {
    click: '',
    success: ''
  },
  VOLUME: {
    BGM: 0.5,
    SFX: 0.8,
    MASTER: 1
  }
}

export default {
  GAME_CONSTANTS,
  LOCATIONS,
  ENEMY_TYPES,
  EVENT_TYPES,
  LOG_TYPES,
  STORAGE_KEYS
}