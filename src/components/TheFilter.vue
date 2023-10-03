<template>
  <div class="filters-container">
    <div class="filters-row">
      <h4>Цена</h4>
      <div class="inputs">
        <label class="filters-label">От:</label>
        <input type="number" v-model="minPrice" class="filters-input" />
        <label class="filters-label">До:</label>
        <input type="number" v-model="maxPrice" class="filters-input" />
      </div>
    </div>
    <div class="filters-row">
      <label class="filters-label">Автор</label>
      <div class="controls-row">
        <AutoComplete v-model="author" dropdown forceSelection :suggestions="authors" @complete="searchAuthor"  class="field"/>
        <Button icon="pi pi-times" text @click="author=''" />
      </div>
    </div>
    <div class="filters-row">
      <label class="filters-label">Жанр</label>
      <div class="controls-row">
        <AutoComplete v-model="genre" optionLabel="genre_name" dropdown forceSelection :suggestions="genres" @complete="searchGenre"  class="field"/>
        <Button icon="pi pi-times" text @click="genre=''"/>
      </div>
    </div>
    <div class="filters-row">
      <label class="filters-label">Издательство</label>
      <div class="controls-row">
        <AutoComplete v-model="publishment" optionLabel="publishment_name" dropdown forceSelection :suggestions="publishments" @complete="searchPublishment"  class="field"/>
        <Button icon="pi pi-times" text @click="publishment=''"/>
      </div>
    </div>
    <div class="flex">
      <Button label="Применить" @click="applyFilter()" size="small"/>
    </div>
  </div>
</template>

<script setup>

import { ref, onMounted } from "vue";
import { getPriceRange, getAuthors, getGenres, getPublishments } from '../api/api';

const emit = defineEmits(['apply-filter']);

const query = ref('');

const minPrice = ref(null);
const maxPrice = ref(null);

const author = ref('');
const authors = ref([]);

const genre = ref();
const genres = ref([]);

const publishment = ref();
const publishments = ref([]);

onMounted(async () => {
  const priceRange = await getPriceRange();
  if (priceRange === null) {
    return;
  }
  minPrice.value = priceRange[0];
  maxPrice.value = priceRange[1];
});

const searchAuthor = async e => {
  authors.value = await getAuthors(e.query);
}

const searchGenre = async e => {
  genres.value = await getGenres(e.query);
}

const searchPublishment = async e => {
  publishments.value = await getPublishments(e.query);
}

const applyFilter = () => {
  // Применение фильтров
  const filter = {
    query: query.value,
    minPrice: minPrice.value,
    maxPrice: maxPrice.value,
    author: author.value,
    genre: genre.value && genre.value.genre_id,
    publishment: publishment.value && publishment.value.publishment_id
  };
  // Вызываем событие для передачи фильтров в родительский компонент
  emit("apply-filter", filter);
};

</script>

<style scoped>
.filters-container {
  position:fixed;
  width:20%;
  margin-top:70px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f5f5f5;
}


.filters-row {
  margin-bottom: 20px;
}

.inputs{
  margin-top: 10px;
  display: flex;
  justify-content: space-around;
}

.filters-label {
  font-weight: bold;
}

.filters-input {
  width: 30%;
  padding: 5px;
  border: 1px solid gray;
  border-radius: 5px;
}

.controls-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.field {
  width: 90%;
}

</style>
