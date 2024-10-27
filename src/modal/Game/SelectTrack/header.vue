<script setup>
import ModalMainStyle from "../../Main/main.module.css"

const props = defineProps({
  tracks: Array
})
</script>

<template>
  <div :class="{ [ModalMainStyle['bottom-modal-header-title']]: true }">Choose a Track ({{ props.tracks.filter(track => !track.next_timer).length }})</div>
</template>
