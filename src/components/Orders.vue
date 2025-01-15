<script>
import Datepicker from "vue3-datepicker";
import {
  fetchSales,
  createSale,
  updateSale,
  deleteSale,
  fetchWarehouses,
  fetchProducts,
} from "../store/orders";
import { AnOutlinedEdit } from "@kalimahapps/vue-icons";
import { FlDelete } from "@kalimahapps/vue-icons";
import { AkCircleX } from "@kalimahapps/vue-icons";
import ModalProduct from "./ModalProduct.vue";

export default {
  components: { Datepicker, AnOutlinedEdit, FlDelete, ModalProduct, AkCircleX },
  data() {
    return {
      isModalOpen: false,
      currentSale: {
        id: null,
        date: new Date(),
        warehouse: "",
        items: [],
      },
      searchQuery: "",
      wherehouses: [],
      products: [],
      sales: [],
      isWarehouseValid: true,
      sortOrder: "asc",
      errorMessage: "",
      openProductModal: false,
      selectedOrderIndex: null,
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
        [this.sales, this.wherehouses, this.products] = await Promise.all([
          fetchSales(),
          fetchWarehouses(),
          fetchProducts(),
        ]);
        console.log(this.products);
      } catch (error) {
        this.errorMessage = "Ошибка загрузки данных.";
        console.error(error.message);
      }
    },
    async saveSale() {
      const saleData = { ...this.currentSale };
      console.log("SaleData :", saleData);

      const warehouse = this.wherehouses.find(
        (wh) => wh.name.toLowerCase() === saleData.warehouse.toLowerCase()
      );
      if (!warehouse) {
        this.isWarehouseValid = false;
        return;
      }

      const formattedData = {
        wherehouses_id: warehouse.id,
        date: new Date(saleData.date).toISOString(),
        total: saleData.items.reduce(
          (sum, item) => sum + item.quantity * item.price,
          0
        ),
        items: saleData.items.map((item) => ({
          products_id: this.getProductIdByName(item.product),
          quantity: item.quantity,
          price: item.price,
        })),
      };

      try {
        if (saleData.id) {
          const updatedSale = await updateSale({
            ...formattedData,
            id: saleData.id,
          });

          const index = this.sales.findIndex((sale) => sale.id === saleData.id);
          if (index !== -1) {
            this.sales.splice(index, 1, {
              ...this.sales[index],
              ...formattedData,
              id: saleData.id,
              warehouse: warehouse.name,
            });
          }
        } else {
          const newSale = await createSale(formattedData);
          this.sales.push(newSale);
        }
        this.closeModal();
        await this.loadInitialData();
      } catch (error) {
        this.errorMessage = "Ошибка сохранения продажи.";
        console.error(error.message);
      }
    },
    editSale(sale) {
      const warehouse = this.wherehouses.find(
        (wh) => wh.id === sale.wherehouses_id
      );

      const items = Array.isArray(sale.items)
        ? sale.items
            .filter(
              (item) =>
                item.product_id !== null &&
                item.quantity !== null &&
                item.price !== null
            )
            .map((item) => ({
              product:
                this.products.find((p) => p.id === item.product_id)?.name || "",
              quantity: item.quantity || 0,
              price: item.price || 0,
              total: (item.quantity || 0) * (item.price || 0),
            }))
        : [];

      this.currentSale = {
        id: sale.sale_id,
        date: new Date(sale.date),
        warehouse: warehouse ? warehouse.name : "",
        items,
      };

      console.log("Текущая продажа (currentSale):", this.currentSale);

      this.isModalOpen = true;
    },

    getProductIdByName(productName) {
      const product = this.products.find(
        (p) => p.name.toLowerCase() === productName.toLowerCase()
      );
      return product ? product.id : null;
    },

    async removeSale(id) {
      console.log("Удаляем продажу с id:", id);
      try {
        await deleteSale(id);

        this.sales = this.sales.filter((sale) => sale.id !== id);
        await this.loadInitialData();
      } catch (error) {
        this.errorMessage = "Ошибка удаления продажи.";
        console.error(error.message);
      }
    },
    openModal() {
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },
    updatePrice(index) {
      const product = this.products.find(
        (p) => p.name === this.currentSale.items[index].product
      );
      if (product) {
        this.currentSale.items[index].price = product.price;
        this.updateSum(index);
      }
    },
    updateSum(index) {
      const item = this.currentSale.items[index];
      item.sum = item.quantity * item.price;
    },
    resetForm() {
      this.currentSale = {
        id: null,
        date: new Date().toISOString().split("T")[0],
        warehouse: "",
        items: [],
      };
      this.isWarehouseValid = true;
    },
    addItem() {
      this.currentSale.items.push({ product: "", quantity: 1, price: 0 });
    },
    toggleSortOrder() {
      this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
    },
    openProduct() {
      this.selectedOrderIndex = index;
      this.openProductModal = true;
    },
    closeProduct() {
      this.openProductModal = false;
    },
    selectsedIndex() {
      this.orders[this.selectedOrderIndex].product = productName;
      this.closeProduct();
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
      <button
        @click="openModal"
        class="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
      >
        Создать
      </button>
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
              <AnOutlinedEdit
                @click="editSale(sale)"
                class="w-5 h-5 text-blue-600 cursor-pointer"
              />
              <FlDelete
                @click="removeSale(sale.sale_id)"
                class="w-5 h-5 text-red-600 cursor-pointer"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="isModalOpen"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="w-[60%] p-6 bg-white rounded-xl shadow-xl">
        <h2 class="mb-4 text-xl font-bold">Продажа </h2>

        <div class="mb-4">
          <label class="block mb-2 text-gray-700">Склад:</label>
          <select
            v-model="currentSale.warehouse"
            class="w-full px-3 py-2 mb-2 border rounded"
          >
            <option
              v-for="warehouse in wherehouses"
              :key="warehouse.id"
              :value="warehouse.name"
              placeholder="Склад 1"
              class="text-black"
            >
              {{ warehouse.name }}
            </option>
          </select>
          <span v-if="!isWarehouseValid" class="text-sm text-red-500">
            Указанный склад не существует.
          </span>
        </div>
        <div class="mb-4">
          <label class="block mb-2 text-gray-700">Дата:</label>
          <datepicker
            v-model="currentSale.date"
            :format="'yyyy-MM-dd'"
            :auto-apply="true"
            :placeholder="'Выберите дату'"
          ></datepicker>
        </div>
        <div class="mb-4">
          <h3 class="mb-2 text-lg font-bold">Товары</h3>
          <table class="w-full border border-gray-200 table-auto">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-4 py-2 border">Товар</th>
                <th class="px-4 py-2 border">Количество</th>
                <th class="px-4 py-2 border">Цена</th>
                <th class="px-4 py-2 border">Сумма</th>
                <th class="px-4 py-2 border">Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in currentSale.items" :key="index">
                <td class="px-4 py-2 border">
                  <button
                    @click="openProduct"
                    class="text-white bg-orange-400 rounded-lg"
                  >
                    выбрать
                  </button>
                  <div
                    class="fixed inset-0 w-[60%] mx-auto bg-white w- bg-opaity-50 rounded-xl"
                    v-if="openProduct"
                  >
                    <AkCircleX
                      class="w-6 h-6 mt-6 ml-5 text-black cursor-pointer"
                      @click="closeProduct"
                    />

                    <ModalProduct
                      :products="products"
                      @select-product="selectProduct"
                    />
                  </div>
                </td>
                <td class="px-4 py-2 border">
                  <input
                    type="number"
                    v-model.number="item.quantity"
                    @input="updateSum(index)"
                    class="w-full px-3 py-2 border rounded"
                  />
                </td>
                <td class="px-4 py-2 border">
                  <input
                    type="number"
                    v-model.number="item.price"
                    @input="updateSum(index)"
                    class="w-full px-3 py-2 border rounded"
                  />
                </td>
                <td class="px-4 py-2 border">
                  {{ item.quantity * item.price }}
                </td>
                <td class="px-4 py-2 text-center border">
                  <button
                    @click="removeItem(index)"
                    class="text-red-500 hover:underline"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <button
            @click="addItem"
            class="px-4 py-2 mt-4 text-white bg-green-500 rounded hover:bg-green-600"
          >
            Добавить товар
          </button>
        </div>
        <div class="flex justify-end space-x-4">
          <button
            @click="closeModal"
            class="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
          >
            Отмена
          </button>
          <button
            @click="saveSale"
            class="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
