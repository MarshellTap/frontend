<script setup>
import {onMounted, ref} from "vue";
import StartGameStyle from "./start-game.module.css"
import Animation from "~/components/animation.vue";
import AnimationsStartGame from "./animations.module.css"

const current = ref(5)
const interval = ref()

onMounted(() => {
  current.value--;
  interval.value = setInterval(() => {
    current.value--;
    if (current.value === 1) {
      setTimeout(() => {
        current.value--;
      }, 50);
      clearInterval(interval.value)
    }
  }, 700);
})
</script>

<template>
  <Animation
      name="start-game"
      :animation-style="AnimationsStartGame"
  >
    <div
        :class="{ [StartGameStyle['animation-start-game']]: true }"
        v-if="current > 0"
    >
      <Animation name="animation-num" :animation-style="AnimationsStartGame">
        <div
            :class="{ [StartGameStyle['animation-num']]: true, [StartGameStyle['text-num']]: true }"
            v-if="current === 1"
        >
          Let’s rock
        </div>
      </Animation>
      <Animation name="animation-num" :animation-style="AnimationsStartGame">
      <div :class="{ [StartGameStyle['animation-num']]: true }" v-if="current === 2">1</div>
      </Animation>
      <Animation name="animation-num" :animation-style="AnimationsStartGame">
        <div :class="{ [StartGameStyle['animation-num']]: true }" v-if="current === 3">2</div>
      </Animation>
      <Animation name="animation-num" :animation-style="AnimationsStartGame">
        <div :class="{ [StartGameStyle['animation-num']]: true }" v-if="current === 4">3</div>
      </Animation>
    </div>
  </Animation>
</template>