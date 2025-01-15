<script>
import { updateSale } from "../store/orders"; 

export default {
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    sale: {
      type: Object,
      required: true,
    },
    wherehouses: {
      type: Array,
      required: true,
    },
  },
  methods: {
    async submitEdit() {
      try {
        await updateSale(this.sale);

        this.$emit("update-sale", this.sale);
        this.close();
      } catch (error) {
        this.$emit("error", "Ошибка обновления продажи");
      }
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>
<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50"
  >
    <div class="p-6 bg-white rounded-lg w-96">
      <h2 class="mb-4 text-xl font-bold">Редактирование заказа</h2>
      <form @submit.prevent="submitEdit">
        <div class="mb-4">
          <label for="date" class="block">Дата</label>
          <input
            v-model="sale.date"
            type="date"
            id="date"
            class="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div class="mb-4">
          <label for="warehouse" class="block">Склад</label>
          <select
            v-model="sale.warehouse_id"
            id="warehouse"
            class="w-full px-3 py-2 border rounded"
            required
          >
            <option
              v-for="warehouse in wherehouses"
              :key="warehouse.id"
              :value="warehouse.id"
            >
              {{ warehouse.name }}
            </option>
          </select>
        </div>
        <div class="mb-4">
          <label for="total" class="block">Сумма</label>
          <input
            v-model="sale.total"
            type="number"
            id="total"
            class="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div class="flex justify-end gap-4">
          <button
            type="button"
            @click="close"
            class="px-4 py-2 bg-gray-300 rounded"
          >
            Отмена
          </button>
          <button
            type="submit"
            class="px-4 py-2 text-white bg-blue-500 rounded"
          >
            Сохранить
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
