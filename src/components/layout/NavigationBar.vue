<template>
  <nav class="navigation-bar">
    <div class="nav-container">
      <div class="nav-brand">
        <router-link to="/" class="brand-link">
          🗺️ 寻宝之旅
        </router-link>
      </div>
      
      <div class="nav-menu">
        <router-link 
          to="/game" 
          class="nav-link"
          :class="{ active: $route.name === 'Game' }"
        >
          🎮 开始游戏
        </router-link>
        
        <router-link 
          to="/leaderboard" 
          class="nav-link"
          :class="{ active: $route.name === 'Leaderboard' }"
        >
          🏆 排行榜
        </router-link>
        
        <template v-if="userStore.isLoggedIn">
          <router-link 
            to="/user" 
            class="nav-link"
            :class="{ active: $route.name === 'UserManagement' }"
          >
            👤 {{ userStore.currentUser?.username }}
          </router-link>
          
          <button @click="handleLogout" class="nav-link logout-btn">
            🚪 退出
          </button>
        </template>
        
        <template v-else>
          <router-link 
            to="/login" 
            class="nav-link"
            :class="{ active: $route.name === 'Login' }"
          >
            🔑 登录/注册
          </router-link>
        </template>
      </div>
      
      <div class="mobile-menu-btn" @click="toggleMobileMenu">
        ☰
      </div>
    </div>
    
    <!-- 移动端菜单 -->
    <div v-if="showMobileMenu" class="mobile-menu">
      <router-link 
        to="/game" 
        class="mobile-nav-link"
        @click="closeMobileMenu"
      >
        🎮 开始游戏
      </router-link>
      
      <router-link 
        to="/leaderboard" 
        class="mobile-nav-link"
        @click="closeMobileMenu"
      >
        🏆 排行榜
      </router-link>
      
      <template v-if="userStore.isLoggedIn">
        <router-link 
          to="/user" 
          class="mobile-nav-link"
          @click="closeMobileMenu"
        >
          👤 {{ userStore.currentUser?.username }}
        </router-link>
        
        <button @click="handleMobileLogout" class="mobile-nav-link logout-btn">
          🚪 退出
        </button>
      </template>
      
      <template v-else>
        <router-link 
          to="/login" 
          class="mobile-nav-link"
          @click="closeMobileMenu"
        >
          🔑 登录/注册
        </router-link>
      </template>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useGameStore } from '@/stores/gameStore'

const userStore = useUserStore()
const gameStore = useGameStore()
const router = useRouter()

const showMobileMenu = ref(false)

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
}

const handleLogout = () => {
  userStore.logout()
  gameStore.resetGame()
  router.push('/')
}

const handleMobileLogout = () => {
  handleLogout()
  closeMobileMenu()
}
</script>

<style scoped>
.navigation-bar {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 2px solid #ffd700;
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
}

.nav-brand {
  font-size: 1.5rem;
  font-weight: bold;
}

.brand-link {
  color: #ffd700;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
}

.brand-link:hover {
  color: #ffed4e;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 15px;
}

.nav-link {
  color: #fff;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 20px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
}

.nav-link:hover {
  background: rgba(255, 215, 0, 0.1);
  border-color: #ffd700;
  color: #ffd700;
}

.nav-link.active {
  background: rgba(255, 215, 0, 0.2);
  border-color: #ffd700;
  color: #ffd700;
}

.logout-btn {
  background: rgba(220, 20, 60, 0.2);
  border-color: #dc143c;
  color: #ff6b6b;
}

.logout-btn:hover {
  background: rgba(220, 20, 60, 0.3);
  border-color: #ff4757;
  color: #ff6b6b;
}

.mobile-menu-btn {
  display: none;
  font-size: 1.5rem;
  color: #fff;
  cursor: pointer;
  padding: 8px;
}

.mobile-menu {
  display: none;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.95);
  border-top: 1px solid #444;
  padding: 10px 0;
}

.mobile-nav-link {
  color: #fff;
  text-decoration: none;
  padding: 12px 20px;
  border-bottom: 1px solid #333;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.3s;
}

.mobile-nav-link:hover {
  background: rgba(255, 215, 0, 0.1);
  color: #ffd700;
}

.mobile-nav-link:last-child {
  border-bottom: none;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nav-menu {
    display: none;
  }
  
  .mobile-menu-btn {
    display: block;
  }
  
  .mobile-menu {
    display: flex;
  }
}

@media (max-width: 480px) {
  .nav-container {
    padding: 0 15px;
  }
  
  .nav-brand {
    font-size: 1.3rem;
  }
}
</style>