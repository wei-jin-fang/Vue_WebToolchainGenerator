// src/stores/menuStore.js

import { defineStore } from 'pinia';
import { labInfoMenu, infoManagementMenu, adminManagementMenu } from '@/assets/menus.js';

export const useMenuStore = defineStore('menu', {
  state: () => ({
    menus: [], // 菜单数据
  }),
  actions: {
    initializeMenus() {
      // 将所有静态菜单添加到 menus 中
      const menuList = [labInfoMenu, infoManagementMenu, adminManagementMenu];
      this.menus = menuList;
      // 将菜单数据保存到 localStorage（可选）
      localStorage.setItem('menus', JSON.stringify(menuList));
    },
    loadMenusFromLocalStorage() {
      const storedMenus = localStorage.getItem('menus');
      if (storedMenus) {
        this.menus = JSON.parse(storedMenus);
      }
    },
    clearMenus() {
      this.menus = [];
      localStorage.removeItem('menus');
    },
  },
});
