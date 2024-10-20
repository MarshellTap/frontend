<script setup>
import Icon from "~/components/Icon/icon.vue";
import UserItem from "~/frames/Band/UserItem/user-item.vue";
import {computed, inject, onMounted, ref} from "vue";
import CircleLoader from "~/components/CircleLoader/circle-loader.vue";
import {useMutation} from "@vue/apollo-composable";
import {GET_BAND_USERS} from "~/queries.js";
import showPopup from "~/functions/showPopup.js";
import TableStyle from "./table.module.css"
import GenericStyle from "~/assets/css/generic.module.css";
import AnimationsTable from "./animations.module.css"
import Animation from "~/components/animation.vue";

const loading = ref(true)
const paginateLoading = ref(false)
const users = ref([])
const paginate = ref({
  page: 1,
  total: 1
})
const count = ref(0)

const layoutScroll = inject('layout-scroll')

const { mutate: mutateGetBandUsers, onError: onErrorGetBandUsers } = useMutation(GET_BAND_USERS, () => {
  return {
    variables: {
      page: paginate.value.page
    },
  }
}, {
  fetchPolicy: 'no-cache',
})

const load = async (mount = false) => {
  if (
      !mount &&
      loading.value
  ) return;
  if (mount && !loading.value) {
    loading.value = true;
  } else if (!mount && !paginateLoading.value) {
    paginateLoading.value = true;
  }
  const req = await mutateGetBandUsers();
  if (!req || !req.data || !req.data.bandUsers) return
  const data = req.data.bandUsers
  count.value = data.count;
  users.value = data.items;
  paginate.value = {
    page: data.page.current,
    total: data.page.total
  }
  if (mount) {
    loading.value = false
  } else paginateLoading.value = false
  if (!mount) {
    setTimeout(() => layoutScroll.bottom(), 1 * 2);
  }
}

const nextPage = () => {
  if (
      loading.value ||
      paginateLoading.value ||
      paginate.value.page === paginate.value.total
  ) return;
  paginate.value.page++;
  return load();
}

const backPage = () => {
  if (
      loading.value ||
      paginateLoading.value ||
      paginate.value.page === 1
  ) return;
  paginate.value.page--;
  return load();
}

const openPage = (page) => {
  if (
      loading.value ||
      paginateLoading.value ||
      paginate.value.page === page ||
      paginate.value.total < page
  ) return;
  paginate.value.page = page;
  return load();
}

const numbers = computed(() => {
  const numbers = [], maxNumbers = 3;
  if (paginate.value.total <= maxNumbers) {
    for (let i = 1; i <= paginate.value.total; i++) {
      numbers.push(i);
    }
    return numbers;
  }
  let start = Math.max(1, paginate.value.page - 1),
      end = Math.min(paginate.value.total, paginate.value.page + 1);
  if (end - start < maxNumbers - 1) {
    if (start > 1) {
      start = paginate.value.page - 2;
      end = paginate.value.page;
    } else {
      start = 1;
      end = maxNumbers;
    }
  }
  for (let i = start; i <= end; i++) {
    numbers.push(i);
  }
  return numbers;
})

onErrorGetBandUsers(() => {
  if (loading.value) {
    loading.value = false
  }
  if (paginateLoading.value) {
    paginateLoading.value = false
  }
  return showPopup("error", "There was an error loading your users from band");
})

onMounted(() => load(true))
</script>

<template>
  <div :class="{ [TableStyle['invited-list']]: true }">
    <Animation name="invited-list-loading" :animation-style="AnimationsTable" :start-animation="true" v-if="loading">
      <div :class="{ [TableStyle['invited-loading']]: true }">
        <CircleLoader :width="40" :height="40" />
      </div>
    </Animation>
    <template v-else>
      <Animation name="invited-list-title" :animation-style="AnimationsTable" :start-animation="true">
        <div :class="{ [TableStyle['title']]: true }">
          You invited <span :class="{ [TableStyle['amount']]: true }">({{ count }})</span>
        </div>
      </Animation>
      <Animation name="invited-list-of-users" :animation-style="AnimationsTable" :start-animation="true">
        <div :class="{ [TableStyle['list-of-users']]: true }">
          <div :class="{ [TableStyle['loading']]: true }" v-if="paginateLoading">
            <CircleLoader :class="{ [TableStyle['some-loader']]: true }" :width="40" :height="40" />
          </div>
          <div :class="{ [TableStyle['empty']]: true }" v-if="!users.length">List is empty</div>
          <UserItem
              v-else
              v-for="(user, key) of users"
              :key="key"
              :avatar="user.avatar"
              :name="user.name"
              :amount="user.amount"
          />
        </div>
      </Animation>
      <div :class="{ [TableStyle['pagination']]: true }" v-if="users.length > 0 && paginate.total !== 1">
        <Animation name="invited-list-pagination-arrow-left" :animation-style="AnimationsTable" :start-animation="true">
          <button
              type="button"
              :disabled="loading || paginateLoading || paginate.page === 1"
              :class="{ [TableStyle['button']]: true, [TableStyle['button-arrow']]: true, [GenericStyle['border-gradient']]: true }"
              @click="backPage"
          >
            <Icon :class="{ [TableStyle['styled-icon']]: true }" name="pagination-left" />
            <span :class="{ [TableStyle['name']]: true }">Back</span>
          </button>
        </Animation>
        <Animation name="invited-list-pagination-numbers" :animation-style="AnimationsTable" :start-animation="true">
          <div :class="{ [TableStyle['pagination-numbers']]: true }">
            <button
                v-for="(number, key) of numbers"
                :key="key"
                type="button"
                :disabled="loading || paginateLoading || number === paginate.page"
                :class="{ [TableStyle['button']]: true, [GenericStyle['border-gradient']]: true, [TableStyle['active']]: number === paginate.page }"
                @click="() => openPage(number)"
            >
              <span :class="{ [TableStyle['amount']]: true }">{{ number }}</span>
            </button>
          </div>
        </Animation>
        <Animation name="invited-list-pagination-arrow-right" :animation-style="AnimationsTable" :start-animation="true">
          <button
              type="button"
              :disabled="loading || paginateLoading || paginate.total === paginate.page"
              :class="{ [TableStyle['button']]: true, [TableStyle['button-arrow']]: true, [GenericStyle['border-gradient']]: true }"
              @click="nextPage"
          >
            <span :class="{ [TableStyle['name']]: true }">Next</span>
            <Icon :class="{ [TableStyle['styled-icon']]: true }" name="pagination-right" />
          </button>
        </Animation>
      </div>
    </template>
  </div>
</template>