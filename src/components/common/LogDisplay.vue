<template>
  <div class="log-container">
    <div class="log-header">
      <h4>冒险日志</h4>
      <button @click="clearLogs" class="clear-btn" title="清空日志">🗑️</button>
    </div>
    <div class="log-content" ref="logContent">
      <div 
        v-for="log in logs" 
        :key="log.id"
        class="log-entry"
        :class="log.type"
      >
        <span class="log-time">[{{ log.timestamp }}]</span>
        <span class="log-message">{{ log.message }}</span>
      </div>
      <div v-if="logs.length === 0" class="empty-log">
        暂无日志记录...
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'

const gameStore = useGameStore()
const logContent = ref(null)

const logs = computed(() => gameStore.gameLogs)

// 自动滚动到底部
watch(logs, () => {
  nextTick(() => {
    if (logContent.value) {
      logContent.value.scrollTop = logContent.value.scrollHeight
    }
  })
}, { deep: true })

const clearLogs = () => {
  gameStore.gameLogs = []
}

// 初始化时滚动到底部
onMounted(() => {
  nextTick(() => {
    if (logContent.value) {
      logContent.value.scrollTop = logContent.value.scrollHeight
    }
  })
})
</script>

<style scoped>
.log-container {
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  padding: 15px;
  height: 200px;
  border: 1px solid #444;
  display: flex;
  flex-direction: column;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid #444;
}

.log-header h4 {
  color: #ffd700;
  margin: 0;
}

.clear-btn {
  background: none;
  border: none;
  color: #ff6b6b;
  cursor: pointer;
  font-size: 1rem;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.clear-btn:hover {
  background: rgba(255, 107, 107, 0.2);
}

.log-content {
  flex: 1;
  overflow-y: auto;
  padding-right: 5px;
}

.log-content::-webkit-scrollbar {
  width: 6px;
}

.log-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.log-content::-webkit-scrollbar-thumb {
  background: rgba(255, 215, 0, 0.5);
  border-radius: 3px;
}

.log-entry {
  padding: 8px;
  border-bottom: 1px solid #333;
  animation: fadeIn 0.5s ease;
  font-size: 0.9rem;
  line-height: 1.4;
}

.log-time {
  color: #888;
  font-size: 0.8rem;
  margin-right: 8px;
}

.log-message {
  color: #fff;
}

.log-entry.success .log-message {
  color: #90EE90;
}

.log-entry.error .log-message {
  color: #FF6B6B;
}

.log-entry.info .log-message {
  color: #87CEEB;
}

.log-entry.event .log-message {
  color: #FFA500;
}

.empty-log {
  text-align: center;
  color: #888;
  padding: 20px;
  font-style: italic;
}

@keyframes fadeIn {
  from { 
    opacity: 0; 
    transform: translateY(10px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}
</style>