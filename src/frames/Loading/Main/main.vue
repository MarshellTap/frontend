<script setup>
import {useMutation} from "@vue/apollo-composable";
import {INIT_GAME, INIT_USER} from "~/queries.js";
import {useWebApp} from "vue-tg";
import {inject, onMounted, provide, ref} from "vue";
import {useStore} from "vuex";
import Loading from "~/frames/Loading/Loading/loading.vue";
import Welcome from "~/frames/Loading/Welcome/welcome.vue";
import CreateBand from "~/frames/Loading/Create/create.vue";
import Daily from "~/frames/Loading/Daily/daily.vue";
import getQueryParams from "~/functions/getQueryParams.js";
import MainStyle from "./main.module.css"

const webApp = useWebApp()

const { mutate: mutateInitGame, onError: onErrorInitGame } = useMutation(INIT_GAME, () => {
  return {
    variables: {
      initData: webApp.initData,
    },
  }
}, {
  fetchPolicy: 'no-cache',
})

const { mutate: mutateInitUser, onError: onErrorInitUser } = useMutation(INIT_USER, () => {
  return {
    variables: {
      initData: webApp.initData
    },
  }
}, {
  fetchPolicy: 'no-cache',
})

const store = useStore()
const queryParams = getQueryParams()
const refCode = queryParams.affiliate ? queryParams.affiliate : null;

const currentState = ref('loading')
const currentLoadingState = ref(1)
const bandNameValue = ref()
const loadingCircleAnimationStatus = ref(true)

const loadingAppImagesInterval = ref(null)
const loadingAppCdnImagesInterval = ref(null)

const appImages = inject('app-images')

const changeLoadingState = (state) => {
  if (
      (currentState.value === 'welcome' && state !== 'create') ||
      (currentState.value === 'create' && state !== 'daily')
  ) return
  currentState.value = state
}

const initializeUser = async () => {
  const user = await mutateInitUser();
  if (!user || !user.data || !user.data.initUser) return
  const req_user_data = user.data.initUser;
  const cdnAvatar = req_user_data.avatar;
  currentLoadingState.value = 3;
  loadAppImage(cdnAvatar);
  loadingAppCdnImagesInterval.value = setInterval(() => {
    if (
        appImages.value.length === appImages.value.filter(image => image.loaded).length
    ) {
      clearInterval(loadingAppCdnImagesInterval.value)
      store.dispatch("user/setUser", req_user_data)
      if (req_user_data.available_daily_rewards.status) {
        loadingCircleAnimationStatus.value = false
        return changeLoadingState('daily')
      }
      return store.dispatch('preloader/setPreloader', false)
    }
  }, 300)
}

const initGame = async () => {
  const req = await mutateInitGame();
  if (!req || !req.data || !req.data.initGame) return
  const data = req.data.initGame
  await store.dispatch('init/setInitDefaultAvatar', data.default_avatar)
  loadAppImages();
  loadingAppImagesInterval.value = setInterval(() => {
    if (
        appImages.value.length === appImages.value.filter(image => image.loaded).length
    ) {
      clearInterval(loadingAppImagesInterval.value)
      if (!data.is_register) {
        store.dispatch('user/setTemporaryAuthToken', data.temporary_auth_token)
        store.dispatch('init/setInitPlayerRegisterAvatar', data.avatar)
        bandNameValue.value = data.name
        currentState.value = 'welcome';
        loadingCircleAnimationStatus.value = false
      } else setTimeout(() => initializeUser(), 300);
    }
  }, 300)
}

const loadAppImages = () => {
  currentLoadingState.value = 2;
  for (const arrKey in appImages.value) {
    const arrImage = appImages.value[arrKey];
    const image = new Image();
    image.src = arrImage.component;
    image.onload = () => {
      appImages.value[arrKey].loaded = true;
    }
    image.onerror = () => {
      clearInterval(loadingAppImagesInterval.value);
      return requestFailed();
    }
  }
}

const loadAppImage = (uri) => {
  const image = new Image();
  image.src = uri;
  image.onload = () => {
    return true;
  }
  image.onerror = () => {
    clearInterval(loadingAppCdnImagesInterval.value)
    return false;
  }
}

provide('loading-ref-code', refCode)
provide('loading-initialize-user', initializeUser)
provide('change-loading-state', changeLoadingState)
provide('change-loading-circle-animation-status', (state) => {
  loadingCircleAnimationStatus.value = state
})

const requestFailed = () => store.dispatch('error/setError', {
  status: true,
  title: "Error",
  description: "There was an error on our server side",
  button: {type: "success", name: "Refresh app", function: "reloadApp"}
})

onErrorInitGame(() => requestFailed())
onErrorInitUser(() => requestFailed())

onMounted(() => initGame())
</script>

<template>
  <div :class="{ [MainStyle['loading-container']]: true }">
    <div :class="{ [MainStyle['loading-content']]: true }">
      <div :class="{
        [MainStyle['loading-circle']]: true,
        [MainStyle['loading-circle-animation-not-loading']]: currentState !== 'loading',
        [MainStyle['loading-circle-animation-stop']]: !loadingCircleAnimationStatus
      }"></div>
      <Loading
          v-if="currentState === 'loading'"
          :state="currentLoadingState"
      />
      <Welcome v-else-if="currentState === 'welcome'" />
      <CreateBand v-else-if="currentState === 'create'" :bandName="bandNameValue" />
      <Daily v-else-if="currentState === 'daily'" />
    </div>
  </div>
</template>