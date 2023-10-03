<template>
  <div class="container">
    <div class="books">
      <div v-if="store.state.profile === null">
        <h1>Вход не выполнен</h1>
      </div>
      <template v-else>
        <template v-if="favorites.length > 0">
          <the-book v-for="book of favorites" :key="book.book_id" :book="book" variant="favorite" @remove="onRemove(book.book_id)"/>
        </template>
        <h1 v-else>Спиок избранного пуст</h1>
      </template>
    </div>
  </div>
</template>

<script setup>

import TheBook from "@/components/TheBook.vue";
import { ref, onMounted } from 'vue'
import { getFavorites } from '../api/api';
import { useStore } from 'vuex';

const store = useStore();
const favorites = ref([]);

const loadFavorites = async () => {
  const newFavorites = await getFavorites();
  if (newFavorites === null) {
      return;
  }
  favorites.value = [...newFavorites];
};

onMounted(loadFavorites);

const onRemove = id => {
  favorites.value = favorites.value.filter(x => x.book_id !== id);
};

</script>

<style scoped>

.container {
  display: flex;
}

.books{
  width: 100%;
  padding: 0 80px;
  margin: 50px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 5%;
  align-items: center;
  justify-content: center;
}

</style>
