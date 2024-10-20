<script setup>
import TurquoiseGradientButton from "~/components/TurquoiseGradientButton/turquoise-gradient-button.vue";
import TurquoiseGradientButtonStyle from "~/components/TurquoiseGradientButton/turquoise-gradient-button.module.css";
import {computed, inject, onMounted, ref} from "vue";
import NoImage from "~/assets/images/no-image.png";
import secondsToHMS from "~/functions/secondsToHMS.js";
import moment from "moment";
import toggleModal from "~/functions/toggleModal.js";
import ItemStyle from "./item.module.css"
import Item from "~/modal/Game/SelectTrack/Item/item.vue";

const props = defineProps({
  item_id: Number,
  image: String,
  author: String,
  name: String,
  nextTimer: Number,
  historyCreatedAt: Number
})

const startGame = inject('drop-game-start-game')
const setTrackTimer = inject('drop-game-set-track-timer')

const calcSeconds = () => {
  if (props.nextTimer <= 0) return 0;
  const nowUnix = moment().unix()
  const time = props.nextTimer - (nowUnix - props.historyCreatedAt);
  return time > 0 ? time : 0;
}

const timer = ref({
  seconds: calcSeconds(),
  interval: null
})
const availableTimer = ref(timer.value.seconds > 0)
const buttonClickable = ref(true)
const buttonTimer = computed(() => secondsToHMS(timer.value.seconds))
const buttonTimerStyle = computed(() => {
  if (timer.value.seconds >= 3600) return 'more-than-hours';
  if (timer.value.seconds >= 60 && timer.value.seconds <= 3600) return 'more-than-minutes';
  return 'more-than-seconds';
})

const startTimer = () => {
  timer.value.interval = setInterval(() => {
    timer.value.seconds--;
    if (timer.value.seconds === 0) {
      clearInterval(timer.value.interval);
      setTrackTimer(props.item_id)
      availableTimer.value = false;
    }
  }, 1000);
}

const button = (item_id) => {
  if (!buttonClickable.value) return
  toggleModal()
  buttonClickable.value = false
  return startGame(item_id)
}

onMounted(() => {
  if (timer.value.seconds > 0) startTimer();
})
</script>

<template>
  <div :class="{ [ItemStyle['track-item']]: true }">
    <div :class="{ [ItemStyle['left-blocks']]: true }">
      <div :class="{ [ItemStyle['avatar']]: true }" :style="{ backgroundImage: `url(${props.image}), url(${NoImage})` }"></div>
      <div :class="{ [ItemStyle['info']]: true }">
        <div :class="{ [ItemStyle['title']]: true }">{{ props.author }}</div>
        <div :class="{ [ItemStyle['description']]: true }">{{ props.name }}</div>
      </div>
    </div>
    <TurquoiseGradientButton
        :class="{ [ItemStyle['button-select']]: true, [ItemStyle[buttonTimerStyle]]: availableTimer, [ItemStyle['button-disabled']]: availableTimer, [TurquoiseGradientButtonStyle['button-text-default']]: true }"
        :icon="!availableTimer ? 'game-play' : null"
        :disabled="availableTimer || !buttonClickable"
        :name="availableTimer ? buttonTimer : 'Play'"
        :icon-width="16"
        icon-color="#fff"
        @click="() => button(props.item_id)"
    />
  </div>
</template>