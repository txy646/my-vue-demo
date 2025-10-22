<template>
  <CustomModal :show="show" @close="$emit('close')" title="数学谜题">
    <div class="puzzle-modal">
      <div class="puzzle-content">
        <div class="puzzle-question">
          <h3>{{ currentPuzzle.question }}</h3>
        </div>
        
        <div class="puzzle-options">
          <button
            v-for="(option, index) in currentPuzzle.options"
            :key="index"
            class="puzzle-option"
            :class="getOptionClass(option)"
            @click="selectOption(option)"
            :disabled="answered"
          >
            {{ option }}
          </button>
        </div>
        
        <div v-if="showResult" class="puzzle-result" :class="resultClass">
          {{ resultMessage }}
        </div>
        
        <div class="puzzle-actions">
          <GameButton 
            v-if="answered" 
            @click="handleContinue"
          >
            {{ isCorrect ? '继续冒险' : '再试一次' }}
          </GameButton>
        </div>
      </div>
    </div>
  </CustomModal>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import CustomModal from '@/components/common/CustomModal.vue'
import GameButton from '@/components/common/GameButton.vue'

const props = defineProps({
  show: Boolean
})

const emit = defineEmits(['complete', 'close'])

const gameStore = useGameStore()

// 谜题状态
const currentPuzzle = ref(generatePuzzle())
const selectedOption = ref('')
const answered = ref(false)
const isCorrect = ref(false)

const showResult = computed(() => answered.value)
const resultClass = computed(() => isCorrect.value ? 'correct' : 'incorrect')
const resultMessage = computed(() => 
  isCorrect.value 
    ? '🎉 回答正确！幸运值 +10' 
    : `❌ 回答错误！正确答案是：${currentPuzzle.value.correct}`
)

function generatePuzzle() {
  const puzzles = [
    {
      question: "如果 3x + 5 = 20，那么 x 等于多少？",
      options: ["5", "6", "7", "8"],
      correct: "5"
    },
    {
      question: "一个三角形的三个内角分别是 30°、60° 和多少度？",
      options: ["90°", "120°", "150°", "180°"],
      correct: "90°"
    },
    {
      question: "如果 a² = 49，那么 a 的可能值是？",
      options: ["7", "-7", "7或-7", "14"],
      correct: "7或-7"
    },
    {
      question: "圆的周长公式是？",
      options: ["2πr", "πr²", "πd", "A和C都正确"],
      correct: "A和C都正确"
    },
    {
      question: "如果 log₂x = 5，那么 x 等于？",
      options: ["10", "16", "25", "32"],
      correct: "32"
    },
    {
      question: "1 + 2 + 3 + ... + 100 的和是？",
      options: ["5000", "5050", "5100", "5150"],
      correct: "5050"
    }
  ]
  
  return puzzles[Math.floor(Math.random() * puzzles.length)]
}

const getOptionClass = (option) => {
  if (!answered.value) return ''
  
  if (option === currentPuzzle.value.correct) {
    return 'correct'
  } else if (option === selectedOption.value) {
    return 'incorrect'
  }
  return ''
}

const selectOption = (option) => {
  if (answered.value) return
  
  selectedOption.value = option
  answered.value = true
  isCorrect.value = option === currentPuzzle.value.correct
  
  // 记录日志
  if (isCorrect.value) {
    gameStore.addLog('数学谜题解答正确！', 'success')
  } else {
    gameStore.addLog(`数学谜题解答错误！正确答案是：${currentPuzzle.value.correct}`, 'error')
  }
}

const handleContinue = () => {
  emit('complete', isCorrect.value)
  resetPuzzle()
}

const resetPuzzle = () => {
  currentPuzzle.value = generatePuzzle()
  selectedOption.value = ''
  answered.value = false
  isCorrect.value = false
}
</script>

<style scoped>
.puzzle-modal {
  max-width: 500px;
}

.puzzle-content {
  text-align: center;
}

.puzzle-question {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
}

.puzzle-question h3 {
  color: #fff;
  margin: 0;
  font-size: 1.2rem;
  line-height: 1.4;
}

.puzzle-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin: 20px 0;
}

.puzzle-option {
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid #4169E1;
  border-radius: 10px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1.1rem;
}

.puzzle-option:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.puzzle-option.correct {
  background: rgba(0, 255, 0, 0.3);
  border-color: #00ff00;
  color: #90EE90;
}

.puzzle-option.incorrect {
  background: rgba(255, 0, 0, 0.3);
  border-color: #ff0000;
  color: #FF6B6B;
}

.puzzle-option:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.puzzle-result {
  padding: 15px;
  border-radius: 8px;
  margin: 15px 0;
  font-weight: bold;
  font-size: 1.1rem;
}

.puzzle-result.correct {
  background: rgba(0, 255, 0, 0.2);
  border: 2px solid #00ff00;
  color: #90EE90;
}

.puzzle-result.incorrect {
  background: rgba(255, 0, 0, 0.2);
  border: 2px solid #ff0000;
  color: #FF6B6B;
}

.puzzle-actions {
  margin-top: 20px;
}
</style>