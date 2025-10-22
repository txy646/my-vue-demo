<template>
  <div class="login-view">
    <NavigationBar />
    
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1>🔑 欢迎来到寻宝之旅</h1>
          <p>登录或注册开始你的冒险</p>
        </div>
        
        <div class="login-tabs">
          <button 
            class="tab-btn" 
            :class="{ active: activeTab === 'login' }"
            @click="activeTab = 'login'"
          >
            登录
          </button>
          <button 
            class="tab-btn" 
            :class="{ active: activeTab === 'register' }"
            @click="activeTab = 'register'"
          >
            注册
          </button>
        </div>
        
        <!-- 登录表单 -->
        <form v-if="activeTab === 'login'" @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="login-username">用户名</label>
            <input
              id="login-username"
              v-model="loginForm.username"
              type="text"
              required
              placeholder="请输入用户名"
            />
          </div>
          
          <div class="form-group">
            <label for="login-password">密码</label>
            <input
              id="login-password"
              v-model="loginForm.password"
              type="password"
              required
              placeholder="请输入密码"
            />
          </div>
          
          <GameButton 
            type="submit" 
            variant="primary" 
            :disabled="loading"
            class="submit-btn"
          >
            {{ loading ? '登录中...' : '🎮 开始冒险' }}
          </GameButton>
          
          <div v-if="loginError" class="error-message">
            {{ loginError }}
          </div>
        </form>
        
        <!-- 注册表单 -->
        <form v-else @submit.prevent="handleRegister" class="login-form">
          <div class="form-group">
            <label for="register-username">用户名</label>
            <input
              id="register-username"
              v-model="registerForm.username"
              type="text"
              required
              placeholder="请输入用户名"
              minlength="3"
              maxlength="20"
            />
          </div>
          
          <div class="form-group">
            <label for="register-email">邮箱</label>
            <input
              id="register-email"
              v-model="registerForm.email"
              type="email"
              required
              placeholder="请输入邮箱"
            />
          </div>
          
          <div class="form-group">
            <label for="register-password">密码</label>
            <input
              id="register-password"
              v-model="registerForm.password"
              type="password"
              required
              placeholder="请输入密码"
              minlength="6"
            />
          </div>
          
          <div class="form-group">
            <label for="register-confirm">确认密码</label>
            <input
              id="register-confirm"
              v-model="registerForm.confirmPassword"
              type="password"
              required
              placeholder="请再次输入密码"
            />
          </div>
          
          <GameButton 
            type="submit" 
            variant="success" 
            :disabled="loading"
            class="submit-btn"
          >
            {{ loading ? '注册中...' : '✨ 创建账号' }}
          </GameButton>
          
          <div v-if="registerError" class="error-message">
            {{ registerError }}
          </div>
        </form>
        
        <div class="login-footer">
          <p>加入我们，探索神秘的宝藏世界！</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import NavigationBar from '@/components/layout/NavigationBar.vue'
import GameButton from '@/components/common/GameButton.vue'

const userStore = useUserStore()
const router = useRouter()

const activeTab = ref('login')
const loading = ref(false)
const loginError = ref('')
const registerError = ref('')

const loginForm = ref({
  username: '',
  password: ''
})

const registerForm = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const handleLogin = async () => {
  if (loading.value) return
  
  loading.value = true
  loginError.value = ''
  
  try {
    const success = userStore.login(loginForm.value)
    
    if (success) {
      router.push('/game')
    } else {
      loginError.value = '用户名或密码错误'
    }
  } catch (error) {
    loginError.value = '登录失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

const handleRegister = async () => {
  if (loading.value) return
  
  // 表单验证
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    registerError.value = '两次输入的密码不一致'
    return
  }
  
  if (registerForm.value.password.length < 6) {
    registerError.value = '密码长度至少6位'
    return
  }
  
  loading.value = true
  registerError.value = ''
  
  try {
    // 检查用户名是否已存在
    const existingUser = userStore.users.find(
      user => user.username === registerForm.value.username
    )
    
    if (existingUser) {
      registerError.value = '用户名已存在'
      return
    }
    
    // 注册用户
    userStore.register(registerForm.value)
    
    // 自动登录
    userStore.login({
      username: registerForm.value.username,
      password: registerForm.value.password
    })
    
    router.push('/game')
  } catch (error) {
    registerError.value = '注册失败，请稍后重试'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-view {
  background: linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d);
  min-height: 100vh;
  color: #fff;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 60px);
  padding: 20px;
}

.login-card {
  background: rgba(0, 0, 0, 0.8);
  border-radius: 15px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  width: 100%;
  max-width: 400px;
  border: 2px solid #ffd700;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h1 {
  color: #ffd700;
  margin-bottom: 10px;
  font-size: 1.8rem;
}

.login-header p {
  color: #ccc;
  margin: 0;
}

.login-tabs {
  display: flex;
  margin-bottom: 30px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 25px;
  padding: 4px;
}

.tab-btn {
  flex: 1;
  padding: 12px;
  border: none;
  background: transparent;
  color: #fff;
  cursor: pointer;
  border-radius: 20px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.tab-btn.active {
  background: #ffd700;
  color: #000;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #ffd700;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #444;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #ffd700;
}

.form-group input::placeholder {
  color: #888;
}

.submit-btn {
  width: 100%;
  margin-top: 10px;
}

.error-message {
  background: rgba(255, 107, 107, 0.2);
  border: 1px solid #ff6b6b;
  color: #ff6b6b;
  padding: 10px;
  border-radius: 8px;
  margin-top: 15px;
  text-align: center;
  font-size: 0.9rem;
}

.login-footer {
  text-align: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #444;
  color: #888;
}

.login-footer p {
  margin: 0;
}
</style>