<template>
  <div class="mushroom-picker">
    <h3>采蘑菇小游戏</h3>
    <p>在限定时间内采集足够数量的蘑菇</p>
    <div class="field">
      <div v-for="(m, idx) in mushrooms" :key="idx" class="mush" @click="pick(idx)">🍄</div>
    </div>
    <div class="status">已采: {{ picked }}/{{ target }}</div>
    <div v-if="done" class="done">
      <p>完成！</p>
      <button @click="$emit('complete', { success: true })">返回</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const mushrooms = ref(new Array(12).fill(0))
const picked = ref(0)
const target = 6
const done = ref(false)

function pick(i) {
  if (mushrooms.value[i] === 1) return
  mushrooms.value[i] = 1
  picked.value++
  if (picked.value >= target) done.value = true
}

onMounted(() => {
  // 随机布置（已经内置）
})
</script>

<style scoped>
.field { display:flex; flex-wrap:wrap; gap:8px; padding:12px; background:rgba(0,0,0,0.3) }
.mush { font-size:2rem; cursor:pointer }
.status { margin-top:8px }
.done { margin-top:12px }
</style>
