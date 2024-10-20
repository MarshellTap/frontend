<script setup>
import MusicAltStyle from "./music-alt.module.css"
import {onMounted} from "vue";
import {useWebAppHapticFeedback} from "vue-tg";

const webAppHapticFeedback = useWebAppHapticFeedback();

const props = defineProps({
  size: String,
  rotate: Number,
  top: Number,
  left: Number,
})

onMounted(() => webAppHapticFeedback.impactOccurred('medium'))
</script>

<template>
  <div
      :class="{
        [MusicAltStyle['music-alt']]: true,
        [MusicAltStyle['size-' + props.size]]: true
      }"
      :style="{
        '--drop-game-animation-note-rotate': `${props.rotate}deg`,
        transform: `rotate(${props.rotate}deg) translateY(0)`,
        top: `${props.top}%`,
        left: `${props.left}%`
      }"
  >
    <div :class="{ [MusicAltStyle['music-alt-icon']]: true }"></div>
  </div>
</template>