<script setup>
import {computed, onBeforeMount, onUnmounted, ref} from "vue";
import {useStore} from "vuex";
import toggleModal from "~/functions/toggleModal.js";
import showPopup from "~/functions/showPopup.js";
import getBase64FromInput from "~/functions/getBase64FromInput.js";
import MainStyle from "./main.module.css"
import GenericStyle from "~/assets/css/generic.module.css";

const store = useStore()
const init = computed(() => store.state.init)

const isRegister = computed(() => !store.state.user.auth_token)
const isDefaultAvatar = computed(() => {
  if (isRegister.value) {
    return store.state.init.player_register.avatar === init.value.default_avatar;
  } else return store.state.user.avatar === init.value.default_avatar;
})

const deleteAvatar = () => {
  if (isRegister.value) {
    store.dispatch('init/setInitPlayerRegisterAvatar', init.value.default_avatar)
  } else return showPopup("error", "Forbidden")
}

const addFileInput = ref()

const addNewAvatar = () => {
  if (!addFileInput.value) return
  addFileInput.value.click();
}

const onFileSelected = async (event) => {
  const files = event.target.files
  if (!files) return showPopup("error", "Selected file not found");
  const file = files[0];
  const fileType = file.type;
  if (!fileType.startsWith("image/")) return showCallbackPopup("error", "You can upload only .png and .jpeg files");
  const fileSizeKB = (file.size / 1024).toFixed(2);
  if (fileSizeKB > 1024) return showCallbackPopup("error", "Maximum image size for uploading is 1 MB");
  /* Get Base64 */
  const base64Data = await getBase64FromInput(file);
  if (!base64Data) return showCallbackPopup("error", "An error occurred while loading the image information");
  if (isRegister.value) {
    if (init.value.player_register.avatar === base64Data) return showCallbackPopup("error", "The avatar you've chosen is already in your possession.");
    await store.dispatch('init/setInitPlayerRegisterAvatar', base64Data)
  } else return showPopup("error", "Forbidden")
  showCallbackPopup("success", "Avatar successfully uploaded");
  return toggleModal();
}

const showCallbackPopup = (type, message) => {
  if (addFileInput.value?.value !== null) {
    addFileInput.value.value = null;
  }
  showPopup(type, message);
  return toggleModal()
}

onUnmounted(() => store.dispatch('modal/setModalRender', false))
onBeforeMount(() => setTimeout(() => store.dispatch('modal/setModalRender', true), 100))
</script>

<template>
  <div :class="{ [MainStyle['edit-avatar']]: true }">
    <div :class="{ [MainStyle['list-of-buttons']]: true }">
      <button type="button" :class="{ [MainStyle['button']]: true, [MainStyle['button-delete']]: true }" v-if="!isDefaultAvatar" @click="deleteAvatar">Delete avatar</button>
      <div :class="{ [MainStyle['edit-avatar-add']]: true }">
        <input type="file" @change="onFileSelected" ref="addFileInput" />
        <button type="button" :class="{ [MainStyle['button']]: true, [GenericStyle['border-gradient']]: true, [MainStyle['button-add']]: true }" accept="image/png, image/jpeg" @click="addNewAvatar">Add new band avatar</button>
      </div>
      <button type="button" :class="{ [MainStyle['button']]: true, [MainStyle['button-cancel']]: true }" @click="() => toggleModal()">Cancel</button>
    </div>
  </div>
</template>