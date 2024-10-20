<script setup>
import {computed, onBeforeMount, onUnmounted, provide} from "vue";
import {useStore} from "vuex";
import Icon from "~/components/Icon/icon.vue";
import Item from "~/modal/Game/SelectTrack/Item/item.vue";
import CircleLoader from "../../../../components/CircleLoader/circle-loader.vue"
import MainStyle from "./main.module.css"
import GenericStyle from "~/assets/css/generic.module.css";

const props = defineProps({
  tracks: Array,
  start: Function,
  setTimer: Function
})

const store = useStore()

const sortedTracks = computed(() => {
  return props.tracks.sort((a, b) => a.next_timer - b.next_timer);
})

provide('drop-game-start-game', props.start)
provide('drop-game-set-track-timer', props.setTimer)

onUnmounted(() => store.dispatch('modal/setModalRender', false))
onBeforeMount(() => setTimeout(() => store.dispatch('modal/setModalRender', true), 100))
</script>

<template>
  <div :class="{ [MainStyle['select-track']]: true }">
    <div :class="{ [MainStyle['track-loading']]: true, [GenericStyle['d-none']]: true }">
      <CircleLoader :width="42" :height="42" :border-size="4" />
    </div>
    <div :class="{ [MainStyle['track-search']]: true, [GenericStyle['d-none']]: true, }">
      <Icon :class="{ [MainStyle['styled-icon']]: true }" name="search" />
      <input type="text" :class="{ [MainStyle['track-input']]: true }" placeholder="Enter track author or track name" />
    </div>
    <div :class="{ [MainStyle['list-title']]: true, [GenericStyle['d-none']]: true, }">
      Choose a Track <span :class="{ [MainStyle['amount']]: true }">({{ props.tracks.filter(track => !track.next_timer).length }})</span>
    </div>
    <div :class="{ [MainStyle['list-empty']]: true }" v-if="!props.tracks.length">Track list is empty</div>
    <div :class="{ [MainStyle['list-of-tracks']]: true }" v-else>
      <Item
        v-for="(track, i) of sortedTracks"
        :key="i"
        :item_id="track.id"
        :image="track.image"
        :author="track.author"
        :name="track.name"
        :next-timer="track.next_timer"
        :history-created-at="track.history_created_at"
      />
    </div>
  </div>
</template>