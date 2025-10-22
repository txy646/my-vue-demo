<template>
  <div class="location-view">
    <NavigationBar />
    <div class="container">
      <h2>{{ locationData?.name }}</h2>
      <LocationInteraction
        v-if="locationData"
        :location="locationData"
        @complete="handleComplete"
        @close="handleClose"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavigationBar from '@/components/layout/NavigationBar.vue'
import LocationInteraction from '@/components/game/LocationInteraction.vue'
import { LOCATIONS } from '@/utils/constants'
import { useGameStore } from '@/stores/gameStore'
import { audioService } from '@/services/audioService'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const locationData = ref(LOCATIONS.find(l => l.id === id) || null)
const gameStore = useGameStore()

onMounted(() => {
  // 播放对应地点的背景音乐
  if (locationData.value) {
    audioService.playBGM(locationData.value.id)
  }
})

const handleComplete = (result) => {
  // 在 store 中查找当前步骤索引并完成
  const stepIndex = gameStore.steps.findIndex(s => s.location === id)
  if (stepIndex !== -1) {
    gameStore.completeStep(stepIndex)
  }
  router.push('/game')
}

const handleClose = () => {
  router.push('/game')
}
</script>

<style scoped>
.location-view .container {
  max-width: 900px;
  margin: 20px auto;
  background: rgba(0,0,0,0.6);
  border-radius: 10px;
  padding: 20px;
}
</style>