<script setup>
import HeaderStyle from "./header.module.css";
import Icon from "../Icon/icon.vue";
import { useStore } from "vuex";
import { computed } from "vue";
import { integerSpaces } from "../../functions/numberSpaces.js";
import { useRouter } from "vue-router";
import GenericStyle from "../../assets/css/generic.module.css"
import Animation from "~/components/animation.vue";
import AnimationsHeader from "./animations.module.css"

const store = useStore();
const user = computed(() => store.state.user);
const componentHeader = computed(() => store.state.components.header);

const router = useRouter();
const openTasks = () => router.push("/tasks");
</script>

<template>
  <Animation name="header" :animation-style="AnimationsHeader" :start-animation="true">
    <div :class="{ [HeaderStyle['game-header']]: true }" v-if="componentHeader.visible">
      <div :class="{ [HeaderStyle['game-header-content']]: true }" >
        <div :class="{ [HeaderStyle['balance']]: true }">
          <div :class="{ [HeaderStyle['balance-icon']]: true }">
            <Icon :class="{ [HeaderStyle['styled-icon']]: true }" name="music-alt" />
          </div>
          <div :class="{ [HeaderStyle['balance-info']]: true }">
            <div :class="{ [HeaderStyle['balance-name']]: true }">
              Balance
            </div>
            <div :class="{ [HeaderStyle['balance-amount']]: true }">
              {{ integerSpaces(user.balance) }}
            </div>
          </div>
        </div>
        <div :class="{ [HeaderStyle['blocks']]: true }">
          <button
              type="button"
              :class="{ [HeaderStyle['new-tasks']]: true, [GenericStyle['border-gradient']]: true }"
              @click="openTasks"
          >
            <Icon :class="{ [HeaderStyle['styled-icon']]: true }" name="bottom-menu-tasks" />
            <div :class="{ [HeaderStyle['text']]: true }">
              New tasks are available
            </div>
          </button>
        </div>
      </div>
    </div>
  </Animation>
</template>
