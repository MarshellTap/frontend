<script setup>
import {useWebAppNavigation} from "vue-tg";
import {useRouter} from "vue-router";
import {useStore} from "vuex";
import {computed, onMounted, ref, provide} from "vue";
import Icon from "~/components/Icon/icon.vue";
import TurquoiseGradientButton from "~/components/TurquoiseGradientButton/turquoise-gradient-button.vue";
import shareUrlBand from "~/functions/shareUrlBand.js";
import showPopup from "~/functions/showPopup.js";
import Balance from "~/frames/Band/Balance/balance.vue";
import {useLazyQuery} from "@vue/apollo-composable";
import {GET_BAND_INFO} from "~/queries.js";
import Table from "~/frames/Band/Table/table.vue";
import MainStyle from "./main.module.css"
import AnimationsMain from "./animations.module.css"
import Animation from "~/components/animation.vue";

const router = useRouter()
const store = useStore()
const user = computed(() => store.state.user)

const webAppNavigation = useWebAppNavigation()

const loading = ref(true)
provide('band-loading', loading)

const { load: getBand, onError: onErrorGetBand } = useLazyQuery(
    GET_BAND_INFO,
    {},
    {
      fetchPolicy: 'no-cache',
    }
)

const inviteToBand = () => webAppNavigation.openTelegramLink(shareUrlBand(user.value.band.code));
const copyUrl = () => {
  showPopup("info", "Invite link copied to clipboard");
  return navigator.clipboard.writeText(shareUrlBand(user.value.band.code, false));
}

const load = async () => {
  const req = await getBand();
  if (!req || !req.band) return
  const band = req.band
  await store.dispatch("user/setUserBandAvailable", band.available);
  loading.value = false;
}

onErrorGetBand(() => {
  router.push('/')
  return showPopup('error', "An error occurred while loading band")
})

onMounted(() => load())
</script>

<template>
  <div :class="{ [MainStyle['band']]: true }">
    <Animation name="band-banner" :animation-style="AnimationsMain" :start-animation="true">
      <div :class="{ [MainStyle['banner']]: true }">
        <div :class="{ [MainStyle['icon']]: true }"></div>
        <div :class="{ [MainStyle['title']]: true }">Invite friends earn notes</div>
      </div>
    </Animation>
    <div :class="{ [MainStyle['features']]: true }">
      <Animation name="band-features-first-item" :animation-style="AnimationsMain" :start-animation="true">
        <div :class="{ [MainStyle['item']]: true }">
          <Icon :class="{ [MainStyle['styled-icon']]: true }" name="band-features-icon" />
          <div :class="{ [MainStyle['info']]: true }">
            <div :class="{ [MainStyle['name']]: true }">Share your invite link</div>
            <div :class="{ [MainStyle['description']]: true }">To get more rewards</div>
          </div>
        </div>
      </Animation>
      <Animation name="band-features-last-item" :animation-style="AnimationsMain" :start-animation="true">
        <div :class="{ [MainStyle['item']]: true }">
          <Icon :class="{ [MainStyle['styled-icon']]: true }" name="band-features-icon" />
          <div :class="{ [MainStyle['info']]: true }">
            <div :class="{ [MainStyle['name']]: true }">Get +1000 notes for new registration</div>
            <div :class="{ [MainStyle['description']]: true }">Plus extra receive 10% of your mate Notes </div>
          </div>
        </div>
      </Animation>
    </div>
    <Balance />
    <div :class="{ [MainStyle['invite']]: true }">
      <Animation name="band-invite-share" :animation-style="AnimationsMain" :start-animation="true">
        <TurquoiseGradientButton :class="{ [MainStyle['invite-share']]: true }" icon="band-share-user" name="Invite to band" @click="inviteToBand" />
      </Animation>
      <Animation name="band-invite-copy" :animation-style="AnimationsMain" :start-animation="true">
        <TurquoiseGradientButton :class="{ [MainStyle['invite-copy']]: true }" icon="copy" :icon-width="24" @click="copyUrl" />
      </Animation>
    </div>
    <Table />
  </div>
</template>