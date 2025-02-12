<template>

  <attention :message="'请确保操作环境配置与软件安装部分功能正常使用,并且现在两个软件都属于运行状态'" 
  type="warning" />
  <attention :message="'如果想要不动脑子，请保持每一步的路径都和给出的教程一致，否则会出错'" 
  type="error" />
  <FontComponent fontSize="20px" fontFamily="Arial" :bold="true">
      第一步、获取OE包以及工具栏Docker
  </FontComponent>
  
  <code-block
    :code="bashcode"
    language="bash"
  />
  <FontComponent fontSize="20px" fontFamily="Arial" :bold="true">
      第二步、使用Docker
  </FontComponent>
  <code-block
    :code="bashcode1"
    language="bash"
  />
  <FontComponent fontSize="20px" fontFamily="Arial" :bold="true">
      上述输出Usage: ddk_vcs [OPTIONS] COMMAND [ARGS]...,则可以正常使用
  </FontComponent>
</template>
<script>
import CodeBlock from '@/components/CodeBlock.vue';
export default {
  components: {
    CodeBlock,
  },
  data() {
    return {
      // 使用数组存储多个命令
      bashCommands: [
        'cd ~',
        'sudo apt update',
        'wget -c ftp://x5ftp@vrftp.horizon.ai/OpenExplorer/v1.2.6_release/horizon_x5_open_explorer_v1.2.6-py310_20240724.tar.gz --ftp-password=x5ftp@123$%',
        'wget -c ftp://x5ftp@vrftp.horizon.ai/OpenExplorer/v1.2.8_release/docker_openexplorer_ubuntu_20_x5_cpu_v1.2.8.tar.gz --ftp-password=x5ftp@123$%',
        'docker load -i docker_openexplorer_ubuntu_20_x5_cpu_v1.2.8.tar.gz',
        'tar -zxvf horizon_x5_open_explorer_v1.2.6-py310_20240724horizon_x5_open_explorer_v1.2.6-py310_20240724.tar.gz',
      ],
      bashCommand1: [
        'mkdir dataset',
        'docker run -it --rm -v ./horizon_x5_open_explorer_v1.2.6-py310_20240724:/open_explorer -v ./dataset:/data/horizon_x5/data openexplorer/ai_toolchain_ubuntu_20_x5_cpu:v1.2.8-py310',
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