<template>
  <v-container>
    <v-card border>
      <v-form @submit.prevent="onSubmit">
        <v-card-title>Розрахунок вкладення</v-card-title>
        <v-card-text>
          <v-alert
            v-if="initialPrice < 1"
            type="warning"
            class="mb-3"
          >
            Неможливо вирахувати дохідність в % без початкової суми
          </v-alert>

          <v-text-field
            v-model.number="initialPrice"
            :rules="rules.initialPrice"
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

    <v-checkbox
      v-model="showIterationRevenue"
      label="Показувати прибуток між ітераціями"
      class="mt-5"
    />

    <v-list
      v-if="calculatedIterations.length"
      :lines="showIterationRevenue ? 'two' : undefined"
      border
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
          <div>
            <v-list-item-action
              v-if="iteration.yieldPercents"
              class="text-right"
            >
              {{ iteration.yieldPercents }}%
            </v-list-item-action>
            <div
              v-if="showIterationRevenue && iteration.revenue"
              class="text-green text-right"
            >
              +{{ iteration.revenue }}
            </div>
          </div>
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
  revenue?: number;
  yieldPercents: number|string;
}

const initialPrice = ref(1);
const iterations = ref(12);
const iterationPercents = ref(10);
const additionalIterationPrice = ref(0);
const showIterationRevenue = ref(false);

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
  const initialValue = initialPrice.value;

  if (!prevIteration) {
    return {
      id,
      price: formatPrice(initialValue),
      yieldPercents: initialValue ? 100 : null,
    };
  }

  const revenueByPercent = (prevIteration.price * iterationPercents.value) / 100;
  const priceWithPercent = prevIteration.price + revenueByPercent;
  const price = formatPrice(priceWithPercent, additionalIterationPrice.value);
  const revenue = revenueByPercent + additionalIterationPrice.value;
  const yieldPercents = initialValue ? Math.round((price / initialValue) * 10_000) / 100 : null;

  return {
    id,
    price,
    revenue,
    yieldPercents,
  };
}

function formatPrice(value: number, additionalPrice = null) {
  const price = additionalPrice ? value + additionalPrice : value;
  return Math.round(price * 1_000_000) / 1_000_000;
}
</script>
