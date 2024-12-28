<script setup>
import Sidebar from './components/Sidebar.vue';
</script>
<template>
  <div class="flex items-start border mx-auto gap-2 max-w-[1200px]">
    <Sidebar/>
    <div class="w-full">

    <router-view></router-view>
    </div>
  </div>
</template>
