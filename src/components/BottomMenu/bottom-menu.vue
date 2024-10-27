<script setup>
import { useRoute, useRouter } from 'vue-router'
import Item from './item.vue'
import {useStore} from "vuex";
import {computed, onMounted, ref} from "vue";
import BottomMenuStyle from "~/components/BottomMenu/bottom-menu.module.css";
import Animation from "~/components/animation.vue";
import AnimationBottomMenu from "./animations.module.css"

const route = useRoute()
const router = useRouter()

const store = useStore()
const componentBottomMenu = computed(() => store.state.components.menu)
const modal = computed(() => store.state.modal)

const startUpAnimation = ref(false)

const hiddenHeader = computed(() => {
  if (route.path === "/game") return true
  return false
})

onMounted(() => startUpAnimation.value = true)
</script>

<template>
  <Animation name="bottom-menu" :animation-style="AnimationBottomMenu">
    <div
        v-if="!hiddenHeader && !modal.active && componentBottomMenu.visible && startUpAnimation"
        :class="{ [BottomMenuStyle['bottom-menu']]: true }"
    >
      <div :class="{ [BottomMenuStyle['menu-items']]: true }">
        <Item
            icon="home"
            title="Home"
            :tap="() => router.push('/')"
            :active="route.path === '/'"
        />
        <Item
            icon="tasks"
            title="Tasks"
            :tap="() => router.push('/tasks')"
            :active="route.path === '/tasks'"
        />
        <Item
            icon="band"
            title="Band"
            :tap="() => router.push('/band')"
            :active="route.path === '/band'"
        />
        <Item
            icon="wallet"
            title="Wallet"
            :tap="() => router.push('/wallet')"
            :active="route.path === '/wallet'"
        />
      </div>
    </div>
  </Animation>
</template>