<template>
  <header class="header-container">
    <div class="header_container__logo">
      <router-link to="/" class="header-container__logo-name">Буклиб</router-link>
      <span>Интернет-магазин книг</span>
    </div>

    <div class="header">
      <Button @click="router.push('/catalog')">
        <font-awesome-icon icon="book" class="icon-book"/>
        <span style="padding-left: 8px">Каталог</span>
      </Button>
      <div class="book-search">
        <AutoComplete v-model="query" optionLabel="description" placeholder="Я ищу..." :suggestions="books" @complete="search" @item-select="change"/>
        <div class="search">
          <font-awesome-icon icon="search" class="icon-search"/>
        </div>
      </div>
    </div>

    <div class="header-right">
        <MessageDialog :message="message" @close="message=''"/>
        <LoginDialog v-if="loginDialogVisible" @auth="onLoginAuth()" @cancel="onLoginCancel()" />
        <div @click="onNavClick('/profile/view')" :class="['pointer', route.name === 'Profile' ? 'active' : 'normal']">
          <div class="header-right-item">
            <font-awesome-icon icon="user" class="icon"/>
            <span>{{ store.state.profile !== null ? store.state.profile.login : "Войти" }}</span>
          </div>
        </div>
        <div @click="onNavClick('/favorite')" :class="['pointer', route.path === '/favorite' ? 'active' : 'normal']">
          <div class="header-right-item">
            <font-awesome-icon icon="heart" class="icon"/>
            <span>Избранное</span>
          </div>
        </div>
        <div @click="onNavClick('/cart')" :class="['pointer', route.path === '/cart' ? 'active' : 'normal']">
          <div class="header-right-item">
            <font-awesome-icon icon="shopping-cart" class="icon"/>
            <span>Корзина</span>
            <div v-if="store.state.productsCount > 0" class="badge">{{ store.state.productsCount }}</div>
          </div>
        </div>
      </div>
  </header>
</template>

<script setup>

import { useStore } from 'vuex'
import { useRouter, useRoute  } from "vue-router";
import LoginDialog from '@/components/LoginDialog.vue';
import MessageDialog from '@/components/MessageDialog.vue';
import { ref } from 'vue'
import { getBooks } from '@/api/api';

const store = useStore();
const router = useRouter();
const route = useRoute();
const loginDialogVisible = ref();
const message = ref('');
const query = ref('');
const books = ref([]);

const onNavClick = path => {
  if (store.state.profile !== null) {
    router.push(path);
  } else if (path === "/profile/view") {
    loginDialogVisible.value = true;
  } else {
    message.value = "Вход не выполнен";
  }
};

const onLoginAuth = () => {
  loginDialogVisible.value = false;
  router.push("/");
};

const onLoginCancel = () => {
  loginDialogVisible.value = false;
};

const search = async e => {
  const newBooks = await getBooks(false, {query: e.query});
  books.value = newBooks.map(book => ({...book, description: book.title + " " + book.author, query: e.query}));
};

const change = e => {
  router.push(`/books/${e.value.book_id}`);
  query.value = e.value.query;
};

</script>

<style scoped>

.header-container {
  background:white;
  width: 100%;
  /*display: grid;
  grid-template-columns: repeat(3, 1fr);*/
  display:flex;
  justify-content: space-around;
  align-items: center;
  border-bottom:1px solid var(--black);
}

.header_container__logo{
  display: flex;
  flex-direction: column;
  align-items:center;
}

.header-container__logo-name {
  font-family: 'Playfair', serif;
  color:var(--black);
  font-size: 40px;
  font-weight:bold;
}

.header-container__logo-name:hover{
  color:var(--red);
}

.header_container__logo span{
  font-family: 'Playfair', serif;
}

.book-search{
  display:flex;
  justify-content:space-around;
}

.search{
  background-color:#6366F1;
  padding:10px;
  border-radius:5px;
}

.icon-search{
  padding-top:5px;
  color:var(--white);
}


.header-container__search-catalog{
  display:flex;
}

.catalog_link{
  color:var(--white);
  font-weight:bold;
}

.header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon-book{
  color:var(--white);
  padding-left:5px;
}

.header-right {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  padding: 0 16px;
}

.header-right-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.icon {
  padding: 8px;
  width: 24px;
  height: 24px;
}

.active {
  color: #F76C6C;
}

.normal {
  color: #2f2e2e;
}

.header-right-item span {
  font-size: 14px;
}

.pointer {
  cursor: pointer;
}

.badge {
  background-color: #F76C6C;
  border-radius: 8px;
  width: 16px;
  height: 16px;
  position: absolute;
  right: 0;
  top: 0;
  font-size: 12px;
  text-align: center;
  color: white;
}

</style>
