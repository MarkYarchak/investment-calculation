<template>
  <v-container>
    <v-card border>
      <v-form @submit.prevent="onSubmit">
        <v-card-title>Розрахунок вкладення</v-card-title>
        <v-card-text>
          <v-text-field
            v-model.number="initialValue"
            :rules="rules.initialValue"
            type="number"
            label="Початкова сума"
          />
          <v-text-field
            v-model.number="iterations"
            :rules="rules.iterations"
            type="number"
            label="Кількість ітерацій"
          />
          <v-text-field
            v-model.number="iterationPercents"
            :rules="rules.iterationPercents"
            type="number"
            label="Дохідність (%)"
            suffix="%"
          />
          <v-text-field
            v-model.number="additionalIterationPrice"
            :rules="rules.additionalIterationPrice"
            type="number"
            label="Додаткові регулярні вкладення (опціонально)"
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            type="submit"
            color="rgb(24,103,192)"
            variant="elevated"
          >
            <span class="px-2">Розрахувати</span>
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-form>
    </v-card>

    <v-list
      v-if="calculatedIterations.length"
      border
      class="mt-5"
    >
      <v-list-item
        v-for="iteration of calculatedIterations"
        :key="iteration.id"
        :ripple="false"
        @click="() => {}"
      >
        <v-list-item-subtitle>Ітерація {{ iteration.id }}</v-list-item-subtitle>
        <v-list-item-title>{{ iteration.price }}</v-list-item-title>
        <template v-slot:append>
          <v-list-item-action>{{ iteration.yieldPercents }}%</v-list-item-action>
        </template>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { validationRules as rules } from '@/helpers/validation';

interface CalculatedIteration {
  id: number;
  price: number;
  yieldPercents: number|string;
}

const initialValue = ref(0);
const iterations = ref(1);
const iterationPercents = ref(10);
const additionalIterationPrice = ref(0);

const calculatedIterations = ref<CalculatedIteration[]>([]);

function onSubmit() {
  calculatedIterations.value = getFormattedIterations();
}

function getFormattedIterations() {
  const formattedIterations: CalculatedIteration[] = [];

  for (let i = 0; i <= iterations.value; i += 1) {
    const prevIteration: CalculatedIteration = formattedIterations[i - 1] || null;
    const calculatedIteration = formatOneIteration(i, prevIteration);
    formattedIterations.push(calculatedIteration);
  }

  return formattedIterations;
}

function formatOneIteration(id: number, prevIteration: CalculatedIteration|null) {
  if (!prevIteration) {
    return {
      id,
      price: formatPrice(initialValue.value),
      yieldPercents: 100,
    };
  }

  const priceValue = prevIteration.price + ((prevIteration.price * iterationPercents.value) / 100);
  const price = formatPrice(priceValue, additionalIterationPrice.value);
  const yieldPercents = Math.round((price / initialValue.value) * 10_000) / 100;

  return {
    id,
    price,
    yieldPercents,
  };
}

function formatPrice(value: number, additionalPrice = null) {
  const price = additionalPrice ? value + additionalPrice : value;
  return Math.round(price * 1_000_000) / 1_000_000;
}
</script>
