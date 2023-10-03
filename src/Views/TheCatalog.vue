<template>
  <div class="container">
    <div class="filter-books">
      <div class="filter">
        <the-filter @apply-filter="applyFilter"></the-filter>
      </div>
      <div class="name-and-catalog">
        <h1>Каталог</h1>
        <div class="catalog">
          <the-book v-for="book of books" :key="book.book_id" :book="book" variant="catalog"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import TheBook from "@/components/TheBook.vue";
import TheFilter from "@/components/TheFilter.vue";
import { onMounted, ref } from "vue";
import { getBooks } from "@/api/api";

const books = ref([]);

onMounted(async () => {
  books.value = await getBooks();
});

const applyFilter = async (filter) => {
  books.value = await getBooks(false, filter);
};

</script>

<style scoped>

.container{
  display:flex;
}

.filter-books {
  display: flex;
  justify-content: space-around;
}

.filter {
  width: 20%;
  margin: 30px 0;
}

.name-and-catalog{
  width: 70%;
  /*margin-top:70px;*/
}

.name-and-catalog h1{
  margin-top: 70px;
  align-self: start;
}

.catalog {
  margin: 50px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 5%;
  align-items: center;
  justify-content: center;
}
</style>
