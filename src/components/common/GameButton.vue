<template>
  <button 
    class="game-button"
    :class="[buttonClass, { disabled: disabled }]"
    :type="type"
    :disabled="disabled"
    @click="handleClick"
  >
    <span class="button-content">
      <span v-if="$slots.icon" class="button-icon">
        <slot name="icon"></slot>
      </span>
      <span class="button-text">
        <slot></slot>
      </span>
    </span>
  </button>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'submit', 'reset'].includes(value)
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger', 'success'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const buttonClass = computed(() => {
  return `variant-${props.variant} size-${props.size}`
})

const handleClick = (event) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<style scoped>
.game-button {
  padding: 12px 25px;
  border: none;
  border-radius: 50px;
  color: #000;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  font-family: inherit;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.game-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.game-button:hover::before {
  left: 100%;
}

.game-button:hover:not(.disabled) {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.4);
}

.game-button:active:not(.disabled) {
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
}

.game-button.disabled {
  background: #666 !important;
  color: #999 !important;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

/* 变体样式 */
.variant-primary {
  background: linear-gradient(135deg, #ff8c00, #ffd700);
}

.variant-secondary {
  background: linear-gradient(135deg, #4169E1, #6495ED);
  color: white !important;
}

.variant-danger {
  background: linear-gradient(135deg, #DC143C, #FF6347);
  color: white !important;
}

.variant-success {
  background: linear-gradient(135deg, #32CD32, #90EE90);
  color: white !important;
}

/* 尺寸样式 */
.size-small {
  padding: 8px 16px;
  font-size: 0.85rem;
}

.size-medium {
  padding: 12px 25px;
  font-size: 1rem;
}

.size-large {
  padding: 16px 32px;
  font-size: 1.1rem;
}

/* 内容样式 */
.button-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.button-icon {
  display: flex;
  align-items: center;
}

.button-text {
  white-space: nowrap;
}
</style>