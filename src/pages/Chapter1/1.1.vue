<template>
    <div style="text-align: center; margin-top: 100px;">
      <h1 class="title">WSL2安装</h1>
      <el-button 
        :style="{ position: 'absolute', left: buttonX + 'px', top: buttonY + 'px' }"
        type="primary"
        size="large"
        @mouseover="mouseOverButton"
      >
        点我安装
      </el-button>
  
      <!-- 遮罩层 -->
      <div 
        v-if="showMask" 
        class="mask" 
        @click="hideMask"
      >
        <div class="mask-content">
          <p>你去百度搜下吧，这个很简单，最近没空写这个教程 😄</p>
          <el-button type="primary" @click="hideMask">知道了</el-button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        hoverCount: 0,    // 鼠标悬停计数
        showMask: false,  // 控制遮罩是否显示
        buttonX: 850,     // 按钮的初始位置
        buttonY: 320,     // 初始位置放在标题正下方
      };
    },
    methods: {
      moveButton() {
        // 随机改变按钮的位置
        this.buttonX = Math.random() * (window.innerWidth - 100); // 保证按钮不超出边界
        this.buttonY = Math.random() * (window.innerHeight - 50);
      },
      mouseOverButton() {
        // 鼠标经过按钮时增加计数
        this.hoverCount++;
        if (this.hoverCount >= 5) {
          this.showMask = true;   // 显示遮罩
          this.hoverCount = 0;    // 重置悬停计数
        }
        this.moveButton(); // 按钮每次悬停时移动
      },
      hideMask() {
        // 隐藏遮罩
        this.showMask = false;
      },
    },
  };
  </script>
  
  <style scoped>
  .title {
    font-family: '黑体', sans-serif;
    font-weight: bolder;
    font-size: 36px; /* 增大标题 */
    margin-bottom: 20px;
  }
  
  .el-button {
    transition: all 0.3s ease;
    font-size: 18px; /* 增大按钮字体 */
    padding: 15px 30px; /* 增大按钮 */
  }
  
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
  }
  
  .mask-content {
    background: #fff;
    padding: 30px;
    border-radius: 8px;
    text-align: center;
    width: 300px;
  }
  
  .mask p {
    font-size: 16px;
    margin-bottom: 20px;
  }
  
  .mask button {
    width: 100%;
    font-size: 16px;
  }
  </style>
  