<template>
  <div class="new-books">
    <Carousel :value="books" :numVisible="5" :numScroll="1" circular >
        <template #item="slotProps">
            <img :src="slotProps.data.image_url" :alt="slotProps.data.title" @click="router.push(`/books/${slotProps.data.book_id}`)" class="image"/>
        </template>
    </Carousel>
  </div>
</template>

<script setup>

import {ref, onMounted} from 'vue'
import { getBooks } from '../api/api';
import { useRouter } from "vue-router";

const router = useRouter();

const books = ref([])

onMounted(async () => {
  books.value = await getBooks(true)
})

</script>

<style scoped>
.new-books{
  padding: 0 80px;
  margin: 40px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 5%;
  align-items: center;
  justify-content: center;
  cursor:pointer;
}

.image {
  padding: 0 4px;
}

</style>