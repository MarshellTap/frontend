<script setup>
import CircleLoaderStyle from "~/components/CircleLoader/circle-loader.module.css";

defineProps({
  borderSize: {
    type: Number,
    required: false,
    default: 4
  },
  width: {
    type: Number,
    required: false,
    default: 30
  },
  height: {
    type: Number,
    required: false,
    default: 30
  }
})
</script>

<template>
  <div
      :class="{ [CircleLoaderStyle['loader']]: true }"
      :style="{
        '--circle-loader-border-size': borderSize + 'px',
        width: width + 'px',
        height: height + 'px'
  }"></div>
</template>