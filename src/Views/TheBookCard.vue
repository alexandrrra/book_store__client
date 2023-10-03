<template>
  <div class="container">
    <template v-if="book !== null">
      <the-book :book="book" variant="card"/>
      <div class="controls" v-if="store.state.profile !== null && store.state.profile.role === 'admin'">
        <Button label="Редактировать" @click="router.push(`/book-editor/${book.book_id}`)"/>
      </div>
    </template>
    <h1 v-else class="msg">Что-то пошло не так</h1>
  </div>
</template>

<script setup>
import TheBook from "@/components/TheBook.vue";
import {onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {getOneBook} from "@/api/api";
import { useStore } from 'vuex';

const route = useRoute();
const router = useRouter();
const store = useStore()

const book = ref(null);

const loadBook = async () => {
  book.value = await getOneBook(route.params.id);
}

watch(() => route.params.id, loadBook, { immediate: true });

onMounted(loadBook);

</script>

<style scoped>

.container {
  padding: 50px 80px;
}

.controls {
  padding: 16px 8px;
  text-align: center;
}

.msg {
  text-align: center;
}

</style>