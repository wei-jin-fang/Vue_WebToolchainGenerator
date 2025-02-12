<template>
    <FontComponent fontSize="20px" fontFamily="Arial" :bold="true">
       生成YAML
    </FontComponent>
    <div>
        <el-row>
      <!-- 左侧表单区域 -->
      <el-col :span="12">
        <el-form :model="form" label-width="120px">
          <!-- 1. Model Parameters -->
          <el-form-item label="ONNX 模型名称">
            <el-input v-model="form.onnx_model" placeholder="请输入模型路径" />
          </el-form-item>
          <el-form-item label="BPU 架构">
            <el-select v-model="form.march" placeholder="请选择架构">
              <el-option label="bayes-e" value="bayes-e" />
            </el-select>
          </el-form-item>
          <el-form-item label="输出中间结果">
            <el-select v-model="form.layer_out_dump" placeholder="选择是否输出中间结果">
              <el-option label="False" value="False" />
              <el-option label="True" value="True" />
            </el-select>
          </el-form-item>
          <el-form-item label="bin模型名称">
            <el-input v-model="form.output_model_file_prefix" placeholder="请输入前缀" />
          </el-form-item>
  
          <!-- 2. Input Parameters -->
          <el-row gutter="20">
            <el-col :span="12">
              <!-- <el-form-item label="输入名称">
                <el-input v-model="form.input_name" placeholder="请输入输入名称" />
              </el-form-item> -->
              <el-form-item label="输入格式-板卡">
                <el-select v-model="form.input_type_rt" placeholder="请选择数据格式">
                  <el-option label="nv12" value="nv12" />
                  <el-option label="rgb" value="rgb" />
                  <el-option label="bgr" value="bgr" />
                  <el-option label="yuv444" value="yuv444" />
                  <el-option label="gray" value="gray" />
                  <el-option label="featuremap" value="featuremap" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="输入布局 -板卡">
                <el-select v-model="form.input_layout_rt" placeholder="请选择输入排布">
                  <el-option label="NCHW" value="NCHW" />
                  <el-option label="NHWC" value="NHWC" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-row gutter="20">
            <el-col :span="12">
                <el-form-item label="输入格式-训练">
                <el-select v-model="form.input_type_train" placeholder="请选择训练数据格式">
                  <el-option label="rgb" value="rgb" />
                  <el-option label="bgr" value="bgr" />
                  <el-option label="gray" value="gray" />
                  <el-option label="featuremap" value="featuremap" />
                  <el-option label="yuv444" value="yuv444" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="输入布局-训练">
                <el-select v-model="form.input_layout_train" placeholder="请选择训练输入排布">
                  <el-option label="NCHW" value="NCHW" />
                  <el-option label="NHWC" value="NHWC" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
  
          <el-row gutter="20">
            <el-col :span="12">
                <el-form-item label="Input name">
                <el-input v-model="form.input_name" placeholder="请输入输入名称，可选" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="输入形状,可选">
                <el-input v-model="form.input_shape" placeholder="请输入输入尺寸，可选" />
              </el-form-item>
            </el-col>
          </el-row>
  
          <!-- 归一化方法 -->
          <el-form-item label="归一化方法">
            <el-select v-model="form.norm_type" placeholder="请选择归一化方法">
              <el-option label="no_preprocess" value="no_preprocess" />
              <el-option label="data_mean" value="data_mean" />
              <el-option label="data_scale" value="data_scale" />
              <el-option label="data_mean_and_scale" value="data_mean_and_scale" />
            </el-select>
          </el-form-item>
  
          <!-- 根据归一化方法显示 mean_value 和 scale_value -->
          <el-row v-if="form.norm_type === 'data_mean' || form.norm_type === 'data_mean_and_scale'" gutter="20">
            <el-col :span="8">
              <el-form-item label="均值 (R)">
                <el-input v-model="form.mean_value_r" placeholder="请输入R通道均值" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="均值 (G)">
                <el-input v-model="form.mean_value_g" placeholder="请输入G通道均值" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="均值 (B)">
                <el-input v-model="form.mean_value_b" placeholder="请输入B通道均值" />
              </el-form-item>
            </el-col>
          </el-row>
  
          <el-row v-if="form.norm_type === 'data_scale' || form.norm_type === 'data_mean_and_scale'" gutter="20">
            <el-col :span="8">
              <el-form-item label="缩放系数 (R)">
                <el-input v-model="form.scale_value_r" placeholder="请输入R通道缩放系数" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="缩放系数 (G)">
                <el-input v-model="form.scale_value_g" placeholder="请输入G通道缩放系数" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="缩放系数 (B)">
                <el-input v-model="form.scale_value_b" placeholder="请输入B通道缩放系数" />
              </el-form-item>
            </el-col>
          </el-row>
  
          <!-- 3. Calibration Parameters -->
          <el-form-item label="校准数据目录">
            <el-input v-model="form.cal_data_dir" placeholder="请输入校准数据目录" />
          </el-form-item>
          <el-form-item label="校准数据类型">
            <el-select v-model="form.cal_data_type" placeholder="请选择数据类型">
              <el-option label="float32" value="float32" />
              <el-option label="uint8" value="uint8" />
            </el-select>
          </el-form-item>
          <el-form-item label="校准类型">
            <el-select v-model="form.calibration_type" placeholder="请选择校准类型">
              <el-option label="default" value="default" />
              <el-option label="mix" value="mix" />
              <el-option label="kl" value="kl" />
              <el-option label="max" value="max" />
              <el-option label="load" value="load" />
            </el-select>
          </el-form-item>
  
          <!-- 4. Compiler Parameters -->
          <el-form-item label="编译模式">
            <el-select v-model="form.compile_mode" placeholder="请选择编译模式">
              <el-option label="bandwidth" value="bandwidth" />
              <el-option label="latency" value="latency" />
            </el-select>
          </el-form-item>
          <el-form-item label="开启调试模式">
            <el-select v-model="form.debug" placeholder="开启调试模式">
              <el-option label="True" value="True" />
              <el-option label="False" value="False" />
            </el-select>
          </el-form-item>
          <el-form-item label="优化等级">
            <el-select v-model="form.optimize_level" placeholder="选择优化等级">
              <el-option label="O0" value="O0" />
              <el-option label="O1" value="O1" />
              <el-option label="O2" value="O2" />
              <el-option label="O3" value="O3" />
            </el-select>
          </el-form-item>
  
          <el-form-item>
            <el-button type="primary" @click="generateYaml">生成YAML</el-button>
          </el-form-item>
        </el-form>
      </el-col>
  
      <!-- 右侧显示生成后的YAML区域，缩小宽度 -->
      <el-col :span="10" style="margin-left: 20px;">
        <code-block ref="codeComponent"
            :code="yamlText"
            language="yaml"
        />
      </el-col>
    </el-row>
  

    </div>
  </template>
  
  <script>
import CodeBlock from '@/components/CodeBlock.vue';

  export default {
    data() {
      return {
        form: {
          onnx_model: '',
          march: 'bayes-e',
          layer_out_dump: "False",
          output_model_file_prefix: '',
          input_name: '',
          input_type_rt: 'nv12',
          input_layout_rt: 'NCHW',
          input_type_train: 'rgb',
          input_layout_train: 'NCHW',
          input_shape: '',
          norm_type: 'no_preprocess',
          mean_value_r: 0,
          mean_value_g: 0,
          mean_value_b: 0,
          scale_value_r: 1.0,
          scale_value_g: 1.0,
          scale_value_b: 1.0,
          cal_data_dir: './calibration_data_rgb_f32',
          cal_data_type: 'float32',
          calibration_type: 'default',
          compile_mode: 'latency',
          debug: "True",
          optimize_level: 'O2'
        },
        yamlText: ''
      };
    },
    mounted() {
    // 确保在 mounted 钩子中访问 $refs
    console.log(this.$refs.codeComponent); // 确保可以访问到 ref
    this.$refs.codeComponent.$el.querySelector('pre').style.height = '600px';
    this.$refs.codeComponent.$el.querySelector('pre').style.color = 'white';
  },
    methods: {
        generateYaml() {
  let yaml = `
model_parameters:
    onnx_model: '/data/horizon_x5/data/${this.form.onnx_model}.onnx'
    march: '${this.form.march}'
    layer_out_dump: ${this.form.layer_out_dump}
    working_dir: 'model_output'
    output_model_file_prefix: '${this.form.output_model_file_prefix}'
  
input_parameters:
    input_name: '${this.form.input_name}'
    input_type_rt: '${this.form.input_type_rt}'
    input_layout_rt: '${this.form.input_layout_rt}'
    input_type_train: '${this.form.input_type_train}'
    input_layout_train: '${this.form.input_layout_train}'
    input_shape: '${this.form.input_shape}'
    norm_type: '${this.form.norm_type}'`;

  // 根据 norm_type 决定显示 mean_value 还是 scale_value
  if (this.form.norm_type === 'data_mean' || this.form.norm_type === 'data_mean_and_scale') {
    yaml += `
    mean_value: ${this.form.mean_value_r} ${this.form.mean_value_g} ${this.form.mean_value_b}`;
  }

  if (this.form.norm_type === 'data_scale' || this.form.norm_type === 'data_mean_and_scale') {
    yaml += `
    scale_value: ${this.form.scale_value_r} ${this.form.scale_value_g} ${this.form.scale_value_b}`;
  }

  yaml += `
calibration_parameters:
    cal_data_dir: '${this.form.cal_data_dir}'
    cal_data_type: '${this.form.cal_data_type}'
    calibration_type: '${this.form.calibration_type}'
  
compiler_parameters:
    compile_mode: '${this.form.compile_mode}'
    debug: ${this.form.debug}
    optimize_level: '${this.form.optimize_level}'`;

  this.yamlText = yaml;
}

    }
  };
  </script>
  
  <style scoped>
  .el-form-item {
    margin-bottom: 7px;
  }
  .el-card {
    padding: 5px;
    background: #f0f2f5;
    height: 100%;
  }
  
  </style>
  
