<template>
    <div :style="computedStyle">
      <slot></slot>
    </div>
  </template>
  
  <script>
  export default {
    name: "FontComponent",
    props: {
       // 字体大小，默认为 16px
      fontSize: {
        type: String,
        default: "16px",
      },
      // 字体类型，默认为 "Arial"
      fontFamily: {
        type: String,
        default: "Arial",
      },
      // 是否加粗，默认为 false
      bold: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      computedStyle() {
        return {
          fontSize: this.fontSize,
          fontFamily: this.fontFamily,
          fontWeight: this.bold ? "bold" : "normal",
        };
      },
    },
  };
  </script>
  
  <style scoped>
  /* 你可以在这里添加一些全局样式来美化组件 */
  </style>
  