<script setup>
import Icon from "~/components/Icon/icon.vue";
import TurquoiseGradientButton from "~/components/TurquoiseGradientButton/turquoise-gradient-button.vue";
import { useTonAddress, useTonConnectModal, useTonConnectUI } from "ton-ui-vue";
import MainStyle from "./main.module.css"
import Animation from "~/components/animation.vue";
import AnimationsWallet from "./animations.module.css"

const { open: openTonModal } = useTonConnectModal();
const address = useTonAddress();
const tonUi = useTonConnectUI()

const connectButton = () => {
  if (address.value) return;
  return openTonModal();
}

const disconnectWallet = () => {
  tonUi.tonConnectUI.value?.disconnect()
}
</script>

<template>
  <div :class="{ [MainStyle['wallet']]: true }">
    <Animation name="wallet-big-icon" :animation-style="AnimationsWallet" :start-animation="true">
      <div :class="{ [MainStyle['wallet-icon']]: true }">
        <Icon :class="{ [MainStyle['styled-icon']]: true }" name="gradient-turquoise-wallet" />
      </div>
    </Animation>
    <div :class="{ [MainStyle['coming-text']]: true }">
      <Animation name="wallet-coming-text-name" :animation-style="AnimationsWallet" :start-animation="true">
        <div :class="{ [MainStyle['name']]: true }">Wallet</div>
      </Animation>
      <Animation name="wallet-coming-text-describe" :animation-style="AnimationsWallet" :start-animation="true">
        <div :class="{ [MainStyle['describe']]: true }">Coming soon...</div>
      </Animation>
    </div>
    <Animation name="wallet-buttons" :animation-style="AnimationsWallet" :start-animation="true">
      <div :class="{ [MainStyle['wallet-buttons']]: true }">
        <TurquoiseGradientButton
            :class="{ [MainStyle['button-wallet-connect']]: true }"
            icon="wallet"
            :name="!address ? 'Connect wallet' : (address.substring(0, 18) + '...')"
            @click="connectButton"
        />
        <button
            v-if="address"
            type="button"
            :class="{ [MainStyle['button-logout']]: true }"
            @click="disconnectWallet"
        >
          <Icon :class="{ [MainStyle['styled-icon']]: true }" name="logout" />
        </button>
      </div>
    </Animation>
  </div>
</template>