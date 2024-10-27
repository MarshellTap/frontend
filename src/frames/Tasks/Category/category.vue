<script setup>
import Item from "../Item/item.vue";
import {computed, provide, ref} from "vue";
import CategoryStyle from "./category.module.css"
import AnimationsCategory from "./animations.module.css"
import Animation from "~/components/animation.vue";

const props = defineProps({
  title: String,
  description: String,
  items: Array
})

const listOfItems = ref(props.items)

const sortedItems = computed(() => {
  return listOfItems.value.sort((a, b) => a.claim - b.claim)
});

provide('arr-item-change-claim', (tasks_id) => {
  const findIndex = listOfItems.value.findIndex(item => item.id === tasks_id);
  if (findIndex === -1) return;
  listOfItems.value[findIndex].claim = true;
})
</script>

<template>
  <div :class="{ [CategoryStyle['tasks-category']]: true }" v-if="props.items.length > 0">
    <div :class="{ [CategoryStyle['tasks-header']]: true }">
      <Animation name="tasks-header-title" :animation-style="AnimationsCategory" :start-animation="true">
        <div :class="{ [CategoryStyle['title']]: true }">
          {{ props.title }} <span :class="{ [CategoryStyle['amount']]: true }">({{ sortedItems.filter(item => !item.claim).length }})</span>
        </div>
      </Animation>
      <Animation name="tasks-header-description" :animation-style="AnimationsCategory" :start-animation="true">
        <div :class="{ [CategoryStyle['description']]: true }">{{ props.description }}</div>
      </Animation>
    </div>
    <div :class="{ [CategoryStyle['tasks-list']]: true }">
      <Item
          v-for="(item, key) of sortedItems"
          :key="item.id"
          :item_id="item.id"
          :animation_id="key"
          :type="item.type"
          :title="item.title"
          :reward="item.reward"
          :info="item.info"
          :claim="item.claim"
      />
    </div>
  </div>
</template>