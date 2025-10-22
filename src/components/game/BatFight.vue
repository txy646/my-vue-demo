<template>
  <div class="bat-fight">
    <h3>打洞穴蝙蝠</h3>
    <p>点击蝙蝠以击中它们，击中5次即胜利</p>
    <div class="arena">
      <div v-for="(b, idx) in bats" :key="idx" class="bat" :style="b.style" @click="hit(idx)">🦇</div>
    </div>
    <div class="status">击中次数: {{ hits }}/5</div>
    <div v-if="won" class="win">
      <p>胜利！</p>
      <button @click="$emit('complete', { victory: true })">返回</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const bats = ref(new Array(5).fill(0).map(() => ({ style: { left: Math.random()*80 + '%', top: Math.random()*60 + '%' } })))
const hits = ref(0)
const won = ref(false)

function hit(i) {
  hits.value++
  // 随机移动那只蝙蝠
  bats.value[i].style = { left: Math.random()*80 + '%', top: Math.random()*60 + '%' }
  if (hits.value >= 5) {
    won.value = true
  }
}
</script>

<style scoped>
.arena { position:relative; height:200px; background:rgba(0,0,0,0.4); border-radius:8px; }
.bat { position:absolute; font-size:2rem; cursor:pointer; }
.status { margin-top:8px }
.win { margin-top:12px }
</style>
