<script>
import { AnOutlinedMenu } from "@kalimahapps/vue-icons";

export default {
  components: { AnOutlinedMenu },
  data() {
    return {
      isModalOpen: true,
    };
  },
  methods: {
    openModal() {
      this.isModalOpen = !this.isModalOpen;
    },
    closeModal() {
      this.isModalOpen = false;
    },
  },
};
</script>
<template>
  <div class="flex flex-col h-full p-3 bg-amber-200">
    <AnOutlinedMenu @click="openModal" class="w-5 h-5 cursor-pointer" />

    <div
      v-if="isModalOpen"
      class="py-[50px] min-w-[300px] px-[20px] flex flex-col gap-3"
    >
      <router-link to="/products" class="text-xl cursor-pointer">
        Продукты
      </router-link>
      <router-link to="/" class="text-xl cursor-pointer"> Заказы </router-link>
      <router-link to="/wherehouse" class="text-xl cursor-pointer">
        Склады
      </router-link>
      <router-link to="/reports" class="text-xl cursor-pointer">
        Отчеты
      </router-link>
    </div>
  </div>
</template>
