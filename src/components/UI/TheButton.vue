<template>
  <button class="btn">
    <slot>
      <router-link>
        :to="to"
        class="btn"
      </router-link>
    </slot>
  </button>
</template>

<script setup>

const props = defineProps(
    {
      to:{
        type:String,
        required:true,
      }
    }
)

</script>

<style scoped>

.btn{
  background: var(--blue);
  padding-left: 16px;
  padding-right:16px;
  height:38px;
  color: white;
  cursor: pointer;
  font-size: 14px;
  border-radius: 5px;
}

.btn:hover{
  background: var(--dark-blue);
}
</style>