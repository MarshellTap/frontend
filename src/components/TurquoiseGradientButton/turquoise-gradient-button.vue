<script setup>
import Icon from "~/components/Icon/icon.vue";
import TurquoiseGradientButtonStyle from "./turquoise-gradient-button.module.css"
import GenericStyle from "~/assets/css/generic.module.css";

const props = defineProps({
  icon: {
    type: String,
    required: false,
    default: null
  },
  name: {
    type: String,
    required: false
  },
  iconWidth: {
    type: Number,
    required: false
  },
  iconColor: {
    type: String,
    required: false
  },
})
</script>

<template>
  <button type="button" :class="{ [TurquoiseGradientButtonStyle['gradient-button']]: true, [GenericStyle['border-gradient']]: true }">
    <span :class="{ [TurquoiseGradientButtonStyle['name']]: true }" v-if="props.name">{{ props.name }}</span>
    <Icon
        :name="props.icon"
        v-if="props.icon"
        :style="{
          width: (!props.iconWidth ? 16 : props.iconWidth) + 'px',
          height: (!props.iconWidth ? 16 : props.iconWidth) + 'px',
          color: (!props.iconColor ? '#000' : props.iconColor)
        }"
    />
  </button>
</template>