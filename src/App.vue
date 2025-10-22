<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()

// 应用初始化
onMounted(() => {
  console.log('🎮 寻宝之旅应用已启动')
  
  // 可以在这里添加应用启动逻辑
  // 比如检查用户登录状态、加载设置等
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #1a1a1a;
  color: #fff;
  line-height: 1.6;
}

#app {
  min-height: 100vh;
}

/* 全局滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 215, 0, 0.5);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 215, 0, 0.7);
}

/* 全局动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 全局响应式工具类 */
.text-center {
  text-align: center;
}

.text-gold {
  color: #ffd700;
}

.text-success {
  color: #90EE90;
}

.text-error {
  color: #FF6B6B;
}

.mt-1 { margin-top: 0.5rem; }
.mt-2 { margin-top: 1rem; }
.mt-3 { margin-top: 1.5rem; }
.mb-1 { margin-bottom: 0.5rem; }
.mb-2 { margin-bottom: 1rem; }
.mb-3 { margin-bottom: 1.5rem; }

.p-1 { padding: 0.5rem; }
.p-2 { padding: 1rem; }
.p-3 { padding: 1.5rem; }
</style>