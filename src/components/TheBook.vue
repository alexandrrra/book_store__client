<template>
  <MessageDialog :message="message" @close="message=''"/>
  <Toast />
  <div :class="['book', variant==='card' ? 'card' : '']">
    <router-link :to="`/books/${book.book_id}`">
      <img :src="book.image_url" :alt="book.title" class="book-image">
    </router-link>
    <router-link :to="`/books/${book.book_id}`" class="book-name">{{book.title}}</router-link>
    <span class="book-author">{{book.author}}</span>
    <span class="book-price">{{book.price}} ₽</span>
    <div class="controls" v-if="variant !== 'order'">
      <template v-if="variant === 'favorite'">
        <div class="controls-row">
          <Button label="Купить" text @click="onAddProductClick()"/>
          <Button text rounded @click="deleteFavoriteClick()">
            <font-awesome-icon icon="trash-can"/>
          </Button>
        </div>
      </template>
      <template v-else-if="variant === 'cart'">
        <div class="controls-row">
          <Button text rounded @click="setQuantityClick(quantity > 1 ? quantity - 1 : quantity)">
            <font-awesome-icon icon="minus"/>
          </Button>
          {{ quantity }}
          <Button text rounded @click="setQuantityClick(quantity + 1)">
            <font-awesome-icon icon="plus"/>
          </Button>
        </div>
        <div class="controls-row">
          <Button text rounded @click="deleteProductClick()">
            <font-awesome-icon icon="trash-can"/>
          </Button>
          <Button text rounded @click="addFavoriteClick()">
            <font-awesome-icon icon="heart" class="heart"/>
          </Button>
        </div>
      </template>
      <template v-else>
        <div class="controls-row">
          <Button label="Купить" text @click="onAddProductClick()"/>
          <Button text rounded @click="addFavoriteClick()">
            <font-awesome-icon icon="heart" class="heart"/>
          </Button>
        </div>
      </template>
    </div>
    <template v-else>
      {{ quantity }} шт.
    </template>
  </div>
  <div v-if="variant==='card'" class="feedbacks">
    <div class="rating">Рейтинг: {{ (rating && rating.toFixed(2)) || 'нет' }}</div>
    <div v-if="store.state.profile !== null" class="feedback personal">
      <div class="feedback-login">Ваш отзыв</div>
      <Rating v-model="userFeedback.rating" :cancel="false"/>
      <InputText v-model="userFeedback.body" class="p-inputtext-sm user-feedback-body" />
      <div class="feedback-controls">
        <Button :label="userFeedback.feedback_id ? 'Обновить' : 'Добавить'" @click="upsertFeedbackClick()" class="user-feedback-button" />
        <Button v-if="userFeedback.feedback_id" label="Удалить" @click="deleteFeedbackClick()" class="user-feedback-button" />
      </div>
    </div>
    <div v-for="feedback of feedbacks" :key="feedback.feedback_id" class="feedback">
      <div class="feedback-login">{{ feedback.login }}</div>
      <Rating v-if="feedback.rating" v-model="feedback.rating" readonly :cancel="false" />
      <div v-else>Без оценки</div>
      <div class="feedback-body">{{ feedback.body }}</div>
    </div>
  </div>
</template>

<script setup>

import MessageDialog from '@/components/MessageDialog.vue';
import { ref, defineProps } from 'vue';
import { addProduct, updateProduct, deleteProduct, addFavorite, deleteFavorite, deleteFeedback, createFeedback, updateFeedback } from '../api/api';
import { useToast } from 'primevue/usetoast';
import { useStore } from 'vuex';

const emit = defineEmits(['remove', 'change']);
const toast = useToast();
const store = useStore();

const message = ref("");

const props = defineProps({
  book: {
    type: Object,
    required: true,
  },
  variant: {
    type: String,
    required: true
  }
});

const rating = ref(props.book.rating);
const userFeedback = ref({...props.book.user_feedback});
const feedbacks = ref({...props.book.feedbacks});

const quantity = ref(props.book.quantity);

const onAddProductClick = async () => {
  if (store.state.profile === null) {
    message.value = "Вход не выполнен";
    return;
  }
  const res = await addProduct(props.book.book_id);
  if (res === null) {
    message.value = "Что-то пошло не так";
    return;
  }
  store.commit("setProductsCount", res.products_count);
  toast.add({ severity: 'info', detail: 'Добавлено в корзину', life: 2000, closable: false });
};

const setQuantityClick = async (newQuantity) => {
  const res = await updateProduct(props.book.book_id, newQuantity);
  if (res === null) {
    message.value = "Что-то пошло не так";
    return;
  }
  store.commit("setProductsCount", res.products_count);
  emit('change', newQuantity - quantity.value);
  quantity.value = newQuantity;
}

const deleteProductClick = async () => {
  const res = await deleteProduct(props.book.book_id);
  if (res === null) {
    message.value = "Что-то пошло не так";
    return;
  }
  store.commit("setProductsCount", res.products_count);
  emit("remove");
};

const addFavoriteClick = async () => {
  if (store.state.profile === null) {
    message.value = "Вход не выполнен";
    return;
  }
  const res = await addFavorite(props.book.book_id);
  if (!res) {
    message.value = "Что-то пошло не так";
    return;
  }
  toast.add({ severity: 'info', detail: 'Добавлено в избранное', life: 2000, closable: false });
};

const deleteFavoriteClick = async () => {
  const res = await deleteFavorite(props.book.book_id);
  if (!res) {
    message.value = "Что-то пошло не так";
    return;
  }
  emit("remove");
};

const upsertFeedbackClick = async () => {
  const res = await (userFeedback.value.feedback_id ? updateFeedback : createFeedback)(
    props.book.book_id, userFeedback.value.rating, userFeedback.value.body
  );
  if (!res) {
    message.value = "Что-то пошло не так";
    return;
  }
  rating.value = res.rating;
  userFeedback.value = res.user_feedback;
  feedbacks.value = res.feedbacks;
}

const deleteFeedbackClick = async () => {
  const res = await deleteFeedback(props.book.book_id);
  if (!res) {
    message.value = "Что-то пошло не так";
    return;
  }
  rating.value = res.rating;
  userFeedback.value = res.user_feedback;
  feedbacks.value = res.feedbacks;
}

</script>

<style scoped>

.book {
  width: 20%;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card {
  width: 100%;
}

.book-image{
  display: block;
  margin-bottom: 24px;
}

.book-name{
  display: block;
  color: black;
  font-size: 20px;
  font-weight: bold;
  line-height: 28px;
  margin-bottom: 8px;
  text-decoration: none;
}

.book-author{
  font-size: 16px;
}

.book-price{
  display: block;
  font-size: 18px;
  font-weight: bold;
  color: black;
}

.controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding-top: 8px;
}

.controls-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.heart {
  color: #F76C6C;
  width: 16px;
  height: 16px;
}

.feedbacks {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.feedback {
  display: flex;
  flex-direction: column;
  background-color:var(--bluegray-100);
  border-radius: 8px;
  padding: 8px;
  gap: 8px;
}

.feedback-login {
  font-weight: bold;
}

.feedback-body {
  font-style: italic;
}

.feedback-controls {
  display: flex;
  gap: 8px;
}

.personal {
  background-color: var(--yellow-100);
}

.rating {
  font-weight: bold;
}

</style>