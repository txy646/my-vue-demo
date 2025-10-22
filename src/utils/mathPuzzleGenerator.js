// 数学谜题生成器
export class MathPuzzleGenerator {
  static generateQuestion() {
    const puzzles = [
      {
        question: "如果 3x + 5 = 20，那么 x 等于多少？",
        options: ["5", "6", "7", "8"],
        correct: "5",
        difficulty: "easy",
        type: "algebra"
      },
      {
        question: "一个三角形的三个内角分别是 30°、60° 和多少度？",
        options: ["90°", "120°", "150°", "180°"],
        correct: "90°",
        difficulty: "easy",
        type: "geometry"
      },
      {
        question: "如果 a² = 49，那么 a 的可能值是？",
        options: ["7", "-7", "7或-7", "14"],
        correct: "7或-7",
        difficulty: "medium",
        type: "algebra"
      },
      {
        question: "圆的周长公式是？",
        options: ["2πr", "πr²", "πd", "A和C都正确"],
        correct: "A和C都正确",
        difficulty: "easy",
        type: "geometry"
      },
      {
        question: "如果 log₂x = 5，那么 x 等于？",
        options: ["10", "16", "25", "32"],
        correct: "32",
        difficulty: "hard",
        type: "logarithm"
      },
      {
        question: "1 + 2 + 3 + ... + 100 的和是？",
        options: ["5000", "5050", "5100", "5150"],
        correct: "5050",
        difficulty: "medium",
        type: "sequence"
      },
      {
        question: "二次方程 x² - 5x + 6 = 0 的解是？",
        options: ["x=2,3", "x=1,6", "x=-2,-3", "x=-1,-6"],
        correct: "x=2,3",
        difficulty: "medium",
        type: "algebra"
      },
      {
        question: "直角三角形的斜边长度公式是？",
        options: ["a² + b² = c²", "a + b = c", "a × b = c", "a ÷ b = c"],
        correct: "a² + b² = c²",
        difficulty: "easy",
        type: "geometry"
      }
    ]
    
    return puzzles[Math.floor(Math.random() * puzzles.length)]
  }

  static generateByDifficulty(difficulty) {
    const allPuzzles = [
      // 简单难度
      {
        question: "2 + 2 × 2 = ?",
        options: ["6", "8", "4", "10"],
        correct: "6",
        difficulty: "easy"
      },
      {
        question: "正方形的周长公式是？",
        options: ["4a", "a²", "2(a+b)", "πr²"],
        correct: "4a",
        difficulty: "easy"
      },
      // 中等难度
      {
        question: "解方程：2x - 8 = 12",
        options: ["x=10", "x=8", "x=12", "x=6"],
        correct: "x=10",
        difficulty: "medium"
      },
      // 困难难度
      {
        question: "三角函数 sin(90°) 的值是？",
        options: ["1", "0", "0.5", "√2/2"],
        correct: "1",
        difficulty: "hard"
      }
    ]
    
    const filtered = difficulty 
      ? allPuzzles.filter(p => p.difficulty === difficulty)
      : allPuzzles
    
    return filtered[Math.floor(Math.random() * filtered.length)]
  }

  static getPuzzleCount() {
    return 8 // 返回可用的谜题数量
  }
}

export default MathPuzzleGenerator