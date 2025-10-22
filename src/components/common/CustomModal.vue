<template>
	<div class="custom-modal" v-if="visible">
		<div class="overlay" @click="close"></div>
		<div class="dialog">
			<header class="dialog-header">
				<slot name="header">提示</slot>
				<button class="close-btn" @click="close">✕</button>
			</header>
			<section class="dialog-body">
				<slot>这里是模态内容</slot>
			</section>
			<footer class="dialog-footer">
				<slot name="footer">
					<button @click="close">关闭</button>
				</slot>
			</footer>
		</div>
	</div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
	visible: { type: Boolean, default: false }
})

const emit = defineEmits(['update:visible', 'close'])

function close() {
	emit('update:visible', false)
	emit('close')
}
</script>

<style scoped>
.custom-modal .overlay {
	position: fixed; inset: 0; background: rgba(0,0,0,0.5);
}
.custom-modal .dialog {
	position: fixed; left:50%; top:50%; transform:translate(-50%,-50%);
	background: #111; color:#fff; padding:16px; border-radius:8px; min-width:280px;
}
.dialog-header { display:flex; justify-content:space-between; align-items:center; }
.close-btn { background:transparent; border:none; color:#fff; cursor:pointer }
.dialog-body { margin-top:10px }
.dialog-footer { margin-top:12px; text-align:right }
</style>
