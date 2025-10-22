// 寻宝地图API - 模拟异步操作
export class TreasureMapAPI {
  static async getInitialClue() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const clues = [
          "在古老的图书馆里找到了第一个线索：'月光照耀时，石像会指引方向'",
          "发现了一张古老的地图碎片，指向神秘的神庙",
          "在一本古籍中找到了关于宝藏的记载：'当星辰排列成直线，神庙之门将开启'",
          "破译了墙上的密码：'知识是钥匙，勇气是道路'"
        ]
        resolve(clues[Math.floor(Math.random() * clues.length)])
      }, 1000)
    })
  }
  
  static async decodeAncientScript(clue) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!clue) {
          reject("没有线索可以解码!")
        }
        
        const success = Math.random() > 0.2 // 80% 成功率
        if (success) {
          const decoded = [
            "解码成功! 宝藏在一座古老的神庙中，需要解开三道谜题",
            "古文字揭示：'穿越森林，越过山洞，神庙藏于群山之间'",
            "破译结果：'守护者沉睡于神庙深处，只有智者能唤醒'",
            "解读完成：'四个元素，四个试炼，最终宝藏属于勇者'"
          ]
          resolve(decoded[Math.floor(Math.random() * decoded.length)])
        } else {
          reject("解码失败! 文字太过古老，需要更多时间研究...")
        }
      }, 1500)
    })
  }
  
  static async searchTemple(location) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const random = Math.random()
        if (random < 0.3) {
          reject("糟糕! 遇到了神庙守卫! 需要重新尝试...")
        } else if (random < 0.6) {
          reject("陷阱! 你掉进了一个坑里，爬出来继续寻找...")
        } else {
          const findings = [
            "找到了一个神秘的箱子，上面刻着奇怪的符号",
            "发现了一间密室，墙上画着星图",
            "在祭坛下找到了一个古老的卷轴",
            "石像后面藏着一个宝箱，但被锁住了"
          ]
          resolve(findings[Math.floor(Math.random() * findings.length)])
        }
      }, 2000)
    })
  }
  
  static async openTreasureBox() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const treasures = [
          "恭喜! 你找到了传说中的宝藏 - 智慧之石!",
          "宝箱开启! 里面装满了金币和古老的文物!",
          "发现了失传已久的魔法卷轴和珍贵的宝石!",
          "宝藏现身! 你获得了古代王族的传承!"
        ]
        resolve(treasures[Math.floor(Math.random() * treasures.length)])
      }, 1000)
    })
  }
  
  static async findHiddenPath() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const random = Math.random()
        if (random < 0.4) {
          reject("道路被堵住了! 需要寻找其他路径...")
        } else {
          const paths = [
            "发现了一条隐藏的小路，通往神庙深处...",
            "移动了石像，露出了秘密通道...",
            "解开了机关，墙壁缓缓打开...",
            "按照星图指引，找到了隐藏的入口..."
          ]
          resolve(paths[Math.floor(Math.random() * paths.length)])
        }
      }, 1500)
    })
  }
  
  static async solvePuzzle() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const solutions = [
          "成功解开了古老的谜题! 宝箱的锁打开了...",
          "智慧战胜了机关! 通道畅通无阻...",
          "按照正确的顺序按下按钮，密室门缓缓开启...",
          "破解了密码，获得了通往宝藏的权限..."
        ]
        resolve(solutions[Math.floor(Math.random() * solutions.length)])
      }, 1800)
    })
  }

  // 新的冒险动作
  static async exploreLocation(locationId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const events = {
          library: {
            success: "在图书馆找到了珍贵的古籍",
            fail: "图书馆的书架倒塌了，需要重新整理"
          },
          temple: {
            success: "解开了神庙的古老机关",
            fail: "触发了神庙的防御机制"
          },
          cave: {
            success: "在洞穴深处发现了宝石矿脉",
            fail: "洞穴坍塌，需要另寻出路"
          },
          forest: {
            success: "采集到了神奇的药草",
            fail: "在森林中迷路了"
          }
        }
        
        const locationEvents = events[locationId]
        const success = Math.random() > 0.3
        
        if (success) {
          resolve(locationEvents.success)
        } else {
          reject(locationEvents.fail)
        }
      }, 1200)
    })
  }

  static async battleEnemy(enemyType) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const enemies = {
          guard: { name: "神庙守卫", strength: 80 },
          bat: { name: "洞穴蝙蝠", strength: 60 },
          spirit: { name: "森林精灵", strength: 70 },
          dragon: { name: "宝藏守护者", strength: 90 }
        }
        
        const enemy = enemies[enemyType] || { name: "神秘生物", strength: 50 }
        resolve(enemy)
      }, 800)
    })
  }
}

export default TreasureMapAPI