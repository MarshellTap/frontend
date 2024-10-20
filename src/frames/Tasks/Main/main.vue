<script setup>
import {useRouter} from "vue-router";
import {useStore} from "vuex";
import {computed, onMounted, ref} from "vue";
import Category from "~/frames/Tasks/Category/category.vue";
import {useLazyQuery} from "@vue/apollo-composable";
import {GET_TASKS} from "~/queries.js";
import showPopup from "~/functions/showPopup.js";
import CircleLoader from "../../../components/CircleLoader/circle-loader.vue"
import MainStyle from "./main.module.css"
import Animation from "~/components/animation.vue";
import AnimationsMain from "./animations.module.css"

const router = useRouter()
const store = useStore()
const tasks = computed(() => store.state.tasks)

const loading = ref(true)

const { load: getTasks, onError: onErrorGetTasks } = useLazyQuery(
    GET_TASKS,
    {},
    {
      fetchPolicy: 'no-cache',
    }
)

const categoryInfo = {
  own: {
    title: "Marshell socials",
    description: "Become part of the vibrant Marshell community, discover exciting updates, and find your people."
  },
  other: {
    title: "Tasks",
    description: "Enjoy instant gratification with points awarded for every task finished."
  }
}

const load = async () => {
  const req = await getTasks();
  if (!req || !req.tasks) return
  const tasks = req.tasks
  await store.dispatch('tasks/setTasksOwnList', tasks.own)
  await store.dispatch('tasks/setTasksOtherList', tasks.other)
  loading.value = false;
}

onErrorGetTasks(() => {
  router.push('/')
  return showPopup('error', "An error occurred while loading tasks")
})

onMounted(() => load())
</script>

<template>
  <div :class="{ [MainStyle['tasks']]: true, [MainStyle['now-loading']]: loading }">
    <Animation name="tasks-loading" :animation-style="AnimationsMain" :start-animation="true" v-if="loading">
      <CircleLoader :border-size="5" :width="48" :height="48" />
    </Animation>
    <Category
        v-else
        :class="{ [MainStyle['tasks-main-category']]: true }"
        v-for="taskTag of Object.keys(tasks)"
        :title="categoryInfo[taskTag].title"
        :description="categoryInfo[taskTag].description"
        :items="tasks[taskTag]"
    />
  </div>
</template>