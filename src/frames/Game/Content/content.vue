<script setup>
import {computed, inject, onMounted, onUnmounted, ref, watch} from "vue";
import Icon from "~/components/Icon/icon.vue";
import {integerSpaces} from "../../../functions/numberSpaces.js";
import toggleModal from "~/functions/toggleModal.js";
import StartGame from "~/frames/Game/StartGame/start-game.vue";
import MusicAlt from "~/frames/Game/MusicAlt/music-alt.vue";
import {useStore} from "vuex";
import ContentStyle from "./content.module.css"
import AnimationsContent from "./animations.module.css"
import Animation from "~/components/animation.vue";
import {
  closeGame,
  game, initializePlayer,
  reset,
  setTrackTimer,
  spinePlayer,
  start,
  tap,
  toggleSound
} from "~/frames/Game/Content/game.controller.js";
import {useMutation} from "@vue/apollo-composable";
import {COMPLETE_DROP_GAME} from "~/queries.js";
import showPopup from "~/functions/showPopup.js";

const { mutate: mutateCompleteDropGame, onError: onErrorCompleteDropGame } = useMutation(COMPLETE_DROP_GAME, () => {
  return {
    variables: {
      track_id: game.track.info.id,
      notes: game.tap.amount
    },
  }
}, {
  fetchPolicy: 'no-cache',
})

const store = useStore()
const drop_game = computed(() => store.state.drop_game)

const isLoading = inject('drop-game-loading')
const appModals = inject('app-modals');
const countAvailableTracks = computed(() => game.tracks.filter(track => !track.next_timer).length);
const visibilityState = ref(document.visibilityState);
const playerContainer = ref();

watch(() => game.track.seek, (newSeek, oldSeek) => {
  const etd = newSeek - oldSeek;
  if (etd > 1) return game.track.info.manager.seek(oldSeek);
})

const handleVisibilityChange = () => {
  visibilityState.value = document.visibilityState;
}

const trackToggleText = computed(() => {
  if (!game.track.info.manager) return `Select track (${countAvailableTracks.value})`;
  return `${game.track.info.manager.playing() ? 'Playing' : 'Paused'}: ` + game.track.info.author + ' - ' + game.track.info.name;
})

const trackState = computed(() => {
  if (!game.track.info.manager) return;
  return {
    total: formatTime(game.track.duration),
    percent: Number((game.track.seek / game.track.duration) * 100).toFixed(2),
    current: formatTime(game.track.seek)
  }
})

const gameAlert = computed(() => {
  if (!game.track.info.manager) return 'Select a track and start the game';
  if (game.paused) return 'Tap on the screen to continue the game';
  return null;
})

const selectTrackToggler = () => {
  if (drop_game.value.started) return;
  return toggleModal('game-select-track', {
    tracks: game.tracks,
    start: start,
    setTimer: setTrackTimer
  })
}

watch(visibilityState, async (newState) => {
  if (newState === 'hidden') return await reset()
});

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

watch (playerContainer, async (newContainer) => {
  await initializePlayer(newContainer);
  setTimeout(() => {
    isLoading.value.status = false;
  }, 500);
});

onErrorCompleteDropGame(error => {
  showPopup("error", error.message);
})

onMounted(() => {
  game.graphql.mutate.end = mutateCompleteDropGame
  const preventDefaultActions = (event) => {
    event.preventDefault();
    event.stopPropagation();
  }
  document.addEventListener('keydown', preventDefaultActions);
  document.addEventListener('contextmenu', preventDefaultActions);
  document.addEventListener('touchstart', preventDefaultActions);
  document.addEventListener('visibilitychange', handleVisibilityChange);
})
onUnmounted(async () => {
  await reset();
  game.graphql.mutate.end = () => {};
  document.removeEventListener('visibilitychange', handleVisibilityChange);
})
</script>

<template>
  <div :class="{ [ContentStyle['drop-game-body']]: true }" @click="tap">
    <template v-if="!isLoading.status">
      <StartGame v-if="game.starting.status" />
      <div :class="{ [ContentStyle['drop-game-header']]: true, [ContentStyle['drop-game-header-show-audio-player']]: trackState }">
        <Animation name="drop-game-header-audio-player" :animation-style="AnimationsContent">
          <div :class="{ [ContentStyle['drop-game-header-audio-player']]: true }" v-if="trackState">
            <span :class="{ [ContentStyle['current-time']]: true }">{{ trackState.current }}</span>
            <span :class="{ [ContentStyle['total-time']]: true }">{{ trackState.total }}</span>
            <div :class="{ [ContentStyle['progress-line']]: true }" :style="{ width: `${trackState.percent}%` }"></div>
          </div>
        </Animation>
        <div :class="{ [ContentStyle['drop-game-header-main']]: true }">
          <Animation name="drop-game-header-main-button-home" :animation-style="AnimationsContent" :start-animation="true">
            <button type="button" :class="{ [ContentStyle['button']]: true }" @click="closeGame">
              <Icon :class="{ [ContentStyle['styled-icon']]: true }" name="drop-game-back" />
              <span :class="{ [ContentStyle['name']]: true }">Home</span>
            </button>
          </Animation>
          <div :class="{ [ContentStyle['right-header']]: true }">
            <Animation name="drop-game-header-main-select-track" :animation-style="AnimationsContent" :start-animation="true">
              <button :ref="appModals['game-select-track'].button" type="button" :class="{ [ContentStyle['button']]: true }" @click="selectTrackToggler">
                <Icon :class="{ [ContentStyle['styled-icon']]: true }" name="drop-game-note" />
                <span :class="{ [ContentStyle['name']]: true }">{{ trackToggleText }}</span>
              </button>
            </Animation>
            <Animation name="drop-game-header-main-right-mini" :animation-style="AnimationsContent" :start-animation="true">
              <button
                  type="button"
                  :class="{ [ContentStyle['button-mini']]: true, [ContentStyle['sound-on']]: game.sound.enable, [ContentStyle['sound-off']]: !game.sound.enable }"
                  @click="toggleSound"
              >
                <Icon :class="{ [ContentStyle['styled-icon']]: true }" :name="'drop-game-sound-' + (game.sound.enable ? 'on' : 'off')" />
                <span :class="{ [ContentStyle['name']]: true }">{{ game.sound.enable ? 'Sound enabled' : 'Sound disabled' }}</span>
              </button>
            </Animation>
          </div>
        </div>
      </div>
      <Animation
          name="drop-game-alert-content"
          :animation-style="AnimationsContent"
          :start-animation="true"
          v-if="gameAlert"
      >
        <div
            :class="{
            [ContentStyle['drop-game-alert']]: true,
            [ContentStyle['drop-game-alert-scale']]: game.alert.scale,
          }"
        >
          <div :class="{ [ContentStyle['drop-game-alert-content']]: true }">{{ gameAlert }}</div>
        </div>
      </Animation>
    </template>
    <!-- <div :class="{ [ContentStyle['drop-game-content']]: true }">
      <div :class="{ [ContentStyle['animation']]: true }">
        <div :class="{ [ContentStyle['list-of-notes-animations']]: true }" v-if="!isLoading.status">
          <MusicAlt
              v-for="animation of game.animations.items"
              :key="animation.uuid"
              :size="animation.size"
              :left="animation.left"
              :top="animation.top"
              :rotate="animation.rotate"
          />
        </div>
        <Animation name="drop-game-content-animation-tap-hint" :animation-style="AnimationsContent" v-if="!isLoading.status">
          <div :class="{ [ContentStyle['animation-tap-hint']]: true }" v-if="game.paused">
            <div :class="{ [ContentStyle['tap-icon']]: true }"></div>
          </div>
        </Animation>
        <Animation name="drop-game-content-animation-player" :animation-style="AnimationsContent" :start-animation="true">
          <div :class="{ [ContentStyle['player']]: true, [ContentStyle['player-loaded']]: !isLoading.status }" ref="playerContainer"></div>
        </Animation>
      </div>
      <Animation name="drop-game-animation-balance" :animation-style="AnimationsContent" :start-animation="true" v-if="!isLoading.status">
        <div :class="{ [ContentStyle['balance']]: true }">
          <div :class="{ [ContentStyle['balance-icon']]: true }">
            <Icon :class="{ [ContentStyle['styled-icon']]: true }" name="music-alt" />
          </div>
          <span :class="{ [ContentStyle['amount']]: true }">{{ integerSpaces(game.tap.amount) }}</span>
        </div>
      </Animation>
    </div> -->
  </div>
</template>