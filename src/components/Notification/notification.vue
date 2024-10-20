<script setup>
import Icon from "~/components/Icon/icon.vue";
import {onMounted, ref} from "vue";
import {useStore} from "vuex";
import NotificationStyle from "./notification.module.css"
import Animation from "~/components/animation.vue";
import AnimationsNotification from "./animations.module.css"
import {useWebAppHapticFeedback} from "vue-tg";

const webAppHapticFeedback = useWebAppHapticFeedback();

const isClose = ref(false)

const props = defineProps({
  id: String,
  type: String,
  title: String,
  message: String,
})

const titles = {
  error: "Error",
  success: "Success",
  warning: "Warning",
  info: "Info"
}

const store = useStore()

const closePopup = () => {
  if (isClose.value) return
  isClose.value = true
  return setTimeout(() => {
    store.dispatch('notifications/deleteItemNotificationsPopup', props.id)
  }, 300);
}

onMounted(() => {
  setTimeout(() => closePopup(), 4 * 1000);
  webAppHapticFeedback.notificationOccurred(props.type === "info" ? "success" : props.type)
})
</script>

<template>
  <Animation name="notification" :animation-style="AnimationsNotification" :start-animation="true">
    <div
        :class="{
          [NotificationStyle['notification']]: true,
          [NotificationStyle['notification-' + props.type]]: true
        }"
        v-if="!isClose"
    >
      <div :class="{ [NotificationStyle['notification-body']]: true }">
        <div :class="{ [NotificationStyle['notification-content']]: true }">
          <div :class="{ [NotificationStyle['notification-icon']]: true }">
            <Icon :class="{ [NotificationStyle['styled-icon']]: true }" :name="'notification-' + props.type" />
          </div>
          <div :class="{ [NotificationStyle['notification-info']]: true }">
            <div :class="{ [NotificationStyle['title']]: true }">{{ !props.title? titles[props.type] : props.title }}</div>
            <div :class="{ [NotificationStyle['message']]: true }">{{ props.message }}</div>
          </div>
        </div>
        <div :class="{ [NotificationStyle['notification-action']]: true }">
          <button type="button" :class="{ [NotificationStyle['notification-delete']]: true }" @click="closePopup">
            <Icon :class="{ [NotificationStyle['styled-icon']]: true }" name="notification-close" />
          </button>
        </div>
      </div>
    </div>
  </Animation>
</template>