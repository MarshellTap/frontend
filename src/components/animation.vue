<script setup>
import {computed, inject, onMounted, ref} from "vue";

const props = defineProps({
  animationStyle: Object,
  name: String,
  startAnimation: {
    type: Boolean,
    default: false
  }
})

const showSlot = ref(!props.startAnimation)

const enterFrom = computed(() => {
  if (!props.animationStyle[`${props.name}-enter-from`]) return
  return props.animationStyle[`${props.name}-enter-from`];
})
const enterTo = computed(() => {
  if (!props.animationStyle[`${props.name}-enter-to`]) return
  return props.animationStyle[`${props.name}-enter-to`];
})
const enterActive = computed(() => {
  if (!props.animationStyle[`${props.name}-enter-active`]) return
  return props.animationStyle[`${props.name}-enter-active`];
})

const leaveFrom = computed(() => {
  if (!props.animationStyle[`${props.name}-leave-from`]) return
  return props.animationStyle[`${props.name}-leave-from`];
})
const leaveTo = computed(() => {
  if (!props.animationStyle[`${props.name}-leave-to`]) return
  return props.animationStyle[`${props.name}-leave-to`];
})
const leaveActive = computed(() => {
  if (!props.animationStyle[`${props.name}-leave-active`]) return
  return props.animationStyle[`${props.name}-leave-active`];
})

onMounted(() => {
  if (!showSlot.value) {
    showSlot.value = true;
  }
})
</script>

<template>
  <Transition
      :enter-from-class="enterFrom"
      :enter-to-class="enterTo"
      :enter-active-class="enterActive"
      :leave-from-class="leaveFrom"
      :leave-to-class="leaveTo"
      :leave-active-class="leaveActive"
  >
    <slot v-if="showSlot" />
  </Transition>
</template>