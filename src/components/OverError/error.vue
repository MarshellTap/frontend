<script setup>
import Icon from "~/components/Icon/icon.vue";
import ErrorStyle from "./error.module.css"
import {useWebApp} from "vue-tg";
import GenericStyle from "~/assets/css/generic.module.css";
import Animation from "~/components/animation.vue";
import AnimationsOverError from "./animations.module.css"

const props = defineProps({
  icon: {
    type: String,
    required: false,
    default: "error"
  },
  title: String,
  description: String,
  button: Object
})

const webApp = useWebApp()

const refreshPage = () => window.location.reload();
const closeApp = () => webApp.close()

const tap = () => {
  if (props.button.function === "reloadApp") return refreshPage()
  if (props.button.function === "closeApp") return closeApp()
}
</script>

<template>
  <Animation name="error" :animation-style="AnimationsOverError" :start-animation="true">
    <div :class="{ [ErrorStyle['game-error']]: true }">
      <div :class="{ [ErrorStyle['game-error-content']]: true }">
        <Icon :class="{ [ErrorStyle['styled-icon']]: true }" :name="props.icon" />
        <div :class="{ [ErrorStyle['info']]: true }">
          <div :class="{ [ErrorStyle['title']]: true }">{{ props.title }}</div>
          <div :class="{ [ErrorStyle['description']]: true }">{{ props.description }}</div>
        </div>
        <button
            type="button"
            :class="{
              [ErrorStyle['error-btn']]: true,
              [ErrorStyle['error-btn-' + props.button.type]]: true,
              [GenericStyle['border-gradient']]: props.button.type === 'success'
            }"
            @click="tap"
        >
          {{ props.button.name }}
        </button>
      </div>
    </div>
  </Animation>
</template>