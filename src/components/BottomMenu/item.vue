<script setup>
import Icon from '../Icon/icon.vue'
import { uuid } from 'vue-uuid'
import Item from "./item.module.css"

const props = defineProps({
  icon: String,
  title: String,
  active: {
    type: Boolean,
    required: false,
    default: false,
  },
  tap: Function,
})

const customFillUuid = uuid.v1()
</script>

<template>
  <button
      type="button"
      :class="{ [Item['item']]: true, [Item['active']]: props.active }"
      @click="props.tap"
  >
    <Icon
        :class="{ [Item['styled-icon']]: true }"
        :name="'bottom-menu-' + props.icon"
        :custom-fill="'defs-bottom-menu-item-color-' + customFillUuid"
    >
      <defs>
        <linearGradient
            :id="'defs-bottom-menu-item-color-' + customFillUuid"
            x1="10.5013"
            y1="1.66666"
            x2="10.5013"
            y2="18.3333"
            gradientUnits="userSpaceOnUse"
        >
          <stop :stop-color="props.active ? '#00CDD3' : '#fff'" />
          <stop offset="1" :stop-color="props.active ? '#018297' : '#fff'" />
        </linearGradient>
      </defs>
    </Icon>
    <span :class="{ [Item['title']]: true }">{{ props.title }}</span>
  </button>
</template>