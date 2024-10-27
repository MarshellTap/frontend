<script setup>
import {useStore} from "vuex";
import {computed} from "vue";
import Icon from "~/components/Icon/icon.vue";
import {integerSpaces} from "../../functions/numberSpaces.js";
import TurquoiseGradientButton from "~/components/TurquoiseGradientButton/turquoise-gradient-button.vue";
import {useRouter} from "vue-router";
import NoImage from "../../assets/images/no-image.png";
import MainStyle from "./main.module.css"
import GenericStyle from "../../assets/css/generic.module.css"
import AnimationsHome from "./animations.module.css"
import Animation from "~/components/animation.vue";

const store = useStore()
const user = computed(() => store.state.user)

const router = useRouter()
</script>

<template>
  <div :class="{ [MainStyle['home']]: true }">
    <div :class="{ [MainStyle['home-user']]: true }">
      <Animation name="home-user-avatar" :animation-style="AnimationsHome" :start-animation="true">
        <div :class="{ [MainStyle['avatar']]: true }">
          <div :class="{ [MainStyle['avatar-img']]: true }" :style="{ 'background-image': `url(${user.avatar}), url(${NoImage})` }"></div>
        </div>
      </Animation>
      <Animation name="home-user-username" :animation-style="AnimationsHome" :start-animation="true">
        <div :class="{ [MainStyle['username']]: true }">{{ user.bandName }}</div>
      </Animation>
      <Animation name="home-user-balance" :animation-style="AnimationsHome" :start-animation="true">
        <div :class="{ [MainStyle['balance']]: true }">
          <div :class="{ [MainStyle['balance-icon']]: true }">
            <Icon :class="{ [MainStyle['styled-icon']]: true }" name="music-alt" />
          </div>
          <span :class="{ [MainStyle['amount']]: true }">{{ integerSpaces(user.balance) }}</span>
        </div>
      </Animation>
    </div>
    <div :class="{ [MainStyle['home-game']]: true }">
      <Animation name="home-game-card-game" :animation-style="AnimationsHome" :start-animation="true">
        <div :class="{ [MainStyle['card-game']]: true }">
          <div :class="{ [MainStyle['bottom']]: true }">
            <div :class="{ [MainStyle['info']]: true }">
              <div :class="{ [MainStyle['name']]: true }">Drop game</div>
              <div :class="{ [MainStyle['amount']]: true }">
                <Icon :class="{ [MainStyle['styled-icon']]: true }" name="gradient-background-music-alt" />
                <span :class="{ [MainStyle['text']]: true }">{{ integerSpaces(user.balance) }}</span>
              </div>
            </div>
            <button type="button" :class="{ [MainStyle['button-play']]: true }" @click="() => router.push('/game')">
              <span :class="{ [MainStyle['name']]: true }">Play</span>
              <Icon :class="{ [MainStyle['styled-icon']]: true }" name="game-play" />
            </button>
          </div>
        </div>
      </Animation>
      <Animation name="home-game-button" :animation-style="AnimationsHome" :start-animation="true">
        <TurquoiseGradientButton :class="{ [GenericStyle['d-none']]: true }" icon="rock" name="Let’s rock" />
      </Animation>
    </div>
  </div>
</template>