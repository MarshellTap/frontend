<script setup>
import Error from "./error.vue"
import {useStore} from "vuex";
import {computed} from "vue";
import OverErrorStyle from "./over-error.module.css";

const store = useStore()
const errorData = computed(() => store.state.error)
</script>

<template>
  <div :class="{ [OverErrorStyle['over-error']]: true }">
    <Error
        :title="errorData.title"
        :button="errorData.button"
        :description="errorData.description"
    />
  </div>
</template>