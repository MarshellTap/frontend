<script setup>
import Header from './components/Header/header.vue'
import BottomMenu from './components/BottomMenu/bottom-menu.vue'
import {computed, ref, watch, provide} from "vue";
import {useRoute} from "vue-router";

const gameContainer = ref()
provide('layout-scroll', {
  top: () => {
    gameContainer.value.scrollTop = 0;
  },
  bottom: () => {
    gameContainer.value.scrollTop = 9999;
  }
})

const route = useRoute()
const disabledScroll = computed(() => {
  if (
      route.path === "/" ||
      route.path === "/wallet"
  ) return true
  return false
})
const isGame = computed(() => {
  if (route.path === "/game") return true
  return false
})

watch(() => route.path, () => {
  gameContainer.value.scrollTop = 0;
})
</script>

<template>
  <div
      :class="{
        [$style['game-container']]: true,
        [$style['game-is-started']]: isGame,
        [$style['game-disabled-scroll']]: disabledScroll
      }"
      ref="gameContainer"
  >
    <Header />
    <div :class="{ [$style['game-content']]: true }">
      <router-view></router-view>
    </div>
    <BottomMenu />
  </div>
</template>

<style module>
.game-container {
  background-color: #000;
  height: 100%;
  width: 100%;
}
.game-content {
  height: 100%;
}
.game-container:not(.game-is-started) .game-content {
  margin: 0 15px;
  width: calc(100% - 28px);
}
.game-container:not(.game-disabled-scroll):not(.game-is-started) .game-content {
  max-height: calc(calc(100% - 108px) - var(--main-offset-bottom));
}
.game-container:not(.game-is-started).game-disabled-scroll .game-content {
  max-height: calc(calc(100% - 170px) - var(--main-offset-bottom));
}
.game-container:not(.game-disabled-scroll).game-is-started .game-content {
  max-height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
.game-container.game-disabled-scroll,
.game-container.game-is-started {
  overflow: hidden;
}
.game-container:not(.game-disabled-scroll):not(.game-is-started) {
  overflow-y: auto;
  overflow-x: hidden;
  max-height: calc(100% - 63px);
}
.game-container::-webkit-scrollbar {
  display: none;
}
</style>