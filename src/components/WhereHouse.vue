<script>
import { AnOutlinedEdit } from '@kalimahapps/vue-icons';
import { FlDelete } from '@kalimahapps/vue-icons';
export default {
    components:{
        AnOutlinedEdit,
        FlDelete
    },
  data() {
    return {
      products: [], // Список товаров
      searchQuery: '', // Поисковый запрос
      sortOrder: 'asc', // Порядок сортировки: 'asc' или 'desc'
      showModal: false, // Видимость модального окна
      form: {
        name: '',
        code: '',
      }, // Данные формы
      editIndex: null, // Индекс редактируемого товара
    };
  },
  computed: {
    filteredProducts() {
      // Фильтрация по поисковому запросу
      const filtered = this.products.filter(
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
      this.showModal = true;
      this.editIndex = null;
      this.form = { name: '', code: '' };
    },
    closeModal() {
      this.showModal = false;
    },
    saveProduct() {
      if (this.editIndex === null) {
        this.products.push({ ...this.form });
      } else {
        this.$set(this.products, this.editIndex, { ...this.form });
      }
      this.closeModal();
    },
    editProduct(index) {
      this.editIndex = index;
      this.form = { ...this.products[index] };
      this.showModal = true;
    },
    deleteProduct(index) {
      this.products.splice(index, 1);
    },
    toggleSortOrder() {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    },
  },
};
</script>
<template>
    <div class="p-4">
      <!-- Заголовок -->
      <h1 class="mb-4 text-xl font-bold">Склад</h1>
  
      <!-- Панель управления -->
      <div class="flex items-center mb-4 space-x-4">
        <!-- Поле поиска -->
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Поиск (Ctrl+F)"
          class="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
        />
        <!-- Кнопка сортировки -->
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
        <!-- Кнопка "Создать" -->
        <button
          @click="openModal"
          class="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Создать
        </button>
      </div>
  
      <!-- Таблица товаров -->
      <table class="w-full mt-4 border border-gray-200 table-auto">
        <thead class="bg-gray-100">
          <tr>
            <th class="py-2 text-left border px-[140px]">Наименование</th>
            <th class="px-4 py-2 text-left border">
              Код
              <button @click="toggleSortOrder" class="ml-2 text-gray-500">
                ⬆⬇
              </button>
            </th>
            <th class="px-0 py-2 text-center border">Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(product, index) in filteredProducts"
            :key="index"
            class="hover:bg-gray-50"
          >
            <td class="px-4 py-2 border">{{ product.name }}</td>
            <td class="px-4 py-2 border">{{ product.code }}</td>
            <td class="px-4 py-2 text-center border">
              <button
                @click="editProduct(index)"
                class="mr-3 text-blue-500 hover:underline"
              >
                <AnOutlinedEdit  class="w-5 h-5"/>
              </button>
              <button
                @click="deleteProduct(index)"
                class="text-red-600 hover:underline"
              >
              <FlDelete class="w-5 h-5"/>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <div
        v-if="showModal"
        class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50"
      >
        <div class="p-6 bg-white rounded shadow-lg w-96">
          <h2 class="mb-4 text-lg font-bold">
            {{ editIndex === null ? 'Склад ' : 'Редактировать склада' }}
          </h2>
          <form @submit.prevent="saveProduct">
            <div class="mb-4">
              <label class="block text-gray-700">Наименование</label>
              <input
                v-model="form.name"
                type="text"
                class="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
                placeholder="Введите наименование"
              />
            </div>
            <div class="mb-4">
              <label class="block text-gray-700">Код</label>
              <input
                v-model="form.code"
                type="text"
                class="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
                placeholder="Введите код"
              />
            </div>
            <div class="flex justify-end space-x-2">
              <button
                @click="closeModal"
                type="button"
                class="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
              >
                Отмена
              </button>
              <button
                type="submit"
                class="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
              >
                Сохранить
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  

  