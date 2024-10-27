<script setup>
import Icon from "~/components/Icon/icon.vue";
import {computed, inject, onMounted, ref, watch} from "vue";
import generateString from "~/functions/generateString.js";
import CircleLoader from "~/components/CircleLoader/circle-loader.vue";
import debounce from "lodash.debounce"
import getRandomInt from "~/functions/getRandomInt.js";
import {useMutation} from "@vue/apollo-composable";
import {CHECKING_AVAILABILITY_BANDNAME, CREATE_BAND, INIT_USER} from "~/queries.js";
import toggleModal from "~/functions/toggleModal.js";
import {useStore} from "vuex";
import showPopup from "~/functions/showPopup.js";
import isValidBase64Image from "~/functions/isValidBase64Image.js";
import {useWebApp} from "vue-tg";
import TurquoiseGradientButton from "~/components/TurquoiseGradientButton/turquoise-gradient-button.vue";
import {useRouter} from "vue-router";
import NoImage from "~/assets/images/no-image.png";
import MainStyle from "../Main/main.module.css"
import CreateStyle from "./create.module.css"
import AnimationsCreate from "./animations.module.css"
import Animation from "~/components/animation.vue";

const MIN_BANDNAME_LENGTH = 5, MAX_BANDNAME_LENGTH = 14;

const props = defineProps({
  bandName: String
})

const router = useRouter()

const webApp = useWebApp()

const bandName = computed(() => {
  const FILTER_BANDNAME = props.bandName.replace(/[^a-zA-Z0-9]/g, '').substring(0, 14);
  const ADD_LETTERS_LENGTH = FILTER_BANDNAME.length < MIN_BANDNAME_LENGTH ? (MIN_BANDNAME_LENGTH - FILTER_BANDNAME.length) + getRandomInt(1, 3) : 0;
  return FILTER_BANDNAME + generateString(ADD_LETTERS_LENGTH);
})

const store = useStore()
const init = computed(() => store.state.init)

const bandAvatar = computed(() => {
  return {
    src: init.value.player_register.avatar,
    default: init.value.player_register.avatar === init.value.default_avatar
  }
})

const input = ref({
  bandName: {
    loading: false,
    error: {
      status: false,
      message: ""
    }
  }
})
const inputRef = ref(null)
const inputValue = ref(bandName.value)
const loading = ref(false)

const appModals = inject('app-modals')
const initializeUser = inject('loading-initialize-user')
const changeCircleAnimationStatus = inject('change-loading-circle-animation-status')
const refCode = inject('loading-ref-code')

watch(loading, (newValue) => changeCircleAnimationStatus(newValue))

const { mutate: mutateCheckingAvailabilityBandName, onError: onErrorCheckingAvailabilityBandName } = useMutation(CHECKING_AVAILABILITY_BANDNAME, () => {
  return {
    variables: {
      bandName: inputValue.value,
    },
  }
}, {
  fetchPolicy: 'no-cache',
})

const { mutate: mutateCreateBand, onError: onErrorCreateBand } = useMutation(CREATE_BAND, () => {
  return {
    variables: {
      initData: webApp.initData,
      bandName: inputValue.value,
      avatar: bandAvatar.value.src,
      refCode: refCode
    },
  }
}, {
  fetchPolicy: 'no-cache',
})

watch(inputValue, debounce((newValue) => checkBandName(newValue), 300))

const checkBandName = async (name) => {
  if (input.value.bandName.loading) return;
  if (!input.value.bandName.loading) {
    input.value.bandName.error.status = false
    input.value.bandName.error.message = "";
    input.value.bandName.loading = true;
  }
  if (name.length < MIN_BANDNAME_LENGTH) return showInputBandNameError("Bandname cannot be less than " + MIN_BANDNAME_LENGTH + " characters long");
  if (name.length > MAX_BANDNAME_LENGTH) return showInputBandNameError("Bandname cannot be more than " + MAX_BANDNAME_LENGTH + " characters long");
  if (/[^a-zA-Z0-9]/.test(name)) return showInputBandNameError("Bandname must contain only English letters and numbers");
  const req = await mutateCheckingAvailabilityBandName();
  if (!req || !req.data || !req.data.checkingAvailabilityBandName) return
  return setTimeout(() => {
    input.value.bandName.loading = false;
  }, 250)
}

const showInputBandNameError = (message) => {
  input.value.bandName.loading = false;
  input.value.bandName.error.message = message;
  input.value.bandName.error.status = true
}

const register = async () => {
  const name = inputValue.value,
      avatar = bandAvatar.value;
  if (
      name.length < MIN_BANDNAME_LENGTH
  ) return showInputBandNameError("Bandname cannot be less than " + MIN_BANDNAME_LENGTH + " characters long");
  if (
      name.length > MAX_BANDNAME_LENGTH
  ) return showInputBandNameError("Bandname cannot be more than " + MAX_BANDNAME_LENGTH + " characters long");
  if (
      /[^a-zA-Z0-9]/.test(name)
  ) return showInputBandNameError("Bandname must contain only English letters and numbers");
  if (
      !avatar.default && !isValidBase64Image(avatar.src)
  ) return showPopup("error", "Bandname must contain only English letters and numbers");
  loading.value = true
  const req = await mutateCreateBand();
  if (!req || !req.data || !req.data.createBand) return
  await router.push({ query: {} })
  return await initializeUser();
}

onErrorCheckingAvailabilityBandName((error) => showInputBandNameError(error.message))
onErrorCreateBand((error) => {
  changeCircleAnimationStatus(false);
  loading.value = false;
  return showPopup("error", error.message)
})

onMounted(() => checkBandName(inputValue.value))
</script>

<template>
  <div :class="{ [MainStyle['loading-body']]: true }">
    <Animation name="loading-text" :animation-style="AnimationsCreate" :start-animation="true">
      <div :class="{ [CreateStyle['loading-text']]: true }">
        <div :class="{ [CreateStyle['loading-title']]: true }">
          <span>Rock is not dead!</span>
          <span>Create your own band</span>
        </div>
        <div :class="{ [CreateStyle['loading-description']]: true }">Tap, listen to and earn</div>
      </div>
    </Animation>
    <Animation name="loading-avatar" :animation-style="AnimationsCreate" :start-animation="true">
      <div :class="{ [CreateStyle['loading-avatar']]: true }">
        <div :class="{ [CreateStyle['avatar-body']]: true }">
          <div :class="{ [CreateStyle['avatar-img']]: true }" :style="{ 'background-image': `url(${init.player_register.avatar}), url(${NoImage})` }"></div>
        </div>
        <button
            type="button"
            :disabled="loading || input.bandName.loading"
            :ref="appModals['edit-avatar'].button"
            :class="{ [CreateStyle['avatar-edit']]: true }"
            @click="toggleModal('edit-avatar')"
        >
          <Icon :class="{ [CreateStyle['styled-icon']]: true }" name="avatar-pen-edit" />
          <span :class="{ [CreateStyle['name']]: true }">Edit</span>
        </button>
      </div>
    </Animation>
    <Animation name="loading-input" :animation-style="AnimationsCreate" :start-animation="true">
      <div :class="{ [CreateStyle['loading-input']]: true }">
        <label :class="{ [CreateStyle['input-label']]: true }">Bandname</label>
        <div
            :class="{
              [CreateStyle['style-input']]: true,
              [CreateStyle['checking-input']]: input.bandName.loading,
              [CreateStyle['error-input']]: input.bandName.error.status
            }"
        >
          <input type="text" ref="inputRef" v-model="inputValue" placeholder="Make up a bandname" :disabled="loading || input.bandName.loading" :value="inputValue" />
          <Icon v-if="!input.bandName.loading" :class="{ [CreateStyle['styled-icon']]: true }" :name="'input-loading-' + (input.bandName.error.status ? 'error' : 'success')" />
          <CircleLoader v-else :class="{ [CreateStyle['input-loader']]: true }" :width="18" :height="18" />
        </div>
        <div
            :class="{
              [CreateStyle['input-text']]: true,
              [CreateStyle['checking-text']]: input.bandName.loading,
              [CreateStyle['error-text']]: input.bandName.error.status
            }"
        >
          {{ input.bandName.loading ? 'Checking Bandname for availability...' : (input.bandName.error.status ? input.bandName.error.message : "Cool, that’s available!") }}
        </div>
      </div>
    </Animation>
    <Animation name="loading-bottom" :animation-style="AnimationsCreate" :start-animation="true">
      <div :class="{ [CreateStyle['loading-bottom']]: true }">
        <TurquoiseGradientButton
            :icon="loading ? null : 'rock'"
            :name="loading ? 'Chill a sec, download’s in progress..' : 'Let’s rock'"
            :disabled="loading || input.bandName.loading"
            @click="register"
        />
      </div>
    </Animation>
  </div>
</template>