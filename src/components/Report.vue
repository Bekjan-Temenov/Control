<script>
import { fetchSales } from "../store/orders.js";

export default {
  data() {
    return {
      sales: [],
      startDate: "", // Начальная дата
      endDate: "", // Конечная дата
      showModal: false, // Показывает модальное окно
      warehouses: [], // Список складов
      selectedWarehouse: null, // Выбранный склад
    };
  },
  computed: {
    totalSum() {
      return (
        this.selectedWarehouse?.items.reduce(
          (totalQty, item) => totalQty + item.quantity,
          0
        ) || 0
      );
    },
    grandTotalSum() {
      return (
        this.selectedWarehouse?.items.reduce(
          (totalSum, item) => totalSum + item.quantity * item.price,
          0
        ) || 0
      );
    },

    productQuantity(items) {
      return items.reduce((item, sum) => sum + item.quantity, 0);
    },
  },
  methods: {
    async fetchWherehouses() {
      try {
        const params = new URLSearchParams();
        if (this.startDate) params.append("start_date", this.startDate);
        if (this.endDate) params.append("end_date", this.endDate);

        const response = await fetchSales(params.toString());
        this.sales = Array.isArray(response) ? response : [];

        this.warehouses = this.sales.map((sale) => ({
          warehouse_name: sale.warehouse_name,
          total: sale.total,
        }));
      } catch (error) {
        console.error("Ошибка получения данных:", error);
      }
    },
    selectWarehouse(warehouseName) {
      this.selectedWarehouse = this.sales.find(
        (sale) => sale.warehouse_name === warehouseName
      );
      this.showModal = false;
    },
    applyFilter() {
      this.fetchWherehouses();
    },
  },
  mounted() {
    this.fetchWherehouses();
  },
};
</script>

<template>
  <div class="h-screen overflow-y-auto">
    <div class="flex items-center justify-end">
      <button
        @click="showModal = true"
        class="px-4 py-2 mb-2 ml-4 text-white bg-green-500 rounded mt-9"
      >
        Выбрать склад
      </button>
    </div>
    <table
      class="w-full text-sm border border-collapse border-black table-auto"
    >
      <thead>
        <tr class="bg-green-300">
          <th class="flex flex-col gap-2 py-4 text-center">
            <p>Продукт</p>
            <p class="text-center border-t border-black">Склад</p>
          </th>
          <th class="px-4 py-2 border border-black">Количество</th>
          <th class="px-4 py-2 border border-black">Цена</th>
          <th class="px-4 py-2 border border-black">Сумма</th>
        </tr>
      </thead>
      <tbody v-if="selectedWarehouse">
        <tr class="text-xl font-bold bg-green-100">
          <td class="px-4 py-2 border border-black">
            {{ selectedWarehouse.warehouse_name }}
          </td>
          <td class="px-4 py-2 border border-black">{{ totalSum }}</td>
          <td class="px-4 py-2 border border-black"></td>
          <td class="px-4 py-2 border border-black">
            {{ grandTotalSum }}
          </td>
        </tr>
        <tr v-for="(item, index) in selectedWarehouse.items" :key="index">
          <td class="px-4 py-2 border border-black">{{ item.product_name }}</td>
          <td class="px-4 py-2 border border-black">{{ item.quantity }}</td>
          <td class="px-4 py-2 border border-black">{{ item.price }}</td>
          <td class="px-4 py-2 border border-black">
            {{ item.quantity * item.price }}
          </td>
        </tr>
      </tbody>
      <tr v-else>
        <td class="px-4 py-2 text-center border border-black" colspan="4">
          Склад не выбран или данные отсутствуют
        </td>
      </tr>
      <tfoot>
        <tr class="text-xl font-bold bg-green-100">
          <td class="px-4 py-2 border border-black">Итого</td>
          <td class="px-4 py-2 border border-black">{{ totalSum }}</td>
          <td class="px-4 py-2 border border-black"></td>
          <td class="px-4 py-2 border border-black">{{ grandTotalSum }}</td>
        </tr>
      </tfoot>
    </table>

    <div
      v-if="showModal"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="w-1/3 p-6 bg-white rounded-md h-[90%] overflow-y-scroll">
        <div class="flex flex-col mb-4">
          <label for="startDate" class="mr-2">Начальная дата:</label>
          <input
            id="startDate"
            type="date"
            v-model="startDate"
            class="p-1 border"
          />

          <label for="endDate" class="mx-4">Конечная дата:</label>
          <input
            id="endDate"
            type="date"
            v-model="endDate"
            class="p-1 border"
          />

          <button
            @click="applyFilter"
            class="px-4 py-2 ml-4 text-white bg-blue-500 rounded"
          >
            Применить фильтр
          </button>
        </div>
        <h2 class="mb-4 text-lg font-bold">Выберите склад</h2>
        <table
          class="w-full text-sm border border-collapse border-black table-auto"
        >
          <thead>
            <tr class="bg-gray-300">
              <th class="px-4 py-2 border border-black">Склад</th>
              <th class="px-4 py-2 border border-black">Сумма</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(warehouse, index) in warehouses"
              :key="index"
              @click="selectWarehouse(warehouse.warehouse_name)"
              class="cursor-pointer hover:bg-gray-200"
            >
              <td class="px-4 py-2 border border-black">
                {{ warehouse.warehouse_name }}
              </td>
              <td class="px-4 py-2 border border-black">
                {{ warehouse.total }}
              </td>
            </tr>
          </tbody>
        </table>

        <button
          @click="showModal = false"
          class="px-4 py-2 mt-4 text-white bg-red-500 rounded"
        >
          Закрыть
        </button>
      </div>
    </div>
  </div>
</template>
