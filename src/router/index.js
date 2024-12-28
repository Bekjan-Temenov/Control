import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomePage.vue'
import ProductsPage from '../views/ProductsPage.vue'
import WherehousePage from '../views/WherehousePage.vue'

export const router = createRouter ({
    routes :[
        {
            path: '/',
            component: Home
        },
        {
            path: '/products',
            component: ProductsPage
        },
        {
            path: '/wherehouse',
            component:WherehousePage,
        }
    ],
    history: createWebHistory() 
})