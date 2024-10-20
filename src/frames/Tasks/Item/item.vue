<script setup>
import Icon from "~/components/Icon/icon.vue";
import {computed, inject, ref} from "vue";
import getRandomInt from "~/functions/getRandomInt.js";
import CircleLoader from "../../../components/CircleLoader/circle-loader.vue"
import {useMutation} from "@vue/apollo-composable";
import {CLAIM_TASKS} from "~/queries.js";
import showPopup from "~/functions/showPopup.js";
import {useStore} from "vuex";
import {useTonConnectModal, useTonAddress} from "ton-ui-vue"
import {useWebAppNavigation} from "vue-tg";
import shareUrlBand from "~/functions/shareUrlBand.js";
import ItemStyle from "./item.module.css"
import GenericStyle from "~/assets/css/generic.module.css";
import AnimationsItem from "./animations.module.css"
import Animation from "~/components/animation.vue";

const props = defineProps({
  item_id: Number,
  animation_id: Number,
  type: String,
  title: String,
  reward: Number,
  info: Object,
  claim: Boolean
})

const store = useStore()
const user = computed(() => store.state.user)

const description = computed(() => {
  const info = props.info;
  if (info.type === "balance") return (user.value.balance > info.amount ? info.amount : user.value.balance) + "/" + info.amount + " notes. Get " + props.reward + " notes";
  if (info.type === "band") return (info.count > info.amount ? info.amount : info.count) + "/" + info.amount + " friends. Get " + props.reward + " notes";
  return "Get " + props.reward + " notes";
})

const icon = computed(() => {
  if (
      props.type === "telegram" ||
      props.type === "youtube" ||
      props.type === "instagram" ||
      props.type === "x"
  ) return "social-" + props.type;
  if (props.type === "balance") return "white-music-alt";
  if (props.type === "band") return "band";
  return props.type;
})

const webAppNavigation = useWebAppNavigation()
const { open: openTonModal } = useTonConnectModal();
const tonAddress = useTonAddress();

const { mutate: mutateClaimTasks, onError: onErrorClaimTasks } = useMutation(CLAIM_TASKS, () => {
  return {
    variables: {
      tasks_id: props.item_id
    },
  }
}, {
  fetchPolicy: 'no-cache',
})

const loading = ref(false)

const permanentStarted = computed(() => {
  const info = props.info;
  if (
      info.type === "balance" ||
      (info.type === "band" && info.count >= info.amount) ||
      (info.type === "telegram-wallet" && tonAddress.value)
  ) return true;
  return false;
})

const started = ref(permanentStarted.value)

const arrItemChangeClaim = inject('arr-item-change-claim')

const callback = () => {
  if (loading.value || props.claim) return
  if (!started.value) {
    return start();
  }
  return claim();
}

const open = () => {
  const info = props.info;
  switch (info.type) {
    case "link":
      return webAppNavigation.openLink(info.link);
    case "telegram-subscribe":
      return webAppNavigation.openTelegramLink(info.link);
    case "telegram-boost":
      return webAppNavigation.openTelegramLink(info.link);
    case "telegram-wallet":
      if (tonAddress.value) return claim();
      return openTonModal();
    case "band":
      return webAppNavigation.openTelegramLink(shareUrlBand(user.value.band.code));
    default:
      return;
  }
}

const start = () => {
  if (
      props.claim ||
      loading.value ||
      started.value
  ) return;
  const info = props.info;
  loading.value = true
  open();
  if(
      info.type === "link"
  ) {
    return setTimeout(() => {
      started.value = true
      loading.value = false
    }, getRandomInt(5 * 1000, 7 * 1000))
  } else {
    if (
        info.type === "band" && info.count >= info.amount
    ) {
      started.value = true
    } else if (info.type !== "band") {
      started.value = true
    }
    loading.value = false
  }
}

const claim = async () => {
  if (
      props.claim ||
      loading.value ||
      !started.value
  ) return;
  loading.value = true;
  const make = async () => {
    const info = props.info;
    if (
        info.type === "telegram-wallet" &&
        !tonAddress.value
    ) {
      loading.value = false
      return showPopup("error", "Link Telegram Wallet to complete this task");
    }
    const req = await mutateClaimTasks();
    if (!req || !req.data || !req.data.claimTasks) return
    const data = req.data.claimTasks
    arrItemChangeClaim(props.item_id);
    loading.value = false
    await store.dispatch("user/setUserBalance", data.balance)
    return showPopup("success", "You got +" + data.amount + " notes!")
  }
  return setTimeout(() => make(), getRandomInt(1 * 1000, 4 * 1000));
}

onErrorClaimTasks((error) => {
  loading.value = false
  showPopup("error", error.message)
})
</script>

<template>
  <Animation
      name="item"
      :animation-style="AnimationsItem"
      :style="{ '--tasks-item-animation-ms': 100 + (props.animation_id * 100) * 1.5 + 'ms' }"
      :start-animation="true"
  >
    <div :class="{ [ItemStyle['item']]: true }">
      <div :class="{ [ItemStyle['left-blocks']]: true }">
        <div :class="{ [ItemStyle['item-icon']]: true }">
          <Icon :class="{ [ItemStyle['styled-icon']]: true }" :name="icon" />
        </div>
        <div :class="{ [ItemStyle['info']]: true }">
          <div :class="{ [ItemStyle['title']]: true }">{{ props.title }}</div>
          <div :class="{ [ItemStyle['description']]: true }">{{ description }}</div>
        </div>
      </div>
      <div :class="{ [ItemStyle['right-buttons']]: true }">
        <button
            v-if="started && !props.claim && !permanentStarted"
            type="button"
            :class="{ [ItemStyle['button']]: true, [ItemStyle['button-start']]: true }"
            @click="open"
        >
          <span :class="{ [ItemStyle['name']]: true }">Open</span>
        </button>
        <button
            v-if="!props.claim"
            type="button"
            :class="{
            [ItemStyle['button']]: true,
            [ItemStyle['button-start']]: !started,
            [ItemStyle['button-gradient']]: started,
            [GenericStyle['border-gradient']]: started,
            [ItemStyle['button-icon']]: loading
          }"
            :disabled="loading || (props.info.type === 'balance' && user.balance < props.info.amount)"
            @click="callback"
        >
          <CircleLoader v-if="loading" :width="15" :height="15" :border-size="2" />
          <span :class="{ [ItemStyle['name']]: true }" v-else>{{ started ? "Claim" : (props.info.type === "band" ? "Invite" : "Start") }}</span>
        </button>
        <button
            v-else
            type="button"
            :class="{ [ItemStyle['button']]: true, [ItemStyle['button-icon']]: true }"
            :disabled="true"
            @click="callback"
        >
          <Icon :class="{ [ItemStyle['styled-icon']]: true }" name="circle-check" />
        </button>
      </div>
    </div>
  </Animation>
</template>