<script>
export default {
  data() {
    return {
      isModalOpen: false,
      currentSale: {
        date: new Date().toISOString().slice(0, 16),
        warehouse: "",
        items: [],
      },
      searchQuery: "",
      warehouses: [
        { id: 1, name: "Склад 1" },
        { id: 2, name: "Склад 2" },
      ],
      products: [
        { id: 1, name: "Товар 1", price: 100 },
        { id: 2, name: "Товар 2", price: 200 },
      ],
      sales: [],
      isWarehouseValid: true,
      sortOrder: "desc", // Порядок сортировки: 'desc' - новые сверху, 'asc' - старые сверху
    };
  },
  computed: {
    findSearch() {
      // Фильтрация по поисковому запросу
      const filtered = this.sales.filter(
        (product) =>
          product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          product.code.toString().includes(this.searchQuery)
      );
      // Сортировка по коду
      return filtered.sort((a, b) => {
        if (this.sortOrder === 'asc') {
          return a.code - b.code;
        } else {
          return b.code - a.code;
        }
      });
    },
  },
  
  methods: {
    openModal() {
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
      this.resetForm();
    },
    addItem() {
      this.currentSale.items.push({ product: "", quantity: 1, price: 0 });
    },
    removeItem(index) {
      this.currentSale.items.splice(index, 1);
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
    addNewWarehouse() {
      if (this.newWarehouse.trim() !== "") {
        this.warehouses.push({
          id: this.warehouses.length + 1,
          name: this.newWarehouse,
        });
        this.currentSale.warehouse = this.newWarehouse;
        this.newWarehouse = "";
      }
    },
    saveSale() {
      if (
        !this.warehouses.find(
          (warehouse) => warehouse.name === this.currentSale.warehouse
        )
      ) {
        this.isWarehouseValid = false;
        return;
      }

      this.isWarehouseValid = true;
      const total = this.currentSale.items.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
      );
      this.sales.push({
        date: this.currentSale.date,
        warehouse: this.currentSale.warehouse,
        total,
      });
      this.closeModal();
    },
    resetForm() {
      this.currentSale = {
        date: new Date().toISOString().slice(0, 16),
        warehouse: "",
        items: [],
      };
      this.isWarehouseValid = true;
      this.newWarehouse = "";
    },
    toggleSortOrder() {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    },
  },
};
</script>

<template>
  <div class="p-4">
    <h1 class="mb-4 text-xl font-bold">Список операций</h1>

    <!-- Поиск -->

    <!-- Кнопка создания продажи -->
    <div class="flex items-center justify-between gap-3 my-3">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Поиск (Ctrl+F)"
        class="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
      />

      <!-- Фильтр сортировки -->
      
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
    <!-- Таблица операций -->
    <table class="w-full border border-gray-200 table-auto">
      <thead class="bg-gray-100">
        <tr>
          <th class="px-4 py-2 border">Дата</th>
          <th class="px-4 py-2 border">Склад</th>
          <th class="px-4 py-2 border">Сумма</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(sale, index) in findSearch" :key="index">
          <td class="px-4 py-2 border">{{ sale.date }}</td>
          <td class="px-4 py-2 border">{{ sale.warehouse }}</td>
          <td class="px-4 py-2 border">{{ sale.total }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Модальное окно -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="w-1/2 p-6 bg-white rounded shadow-lg">
        <h2 class="mb-4 text-xl font-bold">Продажа товаров</h2>

        <!-- Поле выбора склада -->
        <div class="mb-4">
          <label class="block mb-2 text-gray-700">Склад:</label>
          <select
            v-model="currentSale.warehouse"
            class="w-full px-3 py-2 mb-2 border rounded"
          >
            <option
              v-for="warehouse in warehouses"
              :key="warehouse.id"
              :value="warehouse.name"
            >
              {{ warehouse.name }}
            </option>
          </select>
          <span v-if="!isWarehouseValid" class="text-sm text-red-500">
            Указанный склад не существует.
          </span>
        </div>

        <!-- Поле выбора даты -->
        <div class="mb-4">
          <label class="block mb-2 text-gray-700">Дата:</label>
          <input
            v-model="currentSale.date"
            type="datetime-local"
            class="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          />
        </div>

        <!-- Таблица товаров -->
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
                  <select
                    v-model="item.product"
                    @change="updatePrice(index)"
                    class="w-full px-3 py-2 border rounded"
                  >
                    <option
                      v-for="product in products"
                      :key="product.id"
                      :value="product.name"
                    >
                      {{ product.name }}
                    </option>
                  </select>
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

        <!-- Кнопки -->
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
