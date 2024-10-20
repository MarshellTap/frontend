<script setup>
import LoadingModule from "./loading.module.css"
import MainStyle from "../Main/main.module.css"
import {computed, inject, onMounted, ref} from "vue";
import AnimationsLoading from "./animations.module.css"
import Animation from "~/components/animation.vue";

const appImages = inject('app-images')

const props = defineProps({
  state: Number
})

const decorationLoadingText = ref(".")

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

const descriptionLoadingText = computed(() => {
  if (props.state === 1) return "Initialize app"
  if (props.state === 2) {
    const appImagesCount = appImages.value.length,
      loadedAppImagesCount = appImages.value.filter(image => image.loaded).length;
    return `Let's get the pictures (${loadedAppImagesCount}/${appImagesCount}) ${Math.trunc((loadedAppImagesCount / appImagesCount) * 100)}%`
  }
  if (props.state === 3) return "We're running your information"
})

onMounted(() => animateLoadingText())
</script>

<template>
  <div :class="{ [MainStyle['loading-body']]: true }">
    <Animation name="loading-logo" :animation-style="AnimationsLoading" :start-animation="true">
      <div :class="{ [LoadingModule['loading-logo']]: true }"></div>
    </Animation>
    <Animation name="loading-text" :animation-style="AnimationsLoading" :start-animation="true">
      <div :class="{ [LoadingModule['loading-text']]: true }">{{ titleLoadingText }}</div>
    </Animation>
    <Animation name="loading-small-text" :animation-style="AnimationsLoading" :start-animation="true">
      <div :class="{ [LoadingModule['loading-small-text']]: true }">{{ descriptionLoadingText }}</div>
    </Animation>
  </div>
</template>