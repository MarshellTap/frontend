<script setup>
import Icon from "~/components/Icon/icon.vue";
import {integerSpaces} from "../../../functions/numberSpaces.js";
import UserItemStyle from "./user-item.module.css"
import NoImage from "~/assets/images/no-image.png";

const props = defineProps({
  avatar: String,
  name: String,
  amount: Number
})
</script>

<template>
  <div :class="{ [UserItemStyle['user-item']]: true }">
    <div :class="{ [UserItemStyle['avatar']]: true }" :style="{ backgroundImage: `url(${props.avatar}), url(${NoImage})` }"></div>
    <div :class="{ [UserItemStyle['info']]: true }">
      <div :class="{ [UserItemStyle['name']]: true }">{{ props.name }}</div>
      <div :class="{ [UserItemStyle['amount-value']]: true }">
        <span :class="{ [UserItemStyle['name']]: true }">You got:</span>
        <Icon :class="{ [UserItemStyle['styled-icon']]: true }" name="gradient-background-music-alt" />
        <span :class="{ [UserItemStyle['amount']]: true }">{{ integerSpaces(props.amount) }}</span>
      </div>
    </div>
  </div>
</template>