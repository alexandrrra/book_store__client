<template>
  <div class="container">
    <div class="books">
      <div v-if="store.state.profile === null">
        <h1>Вход не выполнен</h1>
      </div>
      <template v-else>
        <template v-if="products.length > 0">
          <the-book v-for="book of products" :key="book.book_id" :book="book" variant="order"/>
        </template>
      </template>
    </div>
    <div v-if="products.length > 0" class="footer">
      <div class="total">Общая стоимость: {{ total }} ₽</div>
      <div>Адрес: {{ address }}</div>
      <div>Получатель: {{ name }}</div>
    </div>
  </div>
</template>

<script setup>

import TheBook from "@/components/TheBook.vue";
import { ref, onMounted } from 'vue'
import { getOneOrder } from '../api/api';
import { useStore } from 'vuex';
import { useRoute } from "vue-router";

const store = useStore();
const route = useRoute();

const products = ref([]);
const total = ref(0);
const address = ref('');
const name = ref('');

const loadProducts = async () => {
  const res = await getOneOrder(route.params.id);
  if (res === null) {
      return;
  }
  products.value = res.products;
  total.value = res.total;
  address.value = res.address;
  name.value = res.name;
};

onMounted(loadProducts);

</script>

<style scoped>

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 50px;
}

.books{
  width: 100%;
  padding: 0 80px;
  margin-top: 50px;
  display: flex;
  flex-wrap: wrap;
  gap: 5%;
  align-items: center;
  justify-content: center;
}

.total {
  font-weight: bold;
}

.footer {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

</style>
