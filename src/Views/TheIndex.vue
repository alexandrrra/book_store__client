<template>
  <div class="container_banner">
    <the-banner></the-banner>
    <h1>Последние поступления</h1>
    <new-books></new-books>
  </div>
</template>

<script setup>
import TheBanner from "@/components/TheBanner.vue";
import NewBooks from "@/components/NewBooks.vue";
</script>

<style>
.container_banner{
  display:flex;
  flex-direction:column;
}
.container_banner h1{
  margin-top:40px;
  align-self:center;
}
</style>

