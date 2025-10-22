<template>
  <div class="game-progress">
    <div class="progress-container">
      <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      <div class="progress-text">{{ Math.round(progress) }}%</div>
    </div>
    
    <div class="steps">
      <div 
        v-for="(step, index) in steps" 
        :key="step.id"
        class="step"
        :class="getStepClass(step)"
        @click="handleStepClick(step, index)"
      >
        <div class="step-icon">{{ getStepIcon(step.id) }}</div>
        <div class="step-name">{{ step.name }}</div>
        <div v-if="step.completed" class="step-check">✅</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'

const gameStore = useGameStore()

const steps = computed(() => gameStore.steps)
const progress = computed(() => gameStore.progress)

const getStepClass = (step) => ({
  'active': step.active,
  'completed': step.completed,
  'disabled': !step.active && !step.completed
})

const getStepIcon = (stepId) => {
  const icons = {
    step1: '📖',
    step2: '🔍',
    step3: '🏛️',
    step4: '🗝️'
  }
  return icons[stepId] || '📍'
}

const handleStepClick = (step, index) => {
  if (step.active || step.completed) {
    emit('stepSelected', { step, index })
  }
}

const emit = defineEmits(['stepSelected'])
</script>

<style scoped>
.game-progress {
  width: 100%;
}

.progress-container {
  width: 100%;
  height: 30px;
  background: #333;
  border-radius: 15px;
  margin: 20px 0;
  overflow: hidden;
  position: relative;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #ff8c00, #ffd700);
  transition: width 0.5s ease;
  border-radius: 15px;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

.steps {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 20px 0;
  gap: 10px;
}

.step {
  flex: 1;
  min-width: 120px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 15px;
  text-align: center;
  margin-bottom: 15px;
  transition: all 0.3s ease;
  opacity: 0.5;
  cursor: pointer;
  position: relative;
  border: 2px solid transparent;
}

.step:hover:not(.disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.step.active {
  background: rgba(255, 215, 0, 0.2);
  border: 2px solid #ffd700;
  opacity: 1;
  transform: scale(1.05);
}

.step.completed {
  background: rgba(0, 255, 0, 0.2);
  border: 2px solid #00ff00;
  opacity: 1;
}

.step.disabled {
  cursor: not-allowed;
}

.step-icon {
  font-size: 2rem;
  margin-bottom: 10px;
}

.step-name {
  font-size: 0.9rem;
  font-weight: 500;
}

.step-check {
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 0.8rem;
}
</style>