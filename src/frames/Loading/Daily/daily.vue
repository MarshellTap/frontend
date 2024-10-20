<script setup>
import Icon from "~/components/Icon/icon.vue";
import TurquoiseGradientButton from "~/components/TurquoiseGradientButton/turquoise-gradient-button.vue";
import {useStore} from "vuex";
import {computed, ref} from "vue";
import {useMutation} from "@vue/apollo-composable";
import {CLAIM_DAILY_REWARDS} from "~/queries.js";
import showPopup from "~/functions/showPopup.js";
import MainStyle from "../Main/main.module.css"
import DailyStyle from "./daily.module.css"
import AnimationsDaily from "./animations.module.css"
import Animation from "~/components/animation.vue";

const { mutate: mutateClaimDailyRewards, onError: onErrorClaimDailyRewards } = useMutation(CLAIM_DAILY_REWARDS, () => {
  return {
    variables: {},
  }
}, {
  fetchPolicy: 'no-cache',
})
const store = useStore()
const dailyRewards = computed(() => store.state.user.available_daily_rewards)

const loading = ref(false)

const claim = async () => {
  loading.value = true;
  const req = await mutateClaimDailyRewards();
  if (!req || !req.data | !req.data.claimDailyRewards) return
  const data = req.data.claimDailyRewards;
  await store.dispatch("user/setUserBalance", data.balance)
  await store.dispatch('preloader/setPreloader', false)
  return await store.dispatch('user/setUserAvailableDailyRewards', {status: false, amount: 0})
}

onErrorClaimDailyRewards((error) => {
  loading.value = false;
  return showPopup("error", error.message)
})
</script>

<template>
  <div :class="{ [MainStyle['loading-body']]: true }">
    <div :class="{ [DailyStyle['loading-daily-content']]: true }">
      <Animation name="loading-daily-icon" :animation-style="AnimationsDaily" :start-animation="true">
        <div :class="{ [DailyStyle['loading-daily-icon']]: true }"></div>
      </Animation>
      <Animation name="loading-daily-title" :animation-style="AnimationsDaily" :start-animation="true">
        <div :class="{ [DailyStyle['loading-daily-title']]: true }">Daily band rewards</div>
      </Animation>
      <Animation name="loading-daily-amount" :animation-style="AnimationsDaily" :start-animation="true">
        <div :class="{ [DailyStyle['loading-daily-amount']]: true }">
          <div :class="{ [DailyStyle['token-icon']]: true }">
            <Icon :class="{ [DailyStyle['styled-icon']]: true }" name="music-alt" />
          </div>
          <div :class="{ [DailyStyle['amount']]: true }">{{ dailyRewards.amount }}</div>
          <div :class="{ [DailyStyle['name']]: true }">Marshell points</div>
        </div>
      </Animation>
    </div>
    <Animation name="loading-bottom" :animation-style="AnimationsDaily" :start-animation="true">
      <div :class="{ [DailyStyle['loading-bottom']]: true }">
        <div :class="{ [DailyStyle['loading-bottom-info']]: true }">Check-in every day to get x2 points</div>
        <TurquoiseGradientButton icon="rock" name="Let’s rock" :disabled="loading" @click="claim" />
      </div>
    </Animation>
  </div>
</template>