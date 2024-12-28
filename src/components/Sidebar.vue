<template>
  <div
    class="h-screen bg-amber-200 min-w-[300px] py-[50px] px-[20px] flex flex-col gap-3"
  >
    <router-link to="/products" class="text-xl cursor-pointer">
      Продукты
    </router-link>
    <router-link to="/" class="text-xl cursor-pointer">
    Заказы
    </router-link>
    <router-link to="/wherehouse" class="text-xl cursor-pointer">
   Склады
    </router-link>
  </div>
</template>
