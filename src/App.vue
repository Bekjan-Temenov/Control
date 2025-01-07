<script setup>
import Sidebar from './components/Sidebar.vue';
</script>
<template>
  <div class="flex h-screen items-start  border mx-auto gap-2 max-w-[80%]">
    <Sidebar/>
    <div class="w-full max-h-screen">
    <router-view></router-view>
    </div>
  </div>
</template>
