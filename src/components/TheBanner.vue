<template>
  <div class="banner" id="banner">
    <h1>Лучшие книги <br> по мнению покупателей</h1>
    <div class="banner-shelf">
      <Carousel :value="books" :numVisible="3" :numScroll="1" :showNavigators="false" :showIndicators="false" circular :autoplayInterval="3000">
          <template #item="slotProps">
              <img :src="slotProps.data.image_url" :alt="slotProps.data.title" @click="router.push(`/books/${slotProps.data.book_id}`)" class="image"/>
          </template>
      </Carousel>
      <img src="@/assets/img/shelf.png" alt="" class="shelf">
    </div>
  </div>
</template>

<script setup>
  import {ref, onMounted} from "vue";
  import { getBestsellers } from '../api/api';
  import { useRouter } from "vue-router";

  const router = useRouter();

  const books = ref([]);

  onMounted(async () => {
    const newBooks = await getBestsellers();
    if (newBooks === null) {
        return;
    }
    books.value = newBooks;
  });
</script>

<style scoped>
.banner{
  background-image: url("@/assets/img/background.jpg");
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 80px;
}

.banner h1{
  margin-top:0;
  font-family: 'Playfair', serif;
  font-size: 50px;
  font-weight:bold;
  color:var(--white);

}

.banner-shelf{
  width:55%;
  margin-top: 180px;
}

.image {
  padding: 0 20px;
  margin-top:100px;
  width:90%;
}

.shelf{
  margin-top:-65px;
  padding-bottom:65px;
}

</style>