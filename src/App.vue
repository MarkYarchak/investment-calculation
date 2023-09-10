<template>
  <v-app>
    <CalculationsForm />
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CalculationsForm from '@/components/CalculationsForm.vue';

export default defineComponent({
  name: 'App',
  components: {
    CalculationsForm,
  },
});
</script>
