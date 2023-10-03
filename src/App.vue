<template>
  <span>{{ message }}</span>
  <div v-if="message === ''" class="container">
    <the-header></the-header>
    <router-view></router-view>
    <the-footer></the-footer>
  </div>
</template>

<script setup>

import TheHeader from "@/components/layout/TheHeader.vue";
import TheFooter from "@/components/layout/TheFooter.vue"

import { useStore } from 'vuex'
import { ref, inject, onMounted } from "vue";
import { refreshToken } from "@/api/api";

const store = useStore();
const message = ref('Загрузка...');
const $cookies = inject('$cookies');

onMounted(async () => {
  const res = await refreshToken();
  if (res === null) {
    message.value = "Что-то пошло не так";
    return;
  }
  if (!res.success) {
    $cookies.remove("user_id");
    $cookies.remove("token");
    store.commit("setProfile", null);
    store.commit("setProductsCount", 0);
    message.value = "";
    return;
  }
  $cookies.set("token", res.token);
  store.commit("setProfile", res.profile);
  store.commit("setProductsCount", res.products_count);
  message.value = "";
});

</script>

<style>
@import '@/assets/styles/global.css';
</style>
