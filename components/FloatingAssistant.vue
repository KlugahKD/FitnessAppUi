<template>
  <div class="fixed bottom-6 right-6 z-50">
    <!-- Collapsed state -->
    <div
      v-if="!open && visible"
      @click="toggleOpen"
      class="flex items-center gap-3 bg-white px-4 py-3 rounded-full shadow-xl cursor-pointer hover:scale-105 transition-transform"
    >
      <div class="w-10 h-10 rounded-full bg-A3F300 flex items-center justify-center text-white text-lg font-bold shadow-md animate-bounce-slow">
        🤖
      </div>
      <div class="text-sm font-semibold text-gray-800 relative">
        <span :class="isTyping ? 'typing-animation' : ''">Need any help?</span>
      </div>
    </div>

    <!-- Expanded chat -->
    <transition name="fade">
      <div
        v-if="open"
        class="w-[90vw] max-w-md h-[70vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      >
        <div class="bg-A3F300 px-4 py-3 flex items-center justify-between">
          <h2 class="text-black font-bold">Hi! I'm Ava 👋</h2>
          <button @click="toggleOpen" class="text-black hover:text-gray-700 text-xl">×</button>
        </div>
        <div class="flex-1 bg-gray-50 p-4 overflow-y-auto">
          <ChatBox />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import ChatBox from './ChatBox.vue'

const open = ref(false)
const visible = ref(true)
const isTyping = ref(true)

const toggleOpen = () => {
  open.value = !open.value
}

let loopInterval, typingTimeout

onMounted(() => {
  const cycle = () => {
    isTyping.value = true
    visible.value = true

    // Stop typing after 2.5s
    typingTimeout = setTimeout(() => {
      isTyping.value = false
    }, 2500)

    // Hide after 6s
    setTimeout(() => {
      if (!open.value) {
        visible.value = false
      }
    }, 16000)
  }

  // Run initial
  cycle()

  // Loop every 16s
  loopInterval = setInterval(() => {
    if (!open.value) cycle()
  }, 30000)
})

onBeforeUnmount(() => {
  clearInterval(loopInterval)
  clearTimeout(typingTimeout)
})
</script>

<style scoped>
.typing-animation {
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  border-right: 2px solid #000;
  width: 11ch;
  animation: typing 2s steps(11), blink 0.75s step-end infinite;
}

@keyframes typing {
  from {
    width: 0;
  }
  to {
    width: 11ch;
  }
}

@keyframes blink {
  50% {
    border-color: transparent;
  }
}

@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.animate-bounce-slow {
  animation: bounce-slow 2s infinite;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
