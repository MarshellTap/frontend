<script setup>
import WelcomeStyle from "./welcome.module.css"
import MainStyle from "../Main/main.module.css"
import {inject} from "vue";
import TurquoiseGradientButton from "~/components/TurquoiseGradientButton/turquoise-gradient-button.vue";
import AnimationsWelcome from "./animations.module.css"
import Animation from "~/components/animation.vue";

const changeState = inject('change-loading-state')
</script>

<template>
  <div :class="{ [MainStyle['loading-body']]: true }">
    <Animation name="loading-logo" :animation-style="AnimationsWelcome" :start-animation="true">
      <div :class="{ [WelcomeStyle['loading-logo']]: true }"></div>
    </Animation>
    <Animation name="loading-text" :animation-style="AnimationsWelcome" :start-animation="true">
      <div :class="{ [WelcomeStyle['loading-text']]: true }">
        <div :class="{ [WelcomeStyle['loading-title']]: true }">Welcome to Marshell</div>
        <div :class="{ [WelcomeStyle['loading-description']]: true }">Tap, listen to and earn</div>
      </div>
    </Animation>
    <Animation name="loading-bottom" :animation-style="AnimationsWelcome" :start-animation="true">
      <div :class="{ [WelcomeStyle['loading-bottom']]: true }">
        <TurquoiseGradientButton name="Create your band" @click="changeState('create')" />
      </div>
    </Animation>
  </div>
</template>