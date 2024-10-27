<script setup>
import { useStore } from 'vuex'
import {computed, onBeforeMount, provide, ref, watch} from 'vue'
import Layout from './layout.vue'
import Loading from './frames/Loading/Main/main.vue'
import OverError from "./components/OverError/over-error.vue"
import Notification from "~/components/Notification/notification.vue";
import Modal from "~/modal/Main/main.vue";
import {useWebApp, useWebAppBackButton, useWebAppTheme, useWebAppViewport} from "vue-tg";
import {useRoute, useRouter} from "vue-router";
import Sprite from "~/components/sprite.vue";

/* Images */
import BackgroundFirst from "~/assets/images/background-1.png";
import BandBannerIcon from "~/assets/images/band-banner-icon.png";
import DailyBandRewardsIcon from "~/assets/images/daily-band-rewards-icon.png";
import DropGameBackground from "~/assets/images/drop-game-background.png";
import DropGameTap from "~/assets/images/drop-game-tap.png";
import DropGameTestPlayer from "~/assets/images/drop-game-test-player.png";
import DropGameMusicAlt from "~/assets/images/drop-games-music-alt.png";
import GameCircleLoader from "~/assets/images/game-circle-loader.png";
import HomeGameBackground from "~/assets/images/home-game-background.png";
import LogoSquare from "~/assets/images/logo-square.png";
import NoImage from "~/assets/images/no-image.png";
import LandscapeError from "~/components/LandscapeError/landscape-error.vue";

const listOfAppImages = [
  {tag: 'background-1', component: BackgroundFirst},
  {tag: 'band-banner-icon', component: BandBannerIcon},
  {tag: 'daily-band-rewards-icon', component: DailyBandRewardsIcon},
  {tag: 'drop-game-background', component: DropGameBackground},
  {tag: 'drop-game-tap', component: DropGameTap},
  {tag: 'drop-game-test-player', component: DropGameTestPlayer},
  {tag: 'drop-game-music-alt', component: DropGameMusicAlt},
  {tag: 'game-circle-loader', component: GameCircleLoader},
  {tag: 'home-game-background', component: HomeGameBackground},
  {tag: 'logo-square', component: LogoSquare},
  {tag: 'no-image', component: NoImage},
  /* From CDN */
  {tag: 'cdn-no-avatar', component: import.meta.env.VITE_CDN_AVATARS_URI + "/no-avatar.png"}
];

const route = useRoute()
const router = useRouter()

const webApp = useWebApp()
const webAppTheme = useWebAppTheme()
const webAppBackButton = useWebAppBackButton()
const webAppViewport = useWebAppViewport()

const store = useStore()

const isMobile = ref(true)
// const isMobile = computed(() => webApp.platform && (webApp.platform === 'ios' || webApp.platform === 'android'))
const errorAvailable = computed(() => store.state.error.status)
const status = computed(() => store.state.preloader.status)
const notifications = computed(() => store.state.notifications)
const modal = computed(() => store.state.modal)
const preloaderStatus = computed(() => store.state.preloader.status)

watch(() => ({
  preloaderStatus: preloaderStatus.value,
  errorAvailable: errorAvailable.value,
  isMobile: isMobile.value,
  currentPath: route.path,
  modalActive: modal.value.active
}), (newObj) => {
  /* Header color */
  if (newObj.errorAvailable) {
    webAppTheme.setHeaderColor('#0d2928')
  } else if (!newObj.isMobile) {
    webAppTheme.setHeaderColor('#000000')
  } else if (newObj.modalActive) {
    webAppTheme.setHeaderColor(preloaderStatus.value ? '#131f1c' : '#000000')
  } else {
    webAppTheme.setHeaderColor(preloaderStatus.value ? '#1e1610' : '#000000')
  }
  /* Back button */
  if (
      !newObj.errorAvailable &&
      newObj.isMobile &&
      (
          newObj.modalActive ||
          newObj.currentPath !== "/"
      )
  ) {
    webAppBackButton.showBackButton();
  } else webAppBackButton.hideBackButton();
})

webAppBackButton.onBackButtonClicked(async () => {
  if (modal.value.active) {
    await store.dispatch('modal/setModalCloseAnimation', true)
    setTimeout(async () => {
      await store.dispatch('modal/setModalCloseAnimation', false)
      await store.dispatch('modal/setModalActive')
    }, 200)
  } else if (route.path !== "/") return router.back();
});

const appImages = ref(listOfAppImages.map(image => ({
  tag: image.tag,
  component: image.component,
  loaded: false
})))
const isRefPortrait = ref(null)

provide('app-modals', {
  'edit-avatar': {
    button: ref()
  },
  'game-select-track': {
    button: ref()
  }
})

provide('app-images', appImages)

const appNotificationsContent = ref()

provide('app-notifications', {
  button: ref(),
  content: appNotificationsContent
})

const offsetMainBottom = computed(() => {
  if (webApp.platform === 'ios') return '34px';
  return '15px';
})
const offsetModalBottom = computed(() => {
  if (webApp.platform === 'ios') return '34px';
  return '20px';
})
const offsetMoreBottom = computed(() => {
  if (webApp.platform === 'ios') return '34px';
  return '25px';
})

onBeforeMount(() => {
  webAppViewport.expand();
  webAppViewport.disableVerticalSwipes();
})
</script>

<template>
  <div
      :class="{
        [$style['main-container']]: true,
        [$style['main-is-landscape']]: !isRefPortrait?.isPortrait,
        [$style['main-is-full-width']]: !isMobile || !isRefPortrait?.isPortrait
      }"
      :style="{
        '--main-offset-bottom': offsetMainBottom,
        '--modal-offset-bottom': offsetModalBottom,
        '--more-offset-bottom': offsetMoreBottom
       }"
  >
    <!-- <div v-if="!isMobile" :class="{ [$style['not-mobile-device']]: true }">
      <div :class="{ [$style['logo']]: true }"></div>
      <span :class="{ [$style['text']]: true }">Login is only allowed from mobile devices</span>
    </div> -->
    <template >
      <Sprite />
      <template v-if="!errorAvailable">
        <Layout v-if="!status" />
        <Loading v-else-if="status" />
      </template>
      <OverError v-if="errorAvailable" />
      <div :class="{ [$style['game-notification']]: true }" ref="appNotificationsContent">
        <Notification
            v-for="item of notifications.popup"
            :key="item.id"
            :id="item.id"
            :type="item.type"
            :title="item.title"
            :message="item.message"
        />
      </div>
      <Modal />
      <LandscapeError ref="isRefPortrait" />
    </template>
  </div>
</template>

<style module>
:root {
  --main-offset-bottom: 0px;
  --more-offset-bottom: 0px;
  --modal-offset-bottom: 0px;
}
.main-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
  background-color: #000;
  margin: 0 auto;
  position: relative;
}
.main-container.main-is-landscape {
  pointer-events: none;
}
.main-container .not-mobile-device {
  display: flex;
  align-items: center;
  height: 100%;
  width: calc(100% - 30px);
  padding: 15px;
  justify-content: center;
  flex-direction: column;
  row-gap: 24px;
}
.main-container .not-mobile-device .logo {
  width: 100px;
  height: 100px;
  background-image: url("./assets/images/logo-square.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
.main-container .not-mobile-device .text {
  font-weight: 600;
  font-size: 28px;
  text-align: center;
  color: #fff;
}
.main-container.main-is-full-width {
  max-width: 100%;
}
.main-container:not(.main-is-full-width) {
  max-width: var(--max-width-main);
}
.game-notification {
  width: calc(100% - 20px);
  position: absolute;
  left: 10px;
  top: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  row-gap: 6px;
  z-index: 999;
  max-width: var(--max-width-main);
  transition: top 200ms ease-in-out;
}
</style>
