<script>
import {
  fetchSales,
  createSale,
  updateSale,
  fetchWarehouses,
  fetchProducts,
  fetchSaleById,
} from "../store/orders";
import { AnOutlinedEdit, FlDelete, AkCircleX } from "@kalimahapps/vue-icons";

export default {
  components: { AnOutlinedEdit, FlDelete, AkCircleX },
  data() {
    return {
      openProductModal: [],
      warehouses: [],
      products: [],
      currentSale: {
        id: null,
        date: new Date(),
        items: [],
      },
      errorMessage: "",
      searchQuery: "",
      searchProduct: "",
      sortOrder: "asc",
      sortPoduct: "asc",
      isProductModalOpen: false,
      isModalOpen: false,
      isEditMode: false, 
    };
  },
  computed: {
    filteredWherehouse() {
      const filtered = this.warehouses
        .filter(
          (wherehouse) =>
            wherehouse &&
            wherehouse.name &&
            wherehouse.code &&
            (wherehouse.name
              .toLowerCase()
              .includes(this.searchQuery.toLowerCase()) ||
              wherehouse.code.toString().includes(this.searchQuery))
        )
        .sort((a, b) => {
          if (this.sortOrder === "asc") {
            return a.id - b.id;
          } else {
            return b.id - a.id;
          }
        });
      return filtered;
    },
    filteredProducts() {
      return this.products.filter(
        (product) =>
          product.name.toLowerCase().includes(this.searchProduct.toLowerCase()) ||
          product.code.toLowerCase().includes(this.searchProduct.toLowerCase())
      );
    },
  },
  methods: {
    async loadInitialData() {
      try {
        [this.sales, this.warehouses, this.products] = await Promise.all([
          fetchSales(),
          fetchWarehouses(),
          fetchProducts(),
        ]);

        const saleId = this.$route.params.id;
        if (saleId) {
          this.isEditMode = true;
          const sale = await fetchSaleById(saleId);
          this.currentSale = {
            ...sale,
            date: new Date(sale.date),
          };
        } else {
          this.isEditMode = false;
          this.currentSale = {
            id: null,
            date: new Date(),
            items: [],
          };
        }
      } catch (error) {
        this.errorMessage = "Error loading data.";
        console.error(error.message);
      }
    },
    async saveSale() {
      const saleData = { ...this.currentSale };
      const warehouse = this.warehouses.find(
        (wh) => wh.name.toLowerCase() === saleData.warehouse.toLowerCase()
      );

      const formattedData = {
        wherehouses_id: warehouse.id,
        date: new Date(saleData.date).toISOString().split("T")[0],
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
        if (this.isEditMode === true) {
          await updateSale({ ...formattedData, id: saleData.sale_id });
        } else {
          await createSale(formattedData, this);
        }
        this.$router.push("/"); 
      } catch (error) {
        this.errorMessage = "Ошибка при сохранении продажи.";
        console.error(error.message);
      }
    },
    getProductIdByName(productName) {
      const product = this.products.find(
        (p) => p.name.toLowerCase() === productName.toLowerCase()
      );
      return product ? product.id : null;
    },
    toggleSortProduct() {
      this.sortPoduct = this.sortPoduct === "asc" ? "desc" : "asc";
      this.products.sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        if (this.sortPoduct === "asc") {
          return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
        } else {
          return nameA > nameB ? -1 : nameA < nameB ? 1 : 0;
        }
      });
    },
    selectProduct(index, product) {
      this.currentSale.items[index].product = product.name;
      this.openProductModal[index] = false;
    },
    addItem() {
      this.currentSale.items.push({ product: "", quantity: 1, price: 0 });
    },
    removeItem(index) {
      this.currentSale.items.splice(index, 1);
    },
    toggleSortOrder() {
      this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
    },
    updateSum(index) {
      const item = this.currentSale.items[index];
      item.sum = item.quantity * item.price;
    },

    selectWarehouse(warehouse) {
      this.currentSale.warehouse = warehouse.name;
      this.isModalOpen = false;
    },
  },
  mounted() {
    this.loadInitialData();
  },
};
</script>

<template>
  <div class="h-screen p-4">
    <h1 class="mb-4 text-xl font-bold">
      {{ isEditMode ? "Редактирование продажи" : "Создание новой продажи" }}
    </h1>

    <label class="block mb-2 text-gray-700">Склад:</label>
    <div>
      <button
        @click="isModalOpen = true"
        class="px-4 py-1 border-b border-black text-md"
      >
        {{ currentSale.warehouse || "Выбрать склад" }}
      </button>

      <div
        v-if="isModalOpen"
        class="fixed inset-0 flex items-center justify-center py-5 bg-black bg-opacity-50"
      >
        <div
          class="h-full flex overflow-y-auto flex-col gap-5 p-3 my-3 bg-white rounded-lg w-[60%]"
        >
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
          </div>

          <table class="w-full border border-gray-200 table-auto">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-4 py-2 border">Наименование</th>
                <th class="px-4 py-2 border">Код</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="warehouse in filteredWherehouse"
                :key="warehouse.id"
                @click="selectWarehouse(warehouse)"
                class="cursor-pointer hover:bg-gray-200"
              >
                <td class="px-4 py-2 border">{{ warehouse.name }}</td>
                <td class="px-4 py-2 border">{{ warehouse.code }}</td>
              </tr>
            </tbody>
          </table>
          <button
            @click="isModalOpen = false"
            type="button"
            class="px-4 py-2 text-white w-[20%] bg-gray-500 rounded hover:bg-gray-600"
          >
            Отмена
          </button>
        </div>
      </div>
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

    <div class="mb-4 overflow-y-auto h-[490px]">
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
              <div class="mb-4">
                <button
                  @click="openProductModal[index] = true"
                  class="px-1 py-1 rounded-lg "
                >
                  {{ item.product || "Выбрать " }}
                </button>
                <div
                  v-if="openProductModal[index]"
                  class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
                >
                  <div
                    class="h-full flex overflow-y-auto flex-col gap-5 p-3 my-3 bg-white rounded-lg w-[60%]"
                  >
                    <div class="flex items-center justify-between gap-3 my-3">
                      <input
                        v-model="searchProduct"
                        type="text"
                        placeholder="Поиск товара"
                        class="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
                      />
                      <button
                        @click="toggleSortProduct"
                        class="flex items-center px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        <span>Сортировка</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          :class="{
                            'transform rotate-180': sortPoduct === 'desc',
                          }"
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
                    </div>
                    <table class="w-full border border-gray-200 table-auto">
                      <thead class="bg-gray-100">
                        <tr>
                          <th class="px-4 py-2 border">Товар</th>
                          <th class="px-4 py-2 border">Код</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="product in filteredProducts"
                          :key="product.id"
                          @click="selectProduct(index, product)"
                          class="cursor-pointer hover:bg-gray-200"
                        >
                          <td class="px-4 py-2 border">{{ product.name }}</td>
                          <td class="px-4 py-2 border">{{ product.code }}</td>
                        </tr>
                      </tbody>
                    </table>
                    <button
                      @click="openProductModal[index] = false"
                      type="button"
                      class="px-4 py-2 text-white w-[20%] bg-gray-500 rounded hover:bg-gray-600"
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              </div>
            </td>
            <td class="px-4 py-2 border">
              <input
                v-model.number="item.quantity"
                type="number"
                min="0"
                step="1"
                @input="updateSum(index)"
                class="w-full px-4 py-2 border rounded"
              />
            </td>
            <td class="px-4 py-2 border">
              <input
                v-model.number="item.price"
                type="number"
                min="0"
                step="0.01"
                @input="updateSum(index)"
                class="w-full px-4 py-2 border rounded"
              />
            </td>
            <td class="px-4 py-2 border">
              {{ item.sum || item.quantity * item.price }}
            </td>
            <td class="px-4 py-2 border">
              <button
                @click="removeItem(index)"
                class="px-4 py-2 text-white bg-red-500 rounded"
              >
                Удалить
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <button
        @click="addItem"
        class="px-4 py-2 mt-2 text-white bg-blue-500 rounded"
      >
        Добавить товар
      </button>
    </div>

    <div class="flex justify-end">
      <button
        @click="saveSale"
        class="px-6 py-2 mt-4 text-white bg-green-500 rounded"
      >
        {{ isEditMode ? "Сохранить изменения" : "Создать заказ" }}
      </button>
    </div>
  </div>
</template>
