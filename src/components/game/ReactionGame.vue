<template>
  <div class="reaction-game">
    <h3>反应力测试</h3>
    <div class="area">
      <button v-if="!started" @click="start">开始测试</button>
      <div v-else class="box" :class="{ green: showGreen }" @click="onClick"></div>
    </div>
    <div v-if="finished" class="result">
      <p>反应时间：{{ time }} ms</p>
      <button @click="$emit('complete', { time })">继续</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const started = ref(false)
const showGreen = ref(false)
const finished = ref(false)
const time = ref(0)
let startTs
let timeoutId

function start() {
  started.value = true
  finished.value = false
  showGreen.value = false
  // 随机延迟
  const delay = 800 + Math.random() * 1500
  timeoutId = setTimeout(() => {
    showGreen.value = true
    startTs = performance.now()
  }, delay)
}

function onClick() {
  if (!showGreen.value) return
  const dt = performance.now() - startTs
  time.value = Math.round(dt)
  finished.value = true
  showGreen.value = false
  started.value = false
  clearTimeout(timeoutId)
}
</script>

<style scoped>
.area { text-align:center; margin:12px }
.box { width:160px; height:120px; background:#333; margin:12px auto; border-radius:8px; }
.box.green { background: #4caf50 }
.result { margin-top:10px }
</style>
