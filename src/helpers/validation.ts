import { formatNumber } from '@/helpers/formats';

const MIN_INITIAL_VALUE = 0;
const MIN_ITERATIONS = 1;
const MAX_ITERATIONS = 10_000;
const MIN_PERCENT = 0;
const MAX_PERCENT = 10_000;
const MIN_ADDITIONAL_PRICE = 0;

export const validationRules = {
  initialPrice: [
    (v: number|undefined) => typeof v === 'number' || 'Обов\'язкове поле',
    (v: number) => (v >= MIN_INITIAL_VALUE) || `Мінімальне значення: ${MIN_INITIAL_VALUE}`,
  ],
  iterations: [
    (v: number|undefined) => typeof v === 'number' || 'Обов\'язкове поле',
    (v: number) => (v >= MIN_ITERATIONS && v <= MAX_ITERATIONS) || `Дозволена кількість ітерацій від ${MIN_ITERATIONS} до ${formatNumber(MAX_ITERATIONS)}`,
  ],
  iterationPercents: [
    (v: number|undefined) => typeof v === 'number' || 'Обов\'язкове поле',
    (v: number) => (v >= MIN_PERCENT && v <= MAX_PERCENT) || `Процент повинен бути в межах від ${MIN_PERCENT} до ${formatNumber(MAX_PERCENT)}`,
  ],
  additionalIterationPrice: [
    (v: number) => (v >= MIN_ADDITIONAL_PRICE) || `Мінімальне значення додаткового вкладення: ${MIN_ADDITIONAL_PRICE}`,
  ],
};
