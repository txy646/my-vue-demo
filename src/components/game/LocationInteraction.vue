<template>
  <div class="location-interaction">
    <div class="location-header">
      <h2>{{ location.icon }} {{ location.name }}</h2>
      <p>{{ locationDescription }}</p>
    </div>
    
    <div class="location-content">
  <!-- 图书馆 -->
  <div v-if="location.id === 'library'" class="library-game">
        <div class="game-instruction">
          <p>在下列书中找出 <strong class="target-book">《古文字详解》</strong>：</p>
        </div>
        
        <div class="books-grid">
          <button
            v-for="book in shuffledBooks"
            :key="book"
            class="book-btn"
            :class="{ correct: selectedBook === '古文字详解' && book === '古文字详解', incorrect: selectedBook === book && book !== '古文字详解' }"
            @click="selectBook(book)"
            :disabled="gameCompleted"
          >
            {{ book }}
          </button>
        </div>
        
        <div v-if="gameCompleted" class="game-result">
          <p v-if="selectedBook === '古文字详解'" class="success">🎉 找到了正确的书籍！幸运值 +10</p>
          <p v-else class="error">❌ 找错了书籍，请再试一次</p>
          
          <GameButton @click="completeLibrary">
            {{ selectedBook === '古文字详解' ? '继续冒险' : '重新尝试' }}
          </GameButton>
        </div>
      </div>
      
      <!-- 第二关：数字谜题 -->
      <MathPuzzle v-else-if="location.id === 'temple'" @complete="onMiniComplete" />

      <!-- 第三关：反应力 -> 打蝙蝠 -->
      <div v-else-if="location.id === 'cave'">
        <ReactionGame v-if="!reactionDone" @complete="onReactionComplete" />
        <BatFight v-else @complete="onBatComplete" />
      </div>

      <!-- 第四关：采蘑菇 -->
      <MushroomPicker v-else-if="location.id === 'forest'" @complete="onMushroomComplete" />

      <!-- 默认占位 -->
      <div v-else class="location-placeholder">
        <p>{{ location.name }}的冒险内容正在开发中...</p>
        <GameButton @click="completePlaceholder">
          模拟完成
        </GameButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import GameButton from '@/components/common/GameButton.vue'
import MathPuzzle from '@/components/game/MathPuzzle.vue'
import ReactionGame from '@/components/game/ReactionGame.vue'
import BatFight from '@/components/game/BatFight.vue'
import MushroomPicker from '@/components/game/MushroomPicker.vue'

const props = defineProps({
  location: Object
})

const emit = defineEmits(['complete', 'close'])

const gameStore = useGameStore()

// 图书馆游戏状态
const books = ref(['天工开物', '山海经', '本草纲目', '古文字详解', '易经', '诗经', '史记', '资治通鉴'])
const shuffledBooks = ref([])
const selectedBook = ref('')
const gameCompleted = ref(false)

const locationDescription = computed(() => {
  const descriptions = {
    library: '尘封的书卷散发着微光，你决定寻找关于古文字的线索...',
    temple: '石柱间传来低语，似乎要考验你的智慧...',
    cave: '黑暗中闪现宝石的寒光，也潜藏危险...',
    forest: '荧光蘑菇指引前方，也许有珍稀药草...'
  }
  return descriptions[props.location.id] || '神秘的地点等待着你的探索...'
})

// 初始化图书馆游戏
onMounted(() => {
  if (props.location.id === 'library') {
    shuffledBooks.value = [...books.value].sort(() => Math.random() - 0.5)
  }
})

// 新小游戏状态
const reactionDone = ref(false)

const onMiniComplete = (payload) => {
  // MathPuzzle 完成回调
  emit('complete', payload)
}

const onReactionComplete = (payload) => {
  reactionDone.value = true
}

const onBatComplete = (payload) => {
  // 胜利后奖励并完成关卡
  gameStore.addLog('击败洞穴蝙蝠！', 'success')
  gameStore.updatePlayerStats({ gold: gameStore.player.gold + 80 })
  emit('complete', { success: true, rewards: { gold: 80 } })
}

const onMushroomComplete = (payload) => {
  gameStore.addLog('采蘑菇完成', 'success')
  gameStore.updatePlayerStats({ gold: gameStore.player.gold + 50 })
  emit('complete', { success: true, rewards: { gold: 50 } })
}

const selectBook = (book) => {
  if (gameCompleted.value) return
  
  selectedBook.value = book
  gameCompleted.value = true
  
  if (book === '古文字详解') {
    gameStore.addLog('在图书馆找到了《古文字详解》！', 'success')
  } else {
    gameStore.addLog(`找错了书籍：《${book}》`, 'error')
  }
}

const completeLibrary = () => {
  if (selectedBook.value === '古文字详解') {
    // 给予奖励
    gameStore.updatePlayerStats({ 
      luck: Math.min(100, gameStore.player.luck + 10),
      items: [...gameStore.player.items, '古文字详解']
    })
    emit('complete', { success: true, rewards: { gold: 50 } })
  } else {
    // 重新开始游戏
    selectedBook.value = ''
    gameCompleted.value = false
    shuffledBooks.value = [...books.value].sort(() => Math.random() - 0.5)
  }
}

const completePlaceholder = () => {
  gameStore.addLog(`完成了${props.location.name}的探索`, 'success')
  gameStore.updatePlayerStats({ gold: gameStore.player.gold + 30 })
  emit('complete', { success: true, rewards: { gold: 30 } })
}
</script>

<style scoped>
.location-interaction {
  max-width: 600px;
}

.location-header {
  text-align: center;
  margin-bottom: 20px;
}

.location-header h2 {
  color: #ffd700;
  margin-bottom: 10px;
}

.location-content {
  min-height: 200px;
}

/* 图书馆游戏样式 */
.library-game {
  text-align: center;
}

.game-instruction {
  margin-bottom: 20px;
}

.target-book {
  color: #ffd700;
  font-weight: bold;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin: 20px 0;
}

.book-btn {
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid #4169E1;
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1rem;
}

.book-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.book-btn.correct {
  background: rgba(0, 255, 0, 0.3);
  border-color: #00ff00;
  color: #90EE90;
}

.book-btn.incorrect {
  background: rgba(255, 0, 0, 0.3);
  border-color: #ff0000;
  color: #FF6B6B;
}

.book-btn:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.game-result {
  margin-top: 20px;
  padding: 15px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.3);
}

.success {
  color: #90EE90;
  font-weight: bold;
}

.error {
  color: #FF6B6B;
  font-weight: bold;
}

/* 占位内容样式 */
.location-placeholder {
  text-align: center;
  padding: 40px 20px;
}

.location-placeholder p {
  margin-bottom: 20px;
  color: #888;
  font-style: italic;
}
</style>