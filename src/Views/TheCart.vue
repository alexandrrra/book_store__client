<template>
  <div class="container">
    <div class="books">
      <div v-if="store.state.profile === null">
        <h1>Вход не выполнен</h1>
      </div>
      <template v-else>
        <template v-if="products.length > 0">
          <the-book v-for="book of products" :key="book.book_id" :book="book" variant="cart" @remove="onRemove(book.book_id)" @change="onChange(book.book_id, $event)"/>
        </template>
        <h1 v-else>Корзина пуста</h1>
      </template>
    </div>
    <div v-if="products.length > 0" class="footer">
      <div class="total">Общая стоимость: {{ total }} ₽</div>
      <Button label="Оформить заказ" @click="router.push(`/orders`)" severity="success" />
    </div>
  </div>
</template>

<script setup>

import TheBook from "@/components/TheBook.vue";
import { ref, onMounted } from 'vue'
import { getProducts } from '../api/api';
import { useStore } from 'vuex';
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();

const products = ref([]);
const total = ref(0);

const updateTotal = newProducts => {
  let newTotal = 0;
  for (const product of newProducts) {
    newTotal += product.quantity * product.price;
  }
  total.value = newTotal;
}

const loadProducts = async () => {
  const newProducts = await getProducts();
  if (newProducts === null) {
      return;
  }
  products.value = newProducts;
  updateTotal(newProducts);
};

onMounted(loadProducts);

const onRemove = id => {
  const newProducts = products.value.filter(x => x.book_id !== id);
  products.value = newProducts;
  updateTotal(newProducts);
};

const onChange = (book_id, delta) => {
  const newProducts = products.value.map(product => product.book_id === book_id ? {...product, quantity: product.quantity + delta} : product);
  products.value = newProducts;
  updateTotal(newProducts);
};

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
