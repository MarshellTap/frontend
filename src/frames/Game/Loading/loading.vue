<script setup>
import {computed, inject, onMounted, ref} from "vue";
import LoadingStyle from "./loading.module.css"
import AnimationsLoading from "./animations.module.css"
import Animation from "~/components/animation.vue";
import {game} from "~/frames/Game/Content/game.controller.js";

const isLoading = inject('drop-game-loading')
const decorationLoadingText = ref(".")

const smallText = computed(() => {
  if (isLoading.value.type === 1) return "Search tracks"
  if (isLoading.value.type === 2) {
    const loadedTracks = game.tracks.filter(track => track.loaded).length,
        totalTracks = game.tracks.length;
    return `Audio content (${loadedTracks}/${totalTracks}) ${Math.trunc((loadedTracks / totalTracks) * 100)}%`;
  }
  return `Loading animations`;
})

const animateLoadingText = () => {
  setInterval(() => {
    if (decorationLoadingText.value.length === 3) {
      decorationLoadingText.value = ".";
    } else decorationLoadingText.value += ".";
  }, 250)
}

const titleLoadingText = computed(() => {
  let title = "Loading";
  title += decorationLoadingText.value;
  return title;
})

onMounted(() => animateLoadingText())
</script>

<template>
  <div :class="{ [LoadingStyle['loading-body']]: true }">
    <div :class="{ [LoadingStyle['loading-circle']]: true }"></div>
    <div :class="{ [LoadingStyle['loading-content']]: true }">
      <Animation name="loading-logo" :animation-style="AnimationsLoading" :start-animation="true">
        <div :class="{ [LoadingStyle['loading-logo']]: true }"></div>
      </Animation>
      <Animation name="loading-text" :animation-style="AnimationsLoading" :start-animation="true">
        <div :class="{ [LoadingStyle['loading-text']]: true }">{{ titleLoadingText }}</div>
      </Animation>
      <Animation name="loading-small-text" :animation-style="AnimationsLoading" :start-animation="true">
        <div :class="{ [LoadingStyle['loading-small-text']]: true }">{{ smallText }}</div>
      </Animation>
    </div>
  </div>
</template>