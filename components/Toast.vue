<template>
  <transition name="toast-fade">
    <div v-if="visible" class="toast" :class="type">
      {{ message }}
    </div>
  </transition>
</template>

<script setup lang="ts">
import { inject } from "vue";

const props = defineProps<{
  message: string;
  type?: "success" | "error" | "info";
  visible: boolean;
}>();

const showToast = inject("showToast") as (
  msg: string,
  type?: "success" | "error" | "info"
) => void;

</script>

<style scoped>
.toast {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  min-width: 200px;
  max-width: 90vw;
  background: #333;
  color: #fff;
  padding: 16px 32px;
  border-radius: 8px;
  font-size: 1rem;
  z-index: 9999;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
}
.toast.success {
  background: #28a745;
}
.toast.error {
  background: #dc3545;
}
.toast.info {
  background: #007bff;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: opacity 0.3s;
}
.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
}
</style>

<Toast v-bind="toast" />
