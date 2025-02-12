<template>
  <div class="code-container">
    <div class="code-header">
      <span class="language">{{ language }}</span>
      <button class="copy-btn" ref="copyBtn">复制</button>
    </div>
    <pre>
      <code ref="codeBlock" :class="`language-${language}`">{{ code }}</code>
    </pre>
  </div>
</template>

<script>
// 导入 highlight.js 和所需的语言
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css'; // 可以选择其他主题
import ClipboardJS from 'clipboard';
import { ElMessage } from 'element-plus'; // 导入 Element Plus 的 Message 组件

export default {
  props: {
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      default: 'javascript', // 默认语言为JavaScript
    }
  },
  mounted() {
    // 使用 highlight.js 高亮代码
    this.highlightCode();

    // 初始化复制功能
    this.initClipboard();
  },
  methods: {
    highlightCode() {
      // 使用 highlight.js 高亮代码
      const block = this.$refs.codeBlock;
      hljs.highlightBlock(block);
    },
    initClipboard() {
      // 初始化复制功能
      new ClipboardJS(this.$refs.copyBtn, {
        text: () => this.code, // 将代码复制到剪贴板
      }).on('success', () => {
        // 复制成功后显示 Element Plus 的 Message
        ElMessage.success('复制成功！');
      }).on('error', () => {
        // 复制失败时的提示
        ElMessage.error('复制失败，请手动复制！');
      });
    }
  }
};
</script>

<style scoped>
.code-container {
  position: relative;
  padding: 5px;
  background-color: #2d2d2d;
  border-radius: 8px;
  overflow: hidden;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0px;
  font-size: 14px;
  color: #ddd;
}

.language {
  font-weight: bold;
}

.copy-btn {
  background: #0078d4;
  color: #fff;
  border: none;
  padding: 5px 5px;
  cursor: pointer;
  font-size: 12px;
  border-radius: 4px;
  transition: background 0.3s;
}

.copy-btn:hover {
  background: #005a8d;
}

pre {
  background-color: #282828;
  padding: 0px;
  border-radius: 8px;
  overflow-x: auto;
  /* max-height: 300px; */
  height: 150px;
  font-family: "Courier New", Courier, monospace;
}

code {
  display: block;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
