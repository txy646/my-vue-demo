<template>
  <div class="treasure-map">
    <div class="panorama-container">
      <div 
        v-for="location in locationData" 
        :key="location.id"
        class="location"
        :class="getLocationClasses(location)"
        :style="getLocationStyle(location)"
        @click="handleLocationClick(location)"
      >
        <div class="location-icon">{{ location.icon }}</div>
        <div class="location-name">{{ location.name }}</div>
        <div class="loc-step-label">第{{ location.step }}关</div>
        <div v-if="isLocationExplored(location.id)" class="explored-label">已探索</div>
      </div>
    </div>
    
    <div class="adventurer" :style="adventurerStyle">
      <div class="adventurer-icon">🧙</div>
    </div>
    
    <div class="treasure-animation" :class="{ 'treasure-found': showTreasure }">
      💎
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'

const gameStore = useGameStore()

const locationData = [
  { id: 'library', name: '古老图书馆', icon: '📚', step: 1, x: 20, y: 30 },
  { id: 'temple', name: '神秘神庙', icon: '🏛️', step: 2, x: 60, y: 20 },
  { id: 'cave', name: '幽深山洞', icon: '🕳️', step: 3, x: 40, y: 60 },
  { id: 'forest', name: '魔法森林', icon: '🌲', step: 4, x: 80, y: 50 }
]

const adventurerStyle = computed(() => ({
  left: `${gameStore.adventurerPosition.x}%`,
  top: `${gameStore.adventurerPosition.y}%`
}))

const showTreasure = computed(() => gameStore.showTreasure)

const getLocationClasses = (location) => ({
  'explored': gameStore.isLocationExplored(location.id),
  'disabled': !gameStore.isLocationAccessible(location.id),
  'active-loc-anim': gameStore.isLocationAccessible(location.id)
})

const getLocationStyle = (location) => ({
  left: `${location.x}%`,
  top: `${location.y}%`
})

const isLocationExplored = (locationId) => {
  return gameStore.isLocationExplored(locationId)
}

import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

const router = useRouter()

const handleLocationClick = (location) => {
  if (gameStore.isLocationAccessible(location.id)) {
    router.push({ name: 'Location', params: { id: location.id } })
  }
}

onMounted(() => {
  // 尝试从存档恢复
  if (gameStore && typeof gameStore.restoreGame === 'function') {
    gameStore.restoreGame()
  }
})
</script>

<style scoped>
.treasure-map {
  flex: 2;
  height: 300px;
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%238B4513"/><path d="M10,10 L90,10 L90,90 L10,90 Z" fill="none" stroke="%23D2691E" stroke-width="2"/><circle cx="50" cy="50" r="5" fill="%23FFD700"/><path d="M30,30 L70,70 M70,30 L30,70" stroke="%23FFD700" stroke-width="1"/></svg>') repeat;
  border: 5px solid #8B4513;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
}

.panorama-container {
  position: relative;
  width: 100%;
  height: 100%;
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23654321" width="100" height="100"/><path d="M0 50 Q25 40 50 50 T100 50" fill="%23d2b48c"/></svg>');
  background-size: cover;
  border-radius: 10px;
}

.location {
  position: absolute;
  cursor: pointer;
  text-align: center;
  background: rgba(0, 0, 0, 0.7);
  padding: 8px 12px;
  border-radius: 10px;
  border: 2px solid transparent;
  transition: transform 0.3s, border-color 0.3s;
  color: #fff;
  min-width: 80px;
}

.location:hover:not(.disabled) {
  transform: scale(1.15);
  border-color: #ffd700;
}

.location.disabled {
  opacity: 0.4;
  pointer-events: none;
  filter: grayscale(0.7);
}

.location.explored {
  opacity: 0.5;
  pointer-events: none;
  filter: grayscale(0.8);
  border-color: #90EE90;
  background: rgba(0, 0, 0, 0.5);
}

.location.active-loc-anim {
  box-shadow: 0 0 20px 5px #ffd70088;
  z-index: 2;
}

.location-icon {
  font-size: 2rem;
  margin-bottom: 4px;
}

.location-name {
  font-size: 0.85rem;
  margin-bottom: 2px;
}

.loc-step-label {
  font-size: 0.7rem;
  color: #ffd700;
  margin-top: 2px;
}

.explored-label {
  font-size: 0.7rem;
  color: #90EE90;
  margin-top: 2px;
}

.adventurer {
  position: absolute;
  width: 40px;
  height: 40px;
  transition: all 2s ease;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

.adventurer-icon {
  font-size: 2rem;
  filter: drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.5));
}

.treasure-animation {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 4rem;
  opacity: 0;
  transition: opacity 0.5s ease;
  z-index: 5;
}

.treasure-found {
  opacity: 1;
  animation: bounce 1s infinite alternate;
}

@keyframes bounce {
  from { transform: translate(-50%, -50%) scale(1); }
  to { transform: translate(-50%, -50%) scale(1.2); }
}
</style>