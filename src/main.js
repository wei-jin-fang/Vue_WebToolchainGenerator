// src/main.js

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import axios from "axios";
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'virtual:windi.css'
import Vue3Tour from 'vue3-tour'
import { useMenuStore } from '@/stores/menuStore';  // 导入新的 menuStore

import FontComponent from './components/FontComponent.vue'
import Attention  from '@/components/Attention.vue';


const app = createApp(App)

// 注册 ElementPlus 图标组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

// 配置 Axios 的基础 URL（如果仍需要）
axios.defaults.baseURL = 'http://localhost:8080'

// 创建 Pinia 实例并使用
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.use(Vue3Tour)

// 初始化菜单数据
const menuStore = useMenuStore()

// 如果 localStorage 中没有菜单数据，则初始化

menuStore.initializeMenus()
app.component('FontComponent', FontComponent)
app.component('Attention', Attention)

app.mount('#app')
