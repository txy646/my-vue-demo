<template>
  <div class="user-avatar" :class="size" @click="handleClick">
    <div class="avatar-circle" :style="avatarStyle">
      {{ avatarText }}
    </div>
    <div v-if="showName" class="user-name">
      {{ userStore.currentUser?.username }}
    </div>
    <div v-if="showLevel" class="user-level">
      等级: {{ userLevel }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/userStore'

const props = defineProps({
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  showName: {
    type: Boolean,
    default: true
  },
  showLevel: {
    type: Boolean,
    default: false
  },
  clickable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const userStore = useUserStore()

const avatarText = computed(() => {
  if (!userStore.currentUser) return '?'
  return userStore.currentUser.username[0].toUpperCase()
})

const avatarStyle = computed(() => {
  const colors = [
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'
  ]
  const colorIndex = userStore.currentUser 
    ? userStore.currentUser.username.charCodeAt(0) % colors.length 
    : 0
  return {
    backgroundColor: colors[colorIndex]
  }
})

const userLevel = computed(() => {
  if (!userStore.currentUser) return 1
  const completed = userStore.currentUser.gameStats.completedGames
  return Math.floor(completed / 5) + 1
})

const handleClick = () => {
  if (props.clickable) {
    emit('click')
  }
}
</script>

<style scoped>
.user-avatar {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: v-bind('clickable ? "pointer" : "default"');
}

.user-avatar.small {
  gap: 6px;
}

.user-avatar.large {
  gap: 12px;
  flex-direction: column;
}

.avatar-circle {
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
}

.user-avatar:hover .avatar-circle {
  transform: v-bind('clickable ? "scale(1.1)" : "scale(1)"');
}

.user-avatar.small .avatar-circle {
  width: 32px;
  height: 32px;
  font-size: 0.9rem;
}

.user-avatar.medium .avatar-circle {
  width: 48px;
  height: 48px;
  font-size: 1.2rem;
}

.user-avatar.large .avatar-circle {
  width: 80px;
  height: 80px;
  font-size: 2rem;
}

.user-name {
  color: #fff;
  font-weight: 500;
}

.user-avatar.small .user-name {
  font-size: 0.9rem;
}

.user-avatar.medium .user-name {
  font-size: 1rem;
}

.user-avatar.large .user-name {
  font-size: 1.2rem;
  font-weight: bold;
}

.user-level {
  color: #ffd700;
  font-size: 0.8rem;
  background: rgba(255, 215, 0, 0.2);
  padding: 2px 8px;
  border-radius: 10px;
  border: 1px solid #ffd700;
}

.user-avatar.large .user-level {
  font-size: 0.9rem;
  padding: 4px 12px;
}
</style>