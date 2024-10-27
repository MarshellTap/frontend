<script setup>
import TurquoiseGradientButton from "~/components/TurquoiseGradientButton/turquoise-gradient-button.vue";
import Icon from "~/components/Icon/icon.vue";
import {integerSpaces} from "../../../functions/numberSpaces.js";
import {useStore} from "vuex";
import {computed, inject, ref} from "vue";
import {useMutation} from "@vue/apollo-composable";
import {CLAIM_BAND_EARN} from "~/queries.js";
import showPopup from "~/functions/showPopup.js";
import BalanceStyle from "./balance.module.css"
import GenericStyle from "~/assets/css/generic.module.css";
import Animation from "~/components/animation.vue";
import AnimationsBalance from "./animations.module.css"

const store = useStore()
const user = computed(() => store.state.user)

const loading = ref(false)
const balanceLoading = inject('band-loading')

const { mutate: mutateClaimBandEarn, onError: onErrorClaimBandEarn } = useMutation(CLAIM_BAND_EARN, () => {
  return {
    variables: {},
  }
}, {
  fetchPolicy: 'no-cache',
})

const claim = async () => {
  const req = await mutateClaimBandEarn();
  if (!req || !req.data || !req.data.claimBandEarn) return
  const data = req.data.claimBandEarn
  loading.value = false
  await store.dispatch("user/setUserBandAvailable", 0)
  await store.dispatch("user/setUserBalance", data.balance)
  return showPopup("success", "You got +" + data.amount + " notes!")
}

onErrorClaimBandEarn(error => {
  loading.value = false;
  return showPopup("error", error.message);
})
</script>

<template>
  <Animation name="balance" :animation-style="AnimationsBalance" :start-animation="true">
    <div :class="{ [BalanceStyle['balance']]: true, [GenericStyle['border-gradient']]: true }">
      <div :class="{ [BalanceStyle['left-blocks']]: true }">
        <div :class="{ [BalanceStyle['balance-icon']]: true, [GenericStyle['border-gradient']]: true }">
          <Icon :class="{ [BalanceStyle['styled-icon']]: true }" name="wallet" />
        </div>
        <div :class="{ [BalanceStyle['info']]: true }">
          <div :class="{ [BalanceStyle['title']]: true }">You earned</div>
          <div :class="{ [BalanceStyle['amount-value']]: true }">
            <Icon :class="{ [BalanceStyle['styled-icon']]: true }" name="opacity-background-music-alt" />
            <span :class="{ [BalanceStyle['amount']]: true, [BalanceStyle['amount-loading']]: balanceLoading }">{{ integerSpaces(user.band.available) }}</span>
          </div>
        </div>
      </div>
      <TurquoiseGradientButton
          :disabled="balanceLoading || loading || !user.band.available"
          :class="{ [BalanceStyle['balance-button']]: true }"
          name="Claim"
          @click="claim"
      />
    </div>
  </Animation>
</template>
