<template>
  <MessageDialog :message="message" @close="message=''"/>
  <div class="container">
    <div v-if="store.state.profile === null" class="warning">
      <h1>Вход не выполнен</h1>
    </div>
    <template v-else>
      Укажите адрес и получателя и после оплаты мы отправим ваш заказ почтой
      <span>
        <div class="label">Адрес</div>
        <InputText v-model="address" class="p-inputtext-sm field" />
      </span>
      <span>
        <div class="label">Получатель</div>
        <InputText v-model="name" class="p-inputtext-sm field" />
      </span>
      <Button label="Оплатить" @click="onBuy()" severity="success" class="pay" />
    </template>
  </div>
</template>

<script setup>

import MessageDialog from '@/components/MessageDialog.vue';
import { ref } from 'vue'
import { createOrder } from '../api/api';
import { useStore } from 'vuex';

const store = useStore();

const message = ref("");
const address = ref("");
const name = ref(store.state.profile.full_name);

const onBuy = async () => {
  const res = await createOrder(address.value, name.value);
  if (res === null) {
    message.value = "Что-то пошло не так";
    return;
  }
  window.location.href = res;
}

</script>

<style scoped>

.container{
  width: 100%;
  padding: 0 80px;
  margin: 50px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.label {
  font-size: 12px;
}

.field {
  width: 400px;
}

.pay {
  width: 200px;
}

.warning {
  display: flex;
  justify-content: center;
}

</style>
