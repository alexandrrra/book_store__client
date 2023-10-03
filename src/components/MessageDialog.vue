<template>
  <Dialog :visible="message!=''" modal :closable="false" header="Сообщение">
    {{ message }}
    <template #footer>
      <div class="controls">
        <Button label="OK" @click="onClose()" style="width: 100px" />
      </div>
    </template>
  </Dialog>
</template>

<script setup>

defineProps({
  message: {
    type: String,
    required: true
  }
})
const emit = defineEmits(['close']);

const onClose = async () => {
  emit("close");
};

</script>

<style scoped>
.controls {
  display: flex;
  gap: 8px;
  flex-direction: column;
  align-items: center;
  padding-left: 8px;
}
</style>
