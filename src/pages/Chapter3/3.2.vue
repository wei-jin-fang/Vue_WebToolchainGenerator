<template>

    <attention :message="'请确保工具链快速测试部分功能正常使用,并且现在两个软件都属于运行状态'" 
    type="warning" />
    <attention :message="'如果想要不动脑子，请保持每一步的路径都和给出的教程一致，否则会出错'" 
    type="error" />
    <FontComponent fontSize="20px" fontFamily="Arial" :bold="true">
        第一步、使用SSH软件或SCP 将ONNX模型上传到上一步创建的dataset文件夹
    </FontComponent>
    <FontComponent fontSize="20px" fontFamily="Arial" :bold="true">
        第二步、模型校验环境准备
    </FontComponent>
    <code-block
    :code="bashcode"
    language="bash"
  />

  <FontComponent fontSize="20px" fontFamily="Arial" :bold="true">
        第三步、生成校准命令
    </FontComponent>
    <div style="padding: 20px;">
    <!-- model_type 下拉框 -->
    <el-select v-model="modelType" placeholder="请选择模型类型" style="width: 200px;">
      <el-option label="ONNX" value="onnx"></el-option>
    </el-select>

    <!-- 模型名称 输入框 -->
    <el-input v-model="modelName" placeholder="请输入模型名称" style="width: 300px; margin-left: 10px;" />

    <!-- march 下拉框 -->
    <el-select v-model="march" placeholder="请选择架构" style="width: 200px; margin-left: 10px;">
      <el-option label="bayes-e" value="bayes-e"></el-option>
    </el-select>

    <!-- 生成按钮 -->
    <el-button type="primary" @click="generateCommand" style="margin-left: 20px;">生成命令</el-button>

     </div>
  <!-- 只有在命令生成后才显示 code-block -->
  <code-block
      v-if="generateCommandbashcode"
      :code="generateCommandbashcode"
      language="bash"
      style="margin-top: 20px;"
    />

  </template>
  <script>
  import CodeBlock from '@/components/CodeBlock.vue';
  import { ElSelect, ElOption, ElInput, ElButton, ElMessage } from 'element-plus';


  export default {
    components: {
        CodeBlock,
        ElSelect,
        ElOption,
        ElInput,
        ElButton,
        ElMessage,
    },
    methods: {
    // 生成命令
    generateCommand() {
      // 拼接命令
      const modelPath = `/data/horizon_x5/data/${this.modelName}.onnx`;
      const command = `hb_mapper checker --model-type ${this.modelType} --model ${modelPath} --march ${this.march}`;
      
      // 将命令显示到文本框中
      this.generateCommandbashcode = command;


    }
},

    data() {
      return {
        // 使用数组存储多个命令
        // 初始化模型类型、模型名称、架构类型
      modelType: 'onnx', // 默认值
      modelName: '', // 用户输入的模型名称
      march: 'bayes-e', // 默认值
      generateCommandbashcode: '', // 生成的bash命令
      commandGenerated: false, // 用于控制命令生成后的提示
        bashCommands: [
          'cd ~',
          'cd /open_explorer/samples/ai_toolchain/horizon_model_convert_sample/03_classification',
          'cp -r 05_efficientnet_lite0_onnx/ 00mytorchmodel',
          'cd 00mytorchmodel/mapper'
        ],
        bashCommand1: [
          'mkdir dataset',
          'docker run -it --rm -v horizon_x5_open_explorer_v1.2.6-py310_20240724:/open_explorer -v ./dataset:/data/horizon_x5/data openexplorer/ai_toolchain_ubuntu_20_x5_cpu:v1.2.8-py310',
          'ddk_vcs --help'
        ],
        bashCommand2: [
          'cd ~',
          'sudo apt update',
          'wget -c ftp://x5ftp@vrftp.horizon.ai/OpenExplorer/v1.2.6_release/horizon_x5_open_explorer_v1.2.6-py310_20240724.tar.gz --ftp-password=x5ftp@123$%',
          'wget -c ftp://x5ftp@vrftp.horizon.ai/OpenExplorer/v1.2.8_release/docker_openexplorer_ubuntu_20_x5_cpu_v1.2.8.tar.gz --ftp-password=x5ftp@123$%',
        ],
        bashCommand3: [
          'cd ~',
          'sudo apt update',
          'wget -c ftp://x5ftp@vrftp.horizon.ai/OpenExplorer/v1.2.6_release/horizon_x5_open_explorer_v1.2.6-py310_20240724.tar.gz --ftp-password=x5ftp@123$%',
          'wget -c ftp://x5ftp@vrftp.horizon.ai/OpenExplorer/v1.2.8_release/docker_openexplorer_ubuntu_20_x5_cpu_v1.2.8.tar.gz --ftp-password=x5ftp@123$%',
        ],
        bashCommand4: [
          'cd ~',
          'sudo apt update',
          'wget -c ftp://x5ftp@vrftp.horizon.ai/OpenExplorer/v1.2.6_release/horizon_x5_open_explorer_v1.2.6-py310_20240724.tar.gz --ftp-password=x5ftp@123$%',
          'wget -c ftp://x5ftp@vrftp.horizon.ai/OpenExplorer/v1.2.8_release/docker_openexplorer_ubuntu_20_x5_cpu_v1.2.8.tar.gz --ftp-password=x5ftp@123$%',
        ],
        bashCommand5: [
          'cd ~',
          'sudo apt update',
          'wget -c ftp://x5ftp@vrftp.horizon.ai/OpenExplorer/v1.2.6_release/horizon_x5_open_explorer_v1.2.6-py310_20240724.tar.gz --ftp-password=x5ftp@123$%',
          'wget -c ftp://x5ftp@vrftp.horizon.ai/OpenExplorer/v1.2.8_release/docker_openexplorer_ubuntu_20_x5_cpu_v1.2.8.tar.gz --ftp-password=x5ftp@123$%',
        ],bashCommand6: [
          'cd ~',
          'sudo apt update',
          'wget -c ftp://x5ftp@vrftp.horizon.ai/OpenExplorer/v1.2.6_release/horizon_x5_open_explorer_v1.2.6-py310_20240724.tar.gz --ftp-password=x5ftp@123$%',
          'wget -c ftp://x5ftp@vrftp.horizon.ai/OpenExplorer/v1.2.8_release/docker_openexplorer_ubuntu_20_x5_cpu_v1.2.8.tar.gz --ftp-password=x5ftp@123$%',
        ],
      };
    },
    computed: {
      // 拼接命令并返回一个多行字符串
      bashcode() {
        return this.bashCommands.join("\n");
      },bashcode1() {
        return this.bashCommand1.join("\n");
      },bashcode2() {
        return this.bashCommand2.join("\n");
      },bashcode3() {
        return this.bashCommand3.join("\n");
      },bashcode4() {
        return this.bashCommand4.join("\n");
      },bashcode5() {
        return this.bashCommand5.join("\n");
      },bashcode6() {
        return this.bashCommand6.join("\n");
      },bashcode7() {
        return this.bashCommand7.join("\n");
      },bashcode8() {
        return this.bashCommand8.join("\n");
      },bashcode9() {
        return this.bashCommand9.join("\n");
      },bashcode10() {
        return this.bashCommand10.join("\n");
      },bashcode11() {
        return this.bashCommand11.join("\n");
      },
    }
  };
  </script>
  
  <style scoped>
  /* 你可以在这里添加样式来美化代码展示 */
  </style>