<script>
import Datepicker from "vue3-datepicker";
import { fetchSales, deleteSale } from "../store/orders";
import { AnOutlinedEdit } from "@kalimahapps/vue-icons";
import { FlDelete } from "@kalimahapps/vue-icons";

export default {
  components: { Datepicker, AnOutlinedEdit, FlDelete },
  data() {
    return {
      searchQuery: "",
      wherehouses: [],
      sales: [],
      isWarehouseValid: true,
      sortOrder: "asc",
      errorMessage: "",
    };
  },
  computed: {
    filterSearch() {
      const filtered = this.sales
        .filter((sale) => {
          const warehouseName = this.wherehouses.find(
            (warehouse) => warehouse.id === sale.wherehouses_id
          )?.name;

          return (
            sale.date?.toString().includes(this.searchQuery) ||
            sale.total?.toString().includes(this.searchQuery) ||
            sale.sale_id?.toString().includes(this.searchQuery) ||
            (warehouseName &&
              warehouseName.toString().includes(this.searchQuery))
          );
        })
        .sort((a, b) =>
          this.sortOrder === "asc"
            ? a.sale_id - b.sale_id
            : b.sale_id - a.sale_id
        );
      return filtered;
    },
  },
  methods: {
    async loadInitialData() {
      try {
        this.sales = await fetchSales();
        console.log(this.sales);
      } catch (error) {
        this.errorMessage = "Ошибка загрузки данных.";
        console.error(error.message);
      }
    },

    async removeSale(id) {
      try {
        await deleteSale(id);

        this.sales = this.sales.filter((sale) => sale.id !== id);
        await this.loadInitialData();
      } catch (error) {
        this.errorMessage = "Ошибка удаления продажи.";
        console.error(error.message);
      }
    },

    toggleSortOrder() {
      this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
    },
  },
  mounted() {
    this.loadInitialData();
  },
};
</script>

<template>
  <div class="p-4">
    <h1 class="mb-4 text-xl font-bold">Список заказов</h1>
    <div class="flex items-center justify-between gap-3 my-3">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Поиск (Ctrl+F)"
        class="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
      />
      <button
        @click="toggleSortOrder"
        class="flex items-center px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        <span>Сортировка</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          :class="{ 'transform rotate-180': sortOrder === 'desc' }"
          class="w-5 h-5 ml-2 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 15l7-7 7 7"
          />
        </svg>
      </button>
      <router-link to="/createorders">
        <button
          class="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Создать
        </button>
      </router-link>
    </div>
    <div
      :style="{ scrollbarWidth: 'none', msOverflowStyle: 'none' }"
      class="w-full max-h-screen md:max-h-[83vh] mt-4 overflow-auto"
    >
      <table class="w-full border border-gray-200 table-auto">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-4 py-2 border">Дата</th>

            <th class="px-4 py-2 border">Склад</th>
            <th class="px-4 py-2 border">Сумма</th>
            <th class="px-0 py-2 border">Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(sale, index) in filterSearch" :key="index">
            <td class="px-4 py-2 border">{{ sale.date }}</td>
            <td class="px-4 py-2 border">
              {{ sale.warehouse_name }}
            </td>
            <td class="px-4 py-2 border">{{ sale.total }}</td>
            <td
              class="flex items-center justify-center gap-4 px-0 py-2 text-center border"
            >
              <router-link :to="`/createorders/${sale.sale_id}`">
                <AnOutlinedEdit
                  class="w-5 h-5 text-blue-600 cursor-pointer"
                />
              </router-link>
              <FlDelete
                @click="removeSale(sale.sale_id)"
                class="w-5 h-5 text-red-600 cursor-pointer"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
