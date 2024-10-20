<script setup>
import {useRouter} from "vue-router";
import {hideHeaderAndBottomMenu, showHeaderAndBottomMenu} from "~/functions/components.helper.js";
import {useStore} from "vuex";
import {onMounted, onUnmounted, provide, ref} from "vue";
import Game from "~/frames/Game/Content/content.vue";
import Loading from "~/frames/Game/Loading/loading.vue";
import {useLazyQuery} from "@vue/apollo-composable";
import {GET_DROP_GAME_TRACKS} from "~/queries.js";
import {Howl} from "howler"
import MainStyle from "./main.module.css"
import AnimationsMain from "./animations.module.css"
import Animation from "~/components/animation.vue";
import {game} from "~/frames/Game/Content/game.controller.js";

const router = useRouter()
const store = useStore()

const isLoading = ref({
  status: true,
  type: 1
})
const loadingInterval = ref()

provide('drop-game-loading', isLoading)

const { load: getDropGameTracks, onError: onErrorGetDropGameTracks } = useLazyQuery(
    GET_DROP_GAME_TRACKS,
    {},
    {
      fetchPolicy: 'no-cache',
    }
)

const loadRequest = async () => {
  const req = await getDropGameTracks();
  if (!req || !req.dropGameTracks) return;
  const data = req.dropGameTracks;
  game.tracks = data.map(track => ({
    ...track,
    manager: null,
    loaded: false
  }));
  Howler.mute(false);
  await loadTracks();
  loadingInterval.value = setInterval(() => {
    if (
        game.tracks.length === game.tracks.filter(track => track.loaded).length
    ) {
      clearInterval(loadingInterval.value)
      isLoading.value.type = 3
    }
  }, 300)
}

const loadTracks = async () => {
  isLoading.value.type = 2;
  for (const arrKey in game.tracks) {
    const track = game.tracks[arrKey];
    game.tracks[arrKey].manager = new Howl({
      src: track.source,
      autoplay: false,
      preload: true,
      volume: 1,
      html5: true,
      format: ['mp3', 'aac'],
      onload: () => {
        const image = new Image();
        image.src = track.image;
        image.onload = () => {
          game.tracks[arrKey].loaded = true;
        }
        image.onerror = () => {
          clearInterval(loadingInterval.value)
          return router.replace('/')
        }
      },
      onloaderror: () => {
        clearInterval(loadingInterval.value)
        return router.replace('/')
      }
    });
  }
}

onErrorGetDropGameTracks(error => {
  store.dispatch('error/setError', {
    status: true,
    title: "Error",
    description: error.message,
    button: {type: "success", name: "Refresh app", function: "reloadApp"}
  })
})

onMounted(() => {
  if (navigator && navigator.mediaSession) {
    navigator.mediaSession.setActionHandler('play', () => {});
    navigator.mediaSession.setActionHandler('pause', () => {});
  }
  hideHeaderAndBottomMenu()
  loadRequest()
})
onUnmounted(() => {
  showHeaderAndBottomMenu()
  if (loadingInterval.value) {
    clearInterval(loadingInterval.value)
  }
  game.tracks = [];
})
</script>

<template>
  <Animation name="show-drop-game" :animation-style="AnimationsMain" :start-animation="true">
    <div :class="{ [MainStyle['drop-game']]: true, [MainStyle['drop-game-is-loading']]: isLoading.status }">
      <Loading v-if="isLoading.status" />
      <Game v-if="!isLoading.status || isLoading.type > 2" />
    </div>
  </Animation>
</template>