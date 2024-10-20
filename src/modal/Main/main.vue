<script setup>
import Icon from "../../components/Icon/icon.vue";
import toggleModal from "~/functions/toggleModal.js";
import {useStore} from "vuex";
import {computed, inject, onMounted, onUnmounted, ref, watch} from "vue";
import {useRoute} from "vue-router";
import MainStyle from "./main.module.css"
import AnimationsMain from "./animations.module.css"

/* ContentsHeader */
import EditAvatarModalHeader from "../EditAvatar/header.vue"
import GameSelectTrackModalHeader from "../Game/SelectTrack/header.vue"

/* Contents */
import EditAvatarModal from "../EditAvatar/Main/main.vue"
import GameSelectTrackModal from "../Game/SelectTrack/Main/main.vue"
import Animation from "~/components/animation.vue";

const route = useRoute()
const store = useStore()
const modal = computed(() => store.state.modal)
const isAuth = computed(() => store.getters["user/isAuth"])
const drop_game = computed(() => store.state.drop_game)

watch(() => route.path, () => {
  if (modal.value.active) {
    toggleModal()
  }
})

const container = ref()

const appModals = inject('app-modals')
const appNotifications = inject('app-notifications')

const outside = (e) => {
  if (!modal.value.active) return
  if (
      !container.value ||
      (
          !container.value.contains(e.target) &&
          (
              appNotifications.content.value &&
              !appNotifications.content?.value.contains(e.target)
          )
      ) &&
      (
          !appModals[modal.value.selected] ||
          (
              appModals[modal.value.selected] &&
              (
                  appModals[modal.value.selected].button.value &&
                  !appModals[modal.value.selected].button?.value.contains(e.target)
              )
          )
      )
  ) {
    return toggleModal()
  }
}

onUnmounted(() => window.removeEventListener('click', outside))
onMounted(() => window.addEventListener('click', outside))
</script>

<template>
  <div
      v-if="modal.active"
      :data-current-modal="modal.selected"
      :class="{ [MainStyle['bottom-modal']]: true, [MainStyle[`bottom-modal-is-${!isAuth ? 'guest' : 'auth'}`]]: true }"
  >
    <Animation name="bottom-modal-container" :animation-style="AnimationsMain" :start-animation="true">
      <div
          :class="{ [MainStyle['bottom-modal-container']]: true }"
          v-if="!modal.closeAnimation"
          ref="container"
      >
        <div :class="{ [MainStyle['bottom-modal-body']]: true }">
          <div :class="{ [MainStyle['bottom-modal-header']]: true }">
            <EditAvatarModalHeader v-if="modal.selected === 'edit-avatar'" />
            <GameSelectTrackModalHeader v-else-if="route.path === '/game' && modal.selected === 'game-select-track' && !drop_game.started" :tracks="modal.props.tracks" />
            <button type="button" :class="{ [MainStyle['bottom-modal-header-exit']]: true }" @click="() => toggleModal()">
              <Icon :class="{ [MainStyle['styled-icon']]: true }" name="modal-close" />
            </button>
          </div>
          <div :class="{ [MainStyle['bottom-modal-content']]: true }">
            <EditAvatarModal v-if="modal.selected === 'edit-avatar'" v-bind="modal.props" />
            <GameSelectTrackModal v-else-if="route.path === '/game' && modal.selected === 'game-select-track' && !drop_game.started" v-bind="modal.props" />
          </div>
        </div>
      </div>
    </Animation>
    <Animation name="bottom-modal-backdrop" :animation-style="AnimationsMain">
      <div :class="{ [MainStyle['bottom-modal-backdrop']]: true }" v-if="!modal.closeAnimation"></div>
    </Animation>
  </div>
</template>