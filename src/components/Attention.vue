<template>
    <div class="attention-container">
      <el-alert
        v-if="visible"
        :title="title"
        :type="type"
        
        :show-icon="showIcon"
        class="attention-alert"
      >
        <span>{{ message }}</span>
      </el-alert>
    </div>
  </template>
  
  <script>
  import { ElAlert } from 'element-plus';
  
  export default {
    components: {
      ElAlert,
    },
    props: {
      title: {
        type: String,
        default: '注意！', // 默认标题
      },
      message: {
        type: String,
        required: true, // 提示内容是必需的
      },
      type: {
        type: String,
        default: 'warning', // 默认是警告类型
      },
      closable: {
        type: Boolean,
        default: true, // 是否允许关闭
      },
      showIcon: {
        type: Boolean,
        default: true, // 是否显示图标
      }
    },
    data() {
      return {
        visible: true, // 控制警告框显示与否
      };
    },
    methods: {
      handleClose() {
        this.visible = false; // 关闭时，将visible设为false，隐藏警告框
      },
    },
  };
  </script>
  
  <style scoped>
  .attention-container {
    margin: 20px;
  }
  
  .attention-alert {
    margin-bottom: 10px;
    font-size: 16px;
    border-radius: 8px;
  }
  </style>
  