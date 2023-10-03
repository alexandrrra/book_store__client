<template>
  <div class="container">
    <MessageDialog :message="message" @close="message=''"/>
    <div v-if="store.state.profile === null" class="no-login">
      <h1>Вход не выполнен</h1>
    </div>
    <template v-else>
      <div class="profile-navigation">
        <div class="profile-navigation-container">
          <div :class="['navigation-item', route.params.variant==='view' ? 'active' : '']" @click="setVariant('view')">
            <font-awesome-icon icon="user" class="icon" />
            <span>Профиль</span>
          </div>
          <div :class="['navigation-item', route.params.variant==='edit' ? 'active' : '']" @click="setVariant('edit')">
            <font-awesome-icon icon="pen" class="icon" />
            <span>Редактировать</span>
          </div>
          <div :class="['navigation-item', route.params.variant==='orders' ? 'active' : '']" @click="setVariant('orders')">
            <font-awesome-icon icon="book" class="icon" />
            <span>Заказы</span>
          </div>
          <div v-if="store.state.profile.role==='admin'" :class="['navigation-item']" @click="router.push('/book-editor')">
            <font-awesome-icon icon="plus" class="icon" />
            <span>Добавить книгу</span>
          </div>
          <div class="navigation-item exit" @click="onExitClick()">
            <font-awesome-icon icon="person-walking-arrow-right" class="icon" />
            <span>Выйти</span>
          </div>
        </div>
      </div>
      <div class="info">
        <div class="info-container">
          <template v-if="route.params.variant === 'view' || route.params.variant === 'edit'">
            <span v-for="field in profileFields" :key="field.name">
              <div class="label">{{ field.label }}</div>
              <InputText v-model="currentProfile[field.name]" class="p-inputtext-sm" :disabled="route.params.variant === 'view'" />
            </span>
            <template v-if="route.params.variant === 'edit'">
              <div class="label">Пароль</div>
              <Password v-model="password" :disabled="route.params.variant === 'view'" class="p-inputtext-sm" />
              <div class="flex">
                <Button label="Сохранить" @click="onSaveClick()" :disabled="isEqual(profile, currentProfile) && password.length == 0" />
              </div>
            </template>
          </template>
          <template v-else-if="route.params.variant === 'orders'">
            <div class="order" v-for="order of orders" :key="order.order_id" @click="router.push(`/orders/${order.order_id}`)">
              {{ order.order_id }}
              <div class="order-date">
                {{ new Date(order.order_date).toLocaleDateString() }}
              </div>
              <div class="order-total">
                {{ order.total }} ₽
              </div>
              <template v-if="order.pending">
                <template v-if="order.payment_id === ''">
                  <i class="pi pi-times error" />Завис
                </template>
                <template v-else>
                  <i class="pi pi-hourglass wait" />Ожидаем платеж
                </template>
              </template>
              <template v-else-if="order.canceled">
                <i class="pi pi-times error" />Отменен
              </template>
              <template v-else>
                <i class="pi pi-check-circle success" />Оплачен
              </template>
            </div>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>

import MessageDialog from '@/components/MessageDialog.vue';
import { useStore } from 'vuex';
import { inject, ref, onMounted } from 'vue'
import { getProfile, updateProfile, deleteToken, getOrders } from '../api/api';
import { useRouter, useRoute } from "vue-router";
import { isEqual } from "lodash";

const profileFields = [
  {
    name: "first_name",
    label: "Фамилия"
  },
  {
    name: "last_name",
    label: "Имя",
  },
  {
    name: "middle_name",
    label: "Отчество"
  },
  {
    name: "login",
    label: "Логин"
  },
  {
    name: "phone",
    label: "Телефон"
  },
  {
    name: "email",
    label: "Электропочта"
  }
];

const store = useStore()
const $cookies = inject('$cookies');
const router = useRouter();
const route = useRoute();

const message = ref("");
const profile = ref({});
const currentProfile = ref({});
const password = ref("");
const orders = ref([]);

const loadProfile = async showError => {
  const newProfile = await getProfile();
  if (newProfile === null) {
    if (showError) {
      message.value = "Что-то пошло не так";
    }
    return;
  }
  profile.value = { ...newProfile };
  currentProfile.value = { ...newProfile };
};

const loadOrders = async () => {
  const newOrders = await getOrders();
  if (newOrders === null) {
    message.value = "Что-то пошло не так";
    return;
  }
  orders.value = newOrders;
};

onMounted(route.params.variant === "orders" ? loadOrders : loadProfile);

const setVariant = newVariant => {
  if (route.params.variant === "edit") {
    currentProfile.value = { ...profile.value };
    password.value = "";
  }
  if (newVariant === "orders") {
    loadOrders();
  } else if (newVariant === "view" || newVariant === "edit") {
    loadProfile();
  }
  router.push(`/profile/${newVariant}`);
};

const onSaveClick = async () => {
  const newProfile = await updateProfile({ ...currentProfile.value, password: password.value });
  if (newProfile === null) {
    message.value = "Что-то пошло не так";
    return;
  }
  profile.value = { ...newProfile, password: "" };
  currentProfile.value = { ...newProfile, password: "" };
  store.commit("setProfile", newProfile)
  message.value = "Сохранено";
};

const onExitClick = async () => {
  await deleteToken();
  $cookies.remove("user_id");
  $cookies.remove("token");
  store.commit("setProfile", null);
  store.commit("setProductsCount", 0);
  router.push("/");
};

</script>

<style scoped>
.container {
  display: flex;
}

.profile-navigation {
  width: 40%;
}

.profile-navigation-container {
  width: 60%;
  border: 1px solid #A8D0E6;
  border-radius: 5px;
  margin: 20px auto;
}

.navigation-item {
  cursor: pointer;
  display: flex;
  justify-content: flex-start;
  padding: 10px 0 10px 10px;
}

.navigation-item span {
  padding-left: 10px;
}

.active {
  color: #F76C6C;
}

.info {
  width: 70%;
  padding: 24px 0 24px;
}

.info-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-right: 80px;
}

.label {
  font-size: 12px;
}

.icon {
  width: 16px;
  height: 16px;
  padding: 4px;
}

.flex {
  display: flex;
}

.no-login{
  width: 100%;
  padding: 0 80px;
  margin: 50px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.order {
  display: flex;
  background-color:var(--bluegray-100);
  border-radius: 8px;
  padding: 8px;
  gap: 8px;
  align-items: center;
  cursor: pointer;
}

.order-date {
  width: 100px;
}

.order-total {
  font-weight: bold;
  width: 100px;
}

.success {
  color: var(--green-500);
}

.error {
  color: var(--red-500);
}

.wait {
  color: var(--gray-500);
}

</style>
