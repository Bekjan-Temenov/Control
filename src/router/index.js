import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/HomePage.vue";
import ProductsPage from "../views/ProductsPage.vue";
import WherehousePage from "../views/WherehousePage.vue";
import ReportPage from "../views/ReportPage.vue";

export const router = createRouter({
  routes: [
    {
      path: "/",
      component: Home,
    },
    {
      path: "/products",
      component: ProductsPage,
    },
    {
      path: "/wherehouse",
      component: WherehousePage,
    },
    {
      path: "/reports",
      component: ReportPage,
    },
  ],
  history: createWebHistory(),
});
