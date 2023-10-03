<template>
  <MessageDialog :message="message" @close="message=''"/>
  <div class='book'>
    <h1 v-if="!store.state.profile || store.state.profile.role!=='admin'" class="msg">Вход не выполнен</h1>
    <h1 v-else-if="error" class="msg">Что-то пошло не так</h1>
    <template v-else>
      <img :src="image_url" :alt="title" class="book-image" @click="image_input.click()">
      <input
          ref="image_input"
          type="file"
          accept=".jpg, .jpeg"
          style="display: none"
          @change="onImageInputChange($event)"
      />
      <span>
        <div class="label">Название</div>
        <InputText v-model="title" class="p-inputtext-sm field" />
      </span>
      <span>
        <div class="label">Автор</div>
        <AutoComplete v-model="author" dropdown :suggestions="authors" @complete="searchAuthor" class="field"/>
      </span>
      <span>
        <div class="label">Цена</div>
        <InputNumber showButtons mode="currency" currency="RUB" v-model="price" class="p-inputtext-sm field" />
      </span>
      <span class="group">
        <div class="label">Жанр</div>
        <div v-for="genre of genres" :key="genre.genre_id" class="row item">
          <div class="cell">{{ genre.genre_name }}</div>
          <Button icon="pi pi-times" text @click="onGenreRemove(genre.genre_name)"/>
        </div>
        <div v-if="genres.length === 0" class="cell">Нет жанра</div>
        <div class="row">
          <AutoComplete v-model="currentGenre" optionLabel="genre_name" dropdown :suggestions="currentGenres" @complete="searchGenre" class="field"/>
        </div>
        <Button label="Задать жанр" @click="onGenreAdd()" class="field" />
      </span>
      <span>
        <div class="label">Издатель</div>
        <AutoComplete v-model="publishment" optionLabel="publishment_name" dropdown :suggestions="publishments" @complete="searchPublishment" class="field"/>
      </span>
      <span class="controls">
        <Button label="Сохранить" @click="onSaveClick()" />
      </span>
    </template>
  </div>
</template>

<script setup>

import MessageDialog from '@/components/MessageDialog.vue';
import { ref, onMounted } from 'vue';
import { getOneBook, getAuthors, getGenres, getPublishments, createBook, updateBook, uploadImage, patchImageUrl } from '../api/api';
import { useRoute } from "vue-router";
import router from '@/router';
import { useStore } from 'vuex';

const store = useStore()
const route = useRoute();

const message = ref("");
const error = ref(false);

const book_id = ref();

const image_input = ref();
const image_url = ref(patchImageUrl('uploads/no-image.jpg'));
const image_file = ref();

const title = ref("");

const author = ref('');
const authors = ref([]);

const price = ref(0);

const currentGenre = ref();
const currentGenres = ref([]);
const genres = ref([]);

const publishment = ref();
const publishments = ref([]);

onMounted(async () => {
  if (route.name === "EditBook") {
    const book = await getOneBook(route.params.id);
    if (book === null) {
      error.value = true;
      return;
    }
    book_id.value = book.book_id;
    image_url.value = book.image_url;
    title.value = book.title;
    author.value = book.author;
    price.value = book.price;
    genres.value = book.genres;
    publishment.value = book.publishment_name;
  }
});

const searchAuthor = async e => {
  authors.value = await getAuthors(e.query);
}

const searchGenre = async e => {
  currentGenres.value = await getGenres(e.query);
}

const searchPublishment = async e => {
  publishments.value = await getPublishments(e.query);
}

const onSaveClick = async () => {
  const bookId = await (book_id.value ? updateBook : createBook)(
    {
      book_id: book_id.value,
      title: title.value,
      author: author.value,
      price: price.value,
      genres: genres.value,
      publishment: publishment.value
    }
  );
  if (bookId === null) {
    message.value = "Что-то пошло не так";
    return;
  }
  book_id.value = bookId;
  if (image_file.value) {
    const res = await uploadImage(bookId, image_file.value);
    if (!res) {
      message.value = "Что-то пошло не так";
      return;
    }
  }
  router.push(`/books/${bookId}`);
}

const onImageInputChange = async e => {
    if (e.target.files) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            if (reader.result === null) {
                message.value = "Что-то пошло не так";
                return;
            }
            const dataUrl = "data:image/;base64," + reader.result.split(",")[1];
            image_url.value = dataUrl;
            image_file.value = file;
        };
        reader.readAsDataURL(file);
    }
    image_input.value.value = "";
};

const onGenreRemove = genre_name => {
  genres.value = genres.value.filter(genre => genre.genre_name !== genre_name);
}

const onGenreAdd = () => {
  const genre_name = (currentGenre.value && currentGenre.value.genre_name) || currentGenre.value;
  if (!genre_name) {
    return;
  }
  currentGenre.value = "";
  for (const genre of genres.value) {
    if (genre.genre_name === genre_name) {
      return;
    }
  }
  genres.value = [...genres.value, {genre_name}];
}

</script>

<style scoped>

.book {
  width: 100%;
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.label {
  font-size: 12px;
}

.field {
  width: 300px;
}

.book-image{
  display: block;
  margin-bottom: 20px;
  cursor: pointer;

}
.controls {
  padding-top: 12px;
}

.msg {
  margin: 30px 0;
}

.group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.row {
  display: flex;
  align-items: center;
}

.cell {
  margin-right: auto;
}

.item {
  border: silver 1px dashed;
  border-radius: 8px;
  padding: 0 0 0 8px;
}

</style>