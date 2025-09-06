<script setup lang="ts">
  import {ref} from 'vue';
  const cityInputText = ref('');
  const emit = defineEmits(['cityName'])

  function onInput(): void {
    emit('cityName', cityInputText.value)
  }

</script>

<template>
  <input v-model="cityInputText" @input="onInput()" placeholder="City"/>
</template>
