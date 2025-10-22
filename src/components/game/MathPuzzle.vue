<template>
  <div class="math-puzzle">
    <h3>数字谜题</h3>
    <p v-if="!answered">{{ question.text }}</p>
    <div v-if="!answered" class="options">
      <button v-for="(opt, idx) in options" :key="idx" @click="answer(opt)">{{ opt }}</button>
    </div>

    <div v-else class="result">
      <p v-if="correct" class="success">回答正确！幸运值 +10</p>
      <p v-else class="error">回答错误。正确答案：{{ question.answer }}</p>
      <button @click="returnPanorama">返回全景</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { audioService } from '@/services/audioService'
import { useGameStore } from '@/stores/gameStore'

const emit = defineEmits(['complete'])
const gameStore = useGameStore()

const pool = [
  { text: '12 + 7 = ?', options: [17, 18, 19, 20], answer: 19 },
  { text: '9 * 6 = ?', options: [54, 42, 48, 56], answer: 54 },
  { text: '81 / 9 = ?', options: [7,8,9,10], answer: 9 },
  { text: '15 - 4 = ?', options: [9,11,10,12], answer: 11 },
  { text: '7 * 8 = ?', options: [54,56,58,60], answer: 56 }
]

const question = ref({})
const options = ref([])
const answered = ref(false)
const correct = ref(false)

onMounted(() => {
  // 随机选择一道题
  const idx = Math.floor(Math.random() * pool.length)
  question.value = pool[idx]
  // 打乱选项
  options.value = [...question.value.options].sort(() => Math.random() - 0.5)
})

function answer(val) {
  answered.value = true
  correct.value = val === question.value.answer
  if (correct.value) {
    gameStore.updatePlayerStats({ luck: Math.min(100, gameStore.player.luck + 10) })
    gameStore.addLog('通过数字谜题，幸运值提升10', 'success')
  } else {
    gameStore.addLog('数字谜题答错', 'error')
  }
}

function returnPanorama() {
  // 暂停音乐
  audioService.pauseBGM && audioService.pauseBGM()
  emit('complete', { success: correct.value, rewards: correct.value ? { luck: 10 } : null })
}
</script>

<style scoped>
.math-puzzle { text-align:center }
.options button { margin:8px; padding:8px 12px }
.result { margin-top:12px }
.success { color:#90EE90 }
.error { color:#FF6B6B }
</style>
