# [Vue_WebToolchainGenerator](https://github.com/wei-jin-fang/Vue_WebToolchainGenerator)
# 1.Classic Web Template Based on Vue3+ElementUI Plus

​	本项目基于其他开源项目进行了二次开发后，虽然实现了其他功能，但是可以按照下面内容进行修改，进行其他简易管理系统开发，并且实现了前后端分离，抽离了后端接口，已经做了**端口跨域处理冲突以及局域网访问开启和GETPOST封装**

![image-20250212170035175](https://gitee.com/jiuzheyangbawjf/img/raw/master/imgs/202502121700283.png)

​	以RDKx5 工具链命令生成器为例，旨在快速上手如何进行自定义涉及的网络模型转化，由于不同人网络设计不同，前处理不同，以及训练时候，推理时的NCHW不同，rgb、bgr自由组合过多，暂时无法实现通法，目前仅能起到一个学习工具链的快速体验。本博客第四章部分**4.基于CNN的水果分类模型转化**展示了一个自己设计的简单的CNN网络

**在此希望有缘人能够接入后端，因为本项目是由一个课设基于Springboot3+Vue3的实验室预约系统进行抽离得到的，里面项目删减后很乱，所以下面介绍如何快速上手修改**

1.该Web模板具有侧边栏，并且每一个可以通过`roter/index.js` 与`src\assets\menus.js` 进行修改跳转链接与侧边栏展示名字

2.对于现有页面，如何快速修改，只需要进入`src\pages` 中Chapter1、2、3分别代表第一级标题。只需要对于每个Vue文件中 `</template>`与`<script>`标签中代码进行html 和js代码替换即可。别的同原生前端三件套一致

3.`src\net\index.js` 中封装了post和get接口



1. 

# 2.运行方式

```
npm install
npm run dev
```

![image-20250212154420956](https://gitee.com/jiuzheyangbawjf/img/raw/master/imgs/202502121544040.png)

# 3.界面示效果

![image-20250212155812675](https://gitee.com/jiuzheyangbawjf/img/raw/master/imgs/202502121558796.png)

![image-20250212155024712](https://gitee.com/jiuzheyangbawjf/img/raw/master/imgs/202502121550804.png)

# 4.基于CNN的水果分类模型转化（同5.3）

下面是主要逐渐运行即可

训练时候RGB+NCHW

x5推理时候，读取brg 转成nv12

# 4.0 数据集格式

![image-20250212163211483](https://gitee.com/jiuzheyangbawjf/img/raw/master/imgs/202502121632505.png)

## 4.1 01dataresize

```
import cv2
import os


def resize_images(input_dir, output_dir, target_size=(300, 300)):
    """
    将指定目录下所有 JPG 图像调整为指定大小（默认300x300），并保存到输出目录。

    Args:
        input_dir (str): 输入图像所在的文件夹路径。
        output_dir (str): 输出图像保存的文件夹路径。
        target_size (tuple): 目标图像大小，默认为 (300, 300)。
    """
    # 创建输出目录（如果不存在的话）
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # 遍历输入目录中的所有文件
    for subdir, _, files in os.walk(input_dir):
        for file in files:
            # 只处理 .jpg 文件
            if file.lower().endswith(".jpg") or file.lower().endswith(".jpeg"):
                input_path = os.path.join(subdir, file)

                # 读取图片
                img = cv2.imread(input_path)
                if img is None:
                    print(f"无法读取图像: {input_path}")
                    continue

                # 调整图像大小
                resized_img = cv2.resize(img, target_size)

                # 生成输出图像的路径
                output_path = os.path.join(output_dir, os.path.relpath(input_path, input_dir))
                output_dir_for_image = os.path.dirname(output_path)

                # 创建输出目录（如果不存在的话）
                if not os.path.exists(output_dir_for_image):
                    os.makedirs(output_dir_for_image)

                # 保存调整大小后的图像
                cv2.imwrite(output_path, resized_img)
                print(f"已保存调整大小后的图像: {output_path}")
input_directory = "./fruits"  # 替换为你的输入文件夹路径
output_directory = "./resized_data"  # 替换为你希望保存调整后的图像的文件夹路径
resize_images(input_directory, output_directory)
```

## 4.2 02Fruit.py

```python
import os
import cv2
import torch
import torch.nn as nn
import torch.optim as optim
import torch.utils.data as data
import numpy as np
from torchvision import transforms
from torch.utils.data import Dataset, DataLoader
import torch.nn.functional as F
from PIL import Image


# 自定义BGR转RGB的转换类
class BGR2RGB(object):
    def __call__(self, img):
        return cv2.cvtColor(img, cv2.COLOR_BGR2RGB)



class Net(nn.Module):
    def __init__(self):
        super(Net, self).__init__()
        # 第一卷积层：输入3通道，输出10通道，卷积核大小5
        self.conv1 = nn.Conv2d(3, 10, kernel_size=5, stride=1, padding=2)  # 保持尺寸
        # 最大池化层：2x2池化，减小空间尺寸
        self.pool = nn.MaxPool2d(kernel_size=2, stride=2)
        # 第二卷积层：输入10通道，输出20通道，卷积核大小5
        self.conv2 = nn.Conv2d(10, 20, kernel_size=5, stride=1, padding=2)  # 保持尺寸
        # 第三卷积层：输入20通道，输出40通道，卷积核大小3
        self.conv3 = nn.Conv2d(20, 40, kernel_size=3, stride=1, padding=1)  # 保持尺寸
        # 第四卷积层：输入40通道，输出80通道，卷积核大小3
        self.conv4 = nn.Conv2d(40, 80, kernel_size=3, stride=1, padding=1)  # 保持尺寸
        # 全局平均池化：将每个特征图压缩为一个值
        self.pooling = nn.AdaptiveAvgPool2d(1)  # 输出尺寸 1x1x80
        # 全连接层：将全局池化后的80维输入到全连接层
        self.fc = nn.Linear(80, 3)  # 3个分类

    def forward(self, x):
        # 第一卷积层 + 池化层
        x = self.pool(torch.relu(self.conv1(x)))
        # 第二卷积层 + 池化层
        x = self.pool(torch.relu(self.conv2(x)))
        # 第三卷积层 + 池化层
        x = self.pool(torch.relu(self.conv3(x)))
        # 第四卷积层 + 池化层
        x = self.pool(torch.relu(self.conv4(x)))
        # 全局平均池化层
        x = self.pooling(x)  # 输出大小: [batch_size, 80, 1, 1]
        # 展平
        x = x.view(-1, 80)  # 展平为[batch_size, 80]
        # 全连接层
        x = self.fc(x)
        return x


def image_to_tensor(image_path, transform=None):
    # 读取图像（默认为BGR）
    image = cv2.imread(image_path)

    # 如果存在transform，则应用转换
    if transform:
        image = transform(image)

    # 1. 将BGR转为RGB（通过切片操作）
    image_rgb = image[:, :, ::-1]  # BGR -> RGB

    # 2. 将HWC布局转为CHW布局
    image_chw = image_rgb.transpose(2, 0, 1)  # HWC -> CHW

    # 3. 创建数组副本，避免负步幅
    image_chw = image_chw.copy()  # 使用copy()来避免负步幅问题

    # 4. 转换为Tensor类型
    #image_tensor = torch.from_numpy(image_chw).float() # / 255.0  # 转为Tensor并归一化 
    '''
    修改处
    '''
    image_tensor = torch.from_numpy(image_chw).float()/ 255.0  # 转为Tensor并归一化



    return image_tensor

# 定义自定义数据集
class CustomDataset(data.Dataset):
    def __init__(self, data_dir, transform=None):
        self.data_dir = data_dir  # 数据目录
        self.transform = transform  # 数据变换（如果有）
        self.image_paths = []  # 存储图像路径
        self.labels = []  # 存储标签
        self.label_map = {'0': 0, '1': 1, '2': 2}  # 标签与数字的映射

        # 遍历每个类别文件夹
        for label_folder in os.listdir(data_dir):
            label_folder_path = os.path.join(data_dir, label_folder)
            if os.path.isdir(label_folder_path):
                for image_name in os.listdir(label_folder_path):
                    if image_name.endswith('.jpg'):
                        image_path = os.path.join(label_folder_path, image_name)
                        self.image_paths.append(image_path)
                        self.labels.append(self.label_map[label_folder])  # 获取标签

    def __len__(self):
        return len(self.image_paths)  # 返回数据集的大小

    def __getitem__(self, idx):
        image_path = self.image_paths[idx]
        label = self.labels[idx]

        # 使用 OpenCV 读取图像
        image = image_to_tensor(image_path)
        # print(type(image))#<class 'numpy.ndarray'>
        # 如果有transform，应用转换
        # if self.transform:
        #     image = self.transform(image)
        # print(image.shape) #torch.Size([3, 300, 300])
        # print(type(image))#<class 'torch.Tensor'>
        # print((image).dtype)#torch.float32
        return image, label


# 定义数据转换（包括BGR到RGB的转换，不需要在外部进行归一化）
transform = transforms.Compose([
    # BGR2RGB(),  # 将BGR图像转换为RGB
    # transforms.ToTensor(),  # 转换为Tensor，像素值缩放到 [0, 1]

])

# 创建训练数据集
data_dir = 'resized_data'  # 数据所在文件夹路径
dataset = CustomDataset(data_dir=data_dir, transform=transform)

# 创建数据加载器
batch_size = 32  # 设置批处理大小
train_loader = DataLoader(dataset, batch_size=batch_size, shuffle=True)

# 创建模型实例
model = Net()

# 定义损失函数和优化器
criterion = nn.CrossEntropyLoss()  # 交叉熵损失函数
optimizer = optim.Adam(model.parameters(), lr=0.001)  # Adam优化器

# 训练模型（一个简单的训练循环示例）
num_epochs = 10  # 训练轮数

for epoch in range(num_epochs):
    model.train()  # 设定为训练模式
    running_loss = 0.0
    correct = 0
    total = 0

    for inputs, labels in train_loader:
        # 将输入数据移到GPU（如果有GPU）
        inputs, labels = inputs.to("cpu"), labels.to("cpu")

        # 清零梯度
        optimizer.zero_grad()

        # 前向传播
        outputs = model(inputs)
        loss = criterion(outputs, labels)  # 计算损失

        # 反向传播
        loss.backward()

        # 更新权重
        optimizer.step()

        # 统计损失和准确率
        running_loss += loss.item()
        _, predicted = torch.max(outputs, 1)
        total += labels.size(0)
        correct += (predicted == labels).sum().item()

    epoch_loss = running_loss / len(train_loader)
    epoch_accuracy = 100 * correct / total

    print(f'Epoch [{epoch + 1}/{num_epochs}], Loss: {epoch_loss:.4f}, Accuracy: {epoch_accuracy:.2f}%')

# 保存训练好的模型
torch.save(model, './Fruit.pt')
print("模型已保存！")
print("Model saved!")

```

## 4.3 03Infer_pt.py

```
import os

import cv2
import torch
from torch import nn, optim
from torch.utils.data import Dataset, DataLoader, Subset
from torchvision import transforms
from PIL import Image
import pandas as pd
import torch.nn.functional as F
# 定义网络模型
class Net(nn.Module):
    def __init__(self):
        super(Net, self).__init__()
        # 第一卷积层：输入3通道，输出10通道，卷积核大小5
        self.conv1 = nn.Conv2d(3, 10, kernel_size=5, stride=1, padding=2)  # 保持尺寸
        # 最大池化层：2x2池化，减小空间尺寸
        self.pool = nn.MaxPool2d(kernel_size=2, stride=2)
        # 第二卷积层：输入10通道，输出20通道，卷积核大小5
        self.conv2 = nn.Conv2d(10, 20, kernel_size=5, stride=1, padding=2)  # 保持尺寸
        # 第三卷积层：输入20通道，输出40通道，卷积核大小3
        self.conv3 = nn.Conv2d(20, 40, kernel_size=3, stride=1, padding=1)  # 保持尺寸
        # 全连接层：将经过卷积和池化后的特征图展平后输入
        self.fc1 = nn.Linear(40 * 37 * 37, 128)  # 40通道，37x37的特征图
        self.fc2 = nn.Linear(128, 3)  # 3个分类

    def forward(self, x):
        # 第一卷积层 + 池化层
        x = self.pool(torch.relu(self.conv1(x)))
        # 第二卷积层 + 池化层
        x = self.pool(torch.relu(self.conv2(x)))
        # 第三卷积层 + 池化层
        x = self.pool(torch.relu(self.conv3(x)))
        # 展平
        x = x.view(-1, 40 * 37 * 37)  # 展平为向量
        # 第一个全连接层
        x = torch.relu(self.fc1(x))
        # 第二个全连接层
        x = self.fc2(x)
        return x


# # 创建模型实例
model = Net()
model = torch.load('./Fruit.pt')
model.eval()  # 设置为评估模式


# 加载你自己的图片
image_path = r"0.jpg"  # 替换为你的图片路径

# 使用 OpenCV 读取图片
image = cv2.imread(image_path)  # 读取图片，默认是 BGR 格式
image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)  # 转换为 RGB 格式

# 定义预处理步骤，不进行 resize，直接转换为 Tensor
transform = transforms.Compose([
    transforms.ToTensor(),  # 将图片转换为 Tensor，形状为 [C, H, W]
])

# 使用 transform 对图像进行预处理
image = transform(image)
# 添加一个维度以匹配模型的输入形状 (batch_size, channels, height, width)
image = image.unsqueeze(0)  # 变为 [1, 3, 300, 300]，即 [batch_size, channels, height, width]

# 使用模型进行预测
with torch.no_grad():
    print(image.shape)  # torch.Size([3, 300, 300]) 或 torch.Size([1, 3, 300, 300])
    output = model(image)  # 模型预测
    predicted_class = torch.argmax(output).item()  # 获取预测结果

print(f"Predicted class: {predicted_class}, True class: {image_path[:1]}")  # 假设 True class 为 7
```

## 4.4 04Export.py

```python
import torch.onnx
import os
import torch
from torch import nn, optim
from torch.utils.data import Dataset, DataLoader, Subset
from torchvision import transforms
from PIL import Image
import pandas as pd
import torch.nn.functional as F

class Net(nn.Module):
    def __init__(self):
        super(Net, self).__init__()
        # 第一卷积层：输入3通道，输出10通道，卷积核大小5
        self.conv1 = nn.Conv2d(3, 10, kernel_size=5, stride=1, padding=2)  # 保持尺寸
        # 最大池化层：2x2池化，减小空间尺寸
        self.pool = nn.MaxPool2d(kernel_size=2, stride=2)
        # 第二卷积层：输入10通道，输出20通道，卷积核大小5
        self.conv2 = nn.Conv2d(10, 20, kernel_size=5, stride=1, padding=2)  # 保持尺寸
        # 第三卷积层：输入20通道，输出40通道，卷积核大小3
        self.conv3 = nn.Conv2d(20, 40, kernel_size=3, stride=1, padding=1)  # 保持尺寸
        # 第四卷积层：输入40通道，输出80通道，卷积核大小3
        self.conv4 = nn.Conv2d(40, 80, kernel_size=3, stride=1, padding=1)  # 保持尺寸
        # 全局平均池化：将每个特征图压缩为一个值
        self.pooling = nn.AdaptiveAvgPool2d(1)  # 输出尺寸 1x1x80
        # 全连接层：将全局池化后的80维输入到全连接层
        self.fc = nn.Linear(80, 3)  # 3个分类

    def forward(self, x):
        # 第一卷积层 + 池化层
        x = self.pool(torch.relu(self.conv1(x)))
        # 第二卷积层 + 池化层
        x = self.pool(torch.relu(self.conv2(x)))
        # 第三卷积层 + 池化层
        x = self.pool(torch.relu(self.conv3(x)))
        # 第四卷积层 + 池化层
        x = self.pool(torch.relu(self.conv4(x)))
        # 全局平均池化层
        x = self.pooling(x)  # 输出大小: [batch_size, 80, 1, 1]
        # 展平
        x = x.view(-1, 80)  # 展平为[batch_size, 80]
        # 全连接层
        x = self.fc(x)
        return x

model = Net()
model = torch.load('./Fruit.pt')
device="cpu"
# 设置模型为推理模式
model.eval().to(device)

# 设置模型输入的尺寸
# b channel width heigh
dummy_input = torch.randn(1, 3,300,300).to(device)
with torch.no_grad():
    # 导出ONNX模型
    torch.onnx.export(model,  # model being run
                  dummy_input,  # model input (or a tuple for multiple inputs)
                  "Fruit.onnx",  # where to save the model
                  opset_version=11,  # the ONNX version to export the model to
                  input_names=['input'],  # the model's input names
                  output_names=['output'],  # the model's output names
                  )
print('Model has been converted to ONNX')

import  onnx
onnx_model=onnx.load("./Fruit.onnx")
onnx.checker.check_model(onnx_model)

```

## 4.5 .infer onnx

```python
import cv2
import onnx
import onnxruntime as ort
import numpy as np
import os
from PIL import Image
from torchvision import transforms

# 加载 ONNX 模型
onnx_model_path = "./Fruit.onnx"
onnx_model = onnx.load(onnx_model_path)

# 设置推理会话，明确指定使用 CPU 提供者
session = ort.InferenceSession(onnx_model_path, providers=['CPUExecutionProvider'])

#
# def preprocess_image(image_path):
#     # 1. 使用 OpenCV 读取图像
#     image = cv2.imread(image_path)  # 默认是 BGR 格式
#     # 2. 将 BGR 转换为 RGB 格式
#     image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
#     # 3. 将 NumPy 数组转换为 PIL 图像
#     # 4. 转换为 [C, H, W] 格式
#     image = np.transpose(image, (2, 0, 1))
#     # 5. 添加一个维度以匹配模型输入的形状 (batch_size, channels, height, width)
#     image = image.reshape(1, *image.shape)  # 变为 [1, C, H, W]
#     # 6. 返回处理后的图像，转换为 float32 类型
#     return image.astype(np.float32)
def preprocess_image(image_path):
    # 1. 使用 OpenCV 读取图像
    image = cv2.imread(image_path)  # 默认是 BGR 格式

    # 2. 将 BGR 转换为 RGB 格式
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    # 3. 将图像从 HWC 布局转换为 CHW 布局
    image_chw = np.transpose(image, (2, 0, 1))  # HWC -> CHW

    # 4. 归一化处理，将像素值除以 255 使其在 [0, 1] 范围内
    '''
    修改处
    '''
    image_chw = image_chw.astype(np.float32) / 255.0
    #image_chw = image_chw.astype(np.float32) 
    # 5. 增加一个维度，变为 [1, C, H, W] 形状，以符合模型输入要求
    image_chw = image_chw.reshape(1, *image_chw.shape)  # 变为 [1, C, H, W]

    return image_chw


def evaluate_model(image_folder):
    correct_predictions = 0
    total_images = 0

    # 获取文件夹内所有的图片文件
    for filename in os.listdir(image_folder):
        # 只处理以 0、1、2 开头的 jpg 文件
        if filename[0] in ['0', '1', '2'] and filename.lower().endswith('.jpg'):
            image_path = os.path.join(image_folder, filename)

            # 预处理输入图像
            input_data = preprocess_image(image_path)

            # 获取模型的输入和输出名称
            input_name = session.get_inputs()[0].name
            output_name = session.get_outputs()[0].name

            # 进行推理
            outputs = session.run([output_name], {input_name: input_data})

            # 获取预测类别（假设输出是一个 logits 向量）
            output_data = outputs[0]
            predicted_class = np.argmax(output_data, axis=1)[0]

            # 获取真实标签，假设文件名的第一个字符是真实标签
            true_label = int(filename[0])  # 从文件名中提取标签（例如：'0_image.jpg' 的标签是 0）

            # 输出预测结果
            print(f"文件名: {filename}, 真实标签: {true_label}, 预测标签: {predicted_class}")

            # 统计正确预测
            total_images += 1
            if predicted_class == true_label:
                correct_predictions += 1

    # 计算并输出准确率
    if total_images > 0:
        accuracy = correct_predictions / total_images
        print(f"正确率: {accuracy * 100:.2f}%")
    else:
        print("没有找到符合要求的图片文件。")


# 主程序入口
if __name__ == "__main__":
    image_folder = "./resized_data_back"  # 这个自己找点数据
    evaluate_model(image_folder)

```

## 4.6. model check

 把onnx模型放到/data/horizon_x5/data/目录下

```
hb_mapper checker --model-type onnx --model "/data/horizon_x5/data/Fruit.onnx" --march bayes-e
```

## 4.7 mycalibration.py 

**目前就是这是第一步用户需要根据自己训练代码进行处理的**，根据了解，也是瞎捣鼓，感觉把除了归一化放到yaml文件里面，也就是乘法除法放到yaml配置后面有。然后这里处理rgb还是bga、处理NCHW还是NHWC

数据集格式：总共有三类123

![image-20250212163438482](https://gitee.com/jiuzheyangbawjf/img/raw/master/imgs/202502121634539.png)

```python
import os
import cv2
import numpy as np

def print_image_info(img, step):
    """
    打印图像的颜色格式和形状信息
    :param img: 输入图像（numpy array）
    :param step: 当前步骤描述
    """
    if len(img.shape) == 2:  # 灰度图像 (H, W)
        print(f"Step: {step} - Gray, Shape: {img.shape}")
    elif len(img.shape) == 3:
        if img.shape[2] == 3:  # BGR 或 RGB 图像 (H, W, 3)
            print(f"Step: {step} - RGB/BGR, Shape: {img.shape}")
        elif img.shape[2] == 4:  # RGBA 图像
            print(f"Step: {step} - RGBA, Shape: {img.shape}")
        else:
            print(f"Step: {step} - Unknown 3D Image, Shape: {img.shape}")
    else:
        print(f"Step: {step} - Unknown format, Shape: {img.shape}")

src_root = r'/data/horizon_x5/data/src_dir/Fruit'
cal_img_num = 20  # 想要的图像个数
dst_root = './calibration_data_rgb_f32'


## 1. 从原始图像文件夹中获取20个图像作为校准数据
num_count = 0
img_names = []
for src_name in sorted(os.listdir(src_root)):
    if num_count > cal_img_num:
        break
    img_names.append(src_name)
    num_count += 1

# 检查目标文件夹是否存在，如果不存在就创建
if not os.path.exists(dst_root):
    os.system('mkdir {0}'.format(dst_root))

## 2.1 定义图像缩放函数，返回为np.float32
# 图像缩放为目标尺寸(W, H)
# 值得注意的是，缩放时候，长宽等比例缩放，空白的区域填充颜色为pad_value, 默认127
def imequalresize(img, target_size, pad_value=127.):
    target_w, target_h = target_size
    image_h, image_w = img.shape[:2]
    img_channel = 3 if len(img.shape) > 2 else 1

    # 确定缩放尺度，确定最终目尺寸
    scale = min(target_w * 1.0 / image_w, target_h * 1.0 / image_h)
    new_h, new_w = int(scale * image_h), int(scale * image_w)

    resize_image = cv2.resize(img, (new_w, new_h))

    # 如果是灰度图像，扩展为 (H, W, 1)
    if len(resize_image.shape) == 2:  # 灰度图像
        resize_image = resize_image[:, :, np.newaxis]  # 扩展为 (H, W, 1)

    # elif 避免重复如果是彩色图像（3通道），resize_image 应该是 (H, W, 3)
    elif len(resize_image.shape) == 3 and resize_image.shape[2] == 1:  # 单通道扩展为3通道
        resize_image = np.repeat(resize_image, 3, axis=2)

    # 准备待返回图像
    pad_image = np.full(shape=[target_h, target_w, img_channel], fill_value=pad_value)

    # 将图像resize_image放置在pad_image的中间
    dw, dh = (target_w - new_w) // 2, (target_h - new_h) // 2
    pad_image[dh:new_h + dh, dw:new_w + dw, :] = resize_image
    return pad_image

## 2.2 开始转换
for each_imgname in img_names:
    img_path = os.path.join(src_root, each_imgname)

    # Step 1: 读取图像
    img = cv2.imread(img_path, cv2.IMREAD_UNCHANGED)  # 默认读取为灰度图或BGR图像
    print_image_info(img, "Read Image")

    # Step 2: 判断图像模式，灰度图不需要RGB转换
    if len(img.shape) == 2:  # 如果是灰度图
        print_image_info(img, "Skip RGB conversion (Grayscale)")
    elif len(img.shape) == 3 and img.shape[2] == 3:  # 如果是BGR图像
        # 将BGR转换为RGB
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)  # 转换为 RGB
        print_image_info(img, "Convert to RGB")
    elif len(img.shape) == 3 and img.shape[2] == 4:  # 如果是RGBA图像
        # 去掉Alpha通道，只保留RGB
        img = img[:, :, :3]
        print_image_info(img, "Remove Alpha Channel (RGBA)")
    else:
        print("Unrecognized image format, skipping processing")
        continue

    # Step 3: 缩放图像
    #img = imequalresize(img, (300, 300))  # Resize to 28x28, padding if necessary
    #print_image_info(img, "Resize Image")

    # Step 4: 转换为 CHW 符合pytorch模型架构输入
    img = np.transpose(img, (2, 0, 1))  # Convert to CHW format (C, H, W)
    print_image_info(img, "Convert to CHW")

    # Step 5: 转换数据类型为 float32
    img = img.astype(np.float32)  # 保证数据为float32
    print_image_info(img, "Convert to float32")

    # 将图像保存到目标文件夹下
    dst_path = os.path.join(dst_root, each_imgname + '.rgbchw')
    print(f"write: {dst_path}")
    img.tofile(dst_path)  # 直接保存为二进制数据
print('Finish')
```

## 4.8  yaml

```yaml
# Copyright (c) 2020 Horizon Robotics.All Rights Reserved.
#
# The material in this file is confidential and contains trade secrets
# of Horizon Robotics Inc. This is proprietary information owned by
# Horizon Robotics Inc. No part of this work may be disclosed,
# reproduced, copied, transmitted, or used in any way for any purpose,
# without the express written permission of Horizon Robotics Inc.

# 模型转化相关的参数
# ------------------------------------
# model conversion related parameters
model_parameters:
  # ONNX浮点网络数据模型文件
  # -------------------------------------------------------------------------------------------------------------------
  # the model file of floating-point ONNX neural network data
  onnx_model: '/data/horizon_x5/data/Fruit.onnx'

  # 适用BPU架构
  # --------------------------------
  # the applicable BPU architecture
  march: "bayes-e"

  # 指定模型转换过程中是否输出各层的中间结果，如果为True，则输出所有层的中间输出结果，
  # ---------------------------------------------------------------------------------------
  # specifies whether or not to dump the intermediate results of all layers in conversion
  # if set to True, then the intermediate results of all layers shall be dumped
  layer_out_dump: False

  # 模型转换输出的结果的存放目录
  # ---------------------------------------------------------------------------------------
  # the directory in which model conversion results are stored
  working_dir: 'model_output'

  # 模型转换输出的用于上板执行的模型文件的名称前缀
  # -----------------------------------------------------------------------------------------
  # model conversion generated name prefix of those model files used for dev board execution
  output_model_file_prefix: 'Fruit'


# 模型输入相关参数, 若输入多个节点, 则应使用';'进行分隔, 使用默认缺省设置则写None
# -------------------------------------------------------------------------
# model input related parameters,
# please use ";" to seperate when inputting multiple nodes,
# please use None for default setting
input_parameters:

  # (选填) 模型输入的节点名称, 此名称应与模型文件中的名称一致, 否则会报错, 不填则会使用模型文件中的节点名称
  # -------------------------------------------------------------------------------------------------
  # (Optional) node name of model input,
  # it shall be the same as the name of model file, otherwise an error will be reported,
  # the node name of model file will be used when left blank
  input_name: ""

  # 网络实际执行时，输入给网络的数据格式，包括 nv12/rgb/bgr/yuv444/gray/featuremap,
  # ------------------------------------------------------------------------------------------
  # the data formats to be passed into neural network when actually performing neural network
  # available options: nv12/rgb/bgr/yuv444/gray/featuremap,

  input_type_rt: 'nv12'

  # 网络实际执行时输入的数据排布, 可选值为 NHWC/NCHW
  # 若input_type_rt配置为nv12，则此处参数不需要配置
  # ------------------------------------------------------------------
  # the data layout formats to be passed into neural network when actually performing neural network, available options: NHWC/NCHW
  # If input_type_rt is configured as nv12, then this parameter does not need to be configured
  # input_layout_rt: 'NCHW'

  # 网络训练时输入的数据格式，可选的值为rgb/bgr/gray/featuremap/yuv444
  # ---------------------------------------------------------------------
  # the data formats in network training
  # available options: rgb/bgr/gray/featuremap/yuv444
  input_type_train: 'rgb'

  # 网络训练时输入的数据排布, 可选值为 NHWC/NCHW
  # ---------------------------------------------------------------------
  # the data layout in network training, available options: NHWC/NCHW
  input_layout_train: 'NCHW'

  # (选填) 模型网络的输入大小, 以'x'分隔, 不填则会使用模型文件中的网络输入大小，否则会覆盖模型文件中输入大小
  # -------------------------------------------------------------------------------------------
  # (Optional)the input size of model network, seperated by 'x'
  # note that the network input size of model file will be used if left blank
  # otherwise it will overwrite the input size of model file
  input_shape: ''

  # 网络实际执行时，输入给网络的batch_size, 默认值为1
  # ---------------------------------------------------------------------
  # the data batch_size to be passed into neural network when actually performing neural network, default value: 1
  #input_batch: 1

  # 网络输入的预处理方法，主要有以下几种：
  # no_preprocess 不做任何操作
  # data_mean 减去通道均值mean_value
  # data_scale 对图像像素乘以data_scale系数
  # data_mean_and_scale 减去通道均值后再乘以scale系数
  # -------------------------------------------------------------------------------------------
  # preprocessing methods of network input, available options:
  # 'no_preprocess' indicates that no preprocess will be made
  # 'data_mean' indicates that to minus the channel mean, i.e. mean_value
  # 'data_scale' indicates that image pixels to multiply data_scale ratio
  # 'data_mean_and_scale' indicates that to multiply scale ratio after channel mean is minused
  norm_type: 'data_scale'

  # 图像减去的均值, 如果是通道均值，value之间必须用空格分隔
  # --------------------------------------------------------------------------
  # the mean value minused by image
  # note that values must be seperated by space if channel mean value is used
  #mean_value: 127 127 127

  # 图像预处理缩放比例，如果是通道缩放比例，value之间必须用空格分隔
  # ---------------------------------------------------------------------------
  # scale value of image preprocess
  # note that values must be seperated by space if channel scale value is used
  # scale_value: 0.0078125 0.0078125 0.0078125
  scale_value: 255 255 255

# 模型量化相关参数
# -----------------------------
# model calibration parameters
calibration_parameters:

  # 模型量化的参考图像的存放目录，图片格式支持Jpeg、Bmp等格式，输入的图片
  # 应该是使用的典型场景，一般是从测试集中选择20~100张图片，另外输入
  # 的图片要覆盖典型场景，不要是偏僻场景，如过曝光、饱和、模糊、纯黑、纯白等图片
  # 若有多个输入节点, 则应使用';'进行分隔
  # -----------------------------------------------------------------------
  # the directory where reference images of model quantization are stored
  # image formats include JPEG, BMP etc.
  # should be classic application scenarios, usually 20~100 images are picked out from test datasets
  # in addition, note that input images should cover typical scenarios
  # and try to avoid those overexposed, oversaturated, vague,
  # pure blank or pure white images
  # use ';' to seperate when there are multiple input nodes
  cal_data_dir: './calibration_data_rgb_f32'

  # 校准数据二进制文件的数据存储类型，可选值为：float32, uint8
  # calibration data binary file save type, available options: float32, uint8
  cal_data_type: 'float32'

  # 如果输入的图片文件尺寸和模型训练的尺寸不一致时，并且preprocess_on为true，
  # 则将采用默认预处理方法(skimage resize)，
  # 将输入图片缩放或者裁减到指定尺寸，否则，需要用户提前把图片处理为训练时的尺寸
  # ----------------------------------------------------------------------------------
  # In case the size of input image file is different from that of in model training
  # and that preprocess_on is set to True,
  # shall the default preprocess method(skimage resize) be used
  # i.e., to resize or crop input image into specified size
  # otherwise user must keep image size as that of in training in advance
  # preprocess_on: False

  # 模型量化的算法类型，支持default、mix、kl、max、load，通常采用default即可满足要求
  # 如不符合预期可先尝试修改为mix 仍不符合预期再尝试kl或max
  # 当使用QAT导出模型时，此参数则应设置为load
  # 相关参数的技术原理及说明请您参考用户手册中的PTQ原理及步骤中参数组详细介绍部分
  # ----------------------------------------------------------------------------------
  # The algorithm type of model quantization, support default, mix, kl, max, load, usually use default can meet the requirements.
  # If it does not meet the expectation, you can try to change it to mix first. If there is still no expectation, try kl or max again.
  # When using QAT to export the model, this parameter should be set to load.
  # For more details of the parameters, please refer to the parameter details in PTQ Principle And Steps section of the user manual.
  calibration_type: 'default'

# 编译器相关参数
# ----------------------------
# compiler related parameters
compiler_parameters:

  # 编译策略，支持bandwidth和latency两种优化模式;
  # bandwidth以优化ddr的访问带宽为目标；
  # latency以优化推理时间为目标
  # ------------------------------------------------------------------------------------------
  # compilation strategy, there are 2 available optimization modes: 'bandwidth' and 'lantency'
  # the 'bandwidth' mode aims to optimize ddr access bandwidth
  # while the 'lantency' mode aims to optimize inference duration
  compile_mode: 'latency'

  # 设置debug为True将打开编译器的debug模式，能够输出性能仿真的相关信息，如帧率、DDR带宽占用等
  # ------------------------------------------------------------------------------------------
  # the compiler's debug mode will be enabled by setting to True
  # this will dump performance simulation related information
  # such as: frame rate, DDR bandwidth usage etc.
  debug: True

  # 编译模型指定核数，不指定默认编译单核模型, 若编译双核模型，将下边注释打开即可
  # -------------------------------------------------------------------------------------
  # specifies number of cores to be used in model compilation
  # as default, single core is used as this value left blank
  # please delete the "# " below to enable dual-core mode when compiling dual-core model
  # core_num: 2

  # 优化等级可选范围为O0~O3
  # O0不做任何优化, 编译速度最快，优化程度最低,
  # O1-O3随着优化等级提高，预期编译后的模型的执行速度会更快，但是所需编译时间也会变长。
  # 推荐用O2做最快验证
  # ---------------------------------------------------------------------------------------
  # optimization level ranges between O0~O3
  # O0 indicates that no optimization will be made
  # the faster the compilation, the lower optimization level will be
  # O1-O3: as optimization levels increase gradually, model execution, after compilation,
  # shall become faster while compilation will be prolonged
  # it is recommended to use O2 for fastest verification
  optimize_level: 'O3'
```

## 4.9 infer on X5

### 4.9.1适配的数据集格式

![image-20250212163022486](https://gitee.com/jiuzheyangbawjf/img/raw/master/imgs/202502121630567.png)

### 4.9.2 code

```python
import cv2
import numpy as np
from hobot_dnn import pyeasy_dnn as dnn
import argparse
import os


def bgr2nv12_opencv(image):
    # 如果需要处理 RGB 图像，请先转换为 BGR
    if image.shape[2] == 3 and image.shape[2] == 'RGB':
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

    height, width = image.shape[0], image.shape[1]
    area = height * width
    yuv420p = cv2.cvtColor(image, cv2.COLOR_BGR2YUV_I420).reshape((area * 3 // 2,))
    y = yuv420p[:area]
    uv_planar = yuv420p[area:].reshape((2, area // 4))
    uv_packed = uv_planar.transpose((1, 0)).reshape((area // 2,))

    nv12 = np.zeros_like(yuv420p)
    nv12[:height * width] = y
    nv12[height * width:] = uv_packed
    return nv12


def print_properties(pro):
    print("tensor type:", pro.tensor_type)
    print("data type:", pro.dtype)
    print("layout:", pro.layout)
    print("shape:", pro.shape)


def parse_args():
    # 解析命令行参数
    parser = argparse.ArgumentParser(description="Image Inference with DNN model")
    parser.add_argument('--image_folder', type=str, required=True, help="Path to input image folder")
    return parser.parse_args()


def main():
    # 解析命令行参数
    args = parse_args()
    image_folder = args.image_folder

    # 加载模型
    binpath = "./FruitTrain255Yaml255.bin"
    models = dnn.load(binpath)

    # 打印输入 tensor 的属性
    print("输入类型")
    print_properties(models[0].inputs[0].properties)

    # 初始化正确预测计数和总数
    correct_predictions = 0
    total_images = 0

    # 遍历文件夹中的所有文件
    for filename in os.listdir(image_folder):
        # 只处理以 0、1、2 开头的文件 这里我是把三个类别的给命名了
        if filename[0] in ['0', '1', '2'] and filename.lower().endswith(('.jpg', '.jpeg', '.png')):

            # 获取图像路径
            image_path = os.path.join(image_folder, filename)

            # 预处理输入图像
            img = cv2.imread(image_path, cv2.IMREAD_UNCHANGED)  # 默认读取为灰度图或BGR图像
            img = bgr2nv12_opencv(img)

            # 模型推理
            outputs = models[0].forward(img)

            # 获取模型输出的值，假设输出是形状为 (1, 1, 1, N) 的数组，N是类别数
            output_array = np.array(outputs[0].buffer)
            print(output_array)
            # 假设输出形状为 (1, 1, 1, N)，我们需要提取该数组的最大值
            predicted_label = np.argmax(output_array)

            # 获取真实标签，假设文件名的第一个字符是真实标签
            true_label = int(filename[0])  # 从文件名中提取标签
            print(f"文件名: {filename}, 真实标签: {true_label}, 预测标签: {predicted_label}")

            # 统计正确预测
            total_images += 1
            if predicted_label == true_label:
                correct_predictions += 1

    # 计算并输出正确率
    if total_images > 0:
        accuracy = correct_predictions / total_images
        print(f"正确率: {accuracy * 100:.2f}%")
    else:
        print("没有找到符合要求的图片文件。")


if __name__ == "__main__":
    main()

```

# 5. result

## 5.1 Debug：预处理前后一致(彩色图)

| 训练，均CHW、RGB训练 | 校准         | 转模型    | 推理         | onnx-->bin准确率结果 |
| -------------------- | ------------ | --------- | ------------ | -------------------- |
| 1.转Tensor不除以255  | 只转RGB，CHW | noprocess | 转nv12 转rgb | 91-->78              |
| 2.转Tensor除以255    | 只转RGB，CHW | datascale | 转nv12 转rgb | 87-->82              |

## 5.2 Demo-转Tensor不除以255：

1.Train

```python
import os
import cv2
import torch
import torch.nn as nn
import torch.optim as optim
import torch.utils.data as data
import numpy as np
from torchvision import transforms
from torch.utils.data import Dataset, DataLoader
import torch.nn.functional as F
from PIL import Image


# 自定义BGR转RGB的转换类
class BGR2RGB(object):
    def __call__(self, img):
        return cv2.cvtColor(img, cv2.COLOR_BGR2RGB)



class Net(nn.Module):
    def __init__(self):
        super(Net, self).__init__()
        # 第一卷积层：输入3通道，输出10通道，卷积核大小5
        self.conv1 = nn.Conv2d(3, 10, kernel_size=5, stride=1, padding=2)  # 保持尺寸
        # 最大池化层：2x2池化，减小空间尺寸
        self.pool = nn.MaxPool2d(kernel_size=2, stride=2)
        # 第二卷积层：输入10通道，输出20通道，卷积核大小5
        self.conv2 = nn.Conv2d(10, 20, kernel_size=5, stride=1, padding=2)  # 保持尺寸
        # 第三卷积层：输入20通道，输出40通道，卷积核大小3
        self.conv3 = nn.Conv2d(20, 40, kernel_size=3, stride=1, padding=1)  # 保持尺寸
        # 第四卷积层：输入40通道，输出80通道，卷积核大小3
        self.conv4 = nn.Conv2d(40, 80, kernel_size=3, stride=1, padding=1)  # 保持尺寸
        # 全局平均池化：将每个特征图压缩为一个值
        self.pooling = nn.AdaptiveAvgPool2d(1)  # 输出尺寸 1x1x80
        # 全连接层：将全局池化后的80维输入到全连接层
        self.fc = nn.Linear(80, 3)  # 3个分类

    def forward(self, x):
        # 第一卷积层 + 池化层
        x = self.pool(torch.relu(self.conv1(x)))
        # 第二卷积层 + 池化层
        x = self.pool(torch.relu(self.conv2(x)))
        # 第三卷积层 + 池化层
        x = self.pool(torch.relu(self.conv3(x)))
        # 第四卷积层 + 池化层
        x = self.pool(torch.relu(self.conv4(x)))
        # 全局平均池化层
        x = self.pooling(x)  # 输出大小: [batch_size, 80, 1, 1]
        # 展平
        x = x.view(-1, 80)  # 展平为[batch_size, 80]
        # 全连接层
        x = self.fc(x)
        return x


def image_to_tensor(image_path, transform=None):
    # 读取图像（默认为BGR）
    image = cv2.imread(image_path)

    # 如果存在transform，则应用转换
    if transform:
        image = transform(image)

    # 1. 将BGR转为RGB（通过切片操作）
    image_rgb = image[:, :, ::-1]  # BGR -> RGB

    # 2. 将HWC布局转为CHW布局
    image_chw = image_rgb.transpose(2, 0, 1)  # HWC -> CHW

    # 3. 创建数组副本，避免负步幅
    image_chw = image_chw.copy()  # 使用copy()来避免负步幅问题

    # 4. 转换为Tensor类型
    #image_tensor = torch.from_numpy(image_chw).float()/ 255.0  # 转为Tensor并归一化
    image_tensor = torch.from_numpy(image_chw).float() # / 255.0  # 转为Tensor并归一化


    return image_tensor

# 定义自定义数据集
class CustomDataset(data.Dataset):
    def __init__(self, data_dir, transform=None):
        self.data_dir = data_dir  # 数据目录
        self.transform = transform  # 数据变换（如果有）
        self.image_paths = []  # 存储图像路径
        self.labels = []  # 存储标签
        self.label_map = {'0': 0, '1': 1, '2': 2}  # 标签与数字的映射

        # 遍历每个类别文件夹
        for label_folder in os.listdir(data_dir):
            label_folder_path = os.path.join(data_dir, label_folder)
            if os.path.isdir(label_folder_path):
                for image_name in os.listdir(label_folder_path):
                    if image_name.endswith('.jpg'):
                        image_path = os.path.join(label_folder_path, image_name)
                        self.image_paths.append(image_path)
                        self.labels.append(self.label_map[label_folder])  # 获取标签

    def __len__(self):
        return len(self.image_paths)  # 返回数据集的大小

    def __getitem__(self, idx):
        image_path = self.image_paths[idx]
        label = self.labels[idx]

        # 使用 OpenCV 读取图像
        image = image_to_tensor(image_path)
        # print(type(image))#<class 'numpy.ndarray'>
        # 如果有transform，应用转换
        # if self.transform:
        #     image = self.transform(image)
        # print(image.shape) #torch.Size([3, 300, 300])
        # print(type(image))#<class 'torch.Tensor'>
        # print((image).dtype)#torch.float32
        return image, label


# 定义数据转换（包括BGR到RGB的转换，不需要在外部进行归一化）
transform = transforms.Compose([
    # BGR2RGB(),  # 将BGR图像转换为RGB
    # transforms.ToTensor(),  # 转换为Tensor，像素值缩放到 [0, 1]

])

# 创建训练数据集
data_dir = 'resized_data'  # 数据所在文件夹路径
dataset = CustomDataset(data_dir=data_dir, transform=transform)

# 创建数据加载器
batch_size = 32  # 设置批处理大小
train_loader = DataLoader(dataset, batch_size=batch_size, shuffle=True)

# 创建模型实例
model = Net()

# 定义损失函数和优化器
criterion = nn.CrossEntropyLoss()  # 交叉熵损失函数
optimizer = optim.Adam(model.parameters(), lr=0.001)  # Adam优化器

# 训练模型（一个简单的训练循环示例）
num_epochs = 10  # 训练轮数

for epoch in range(num_epochs):
    model.train()  # 设定为训练模式
    running_loss = 0.0
    correct = 0
    total = 0

    for inputs, labels in train_loader:
        # 将输入数据移到GPU（如果有GPU）
        inputs, labels = inputs.to("cpu"), labels.to("cpu")

        # 清零梯度
        optimizer.zero_grad()

        # 前向传播
        outputs = model(inputs)
        loss = criterion(outputs, labels)  # 计算损失

        # 反向传播
        loss.backward()

        # 更新权重
        optimizer.step()

        # 统计损失和准确率
        running_loss += loss.item()
        _, predicted = torch.max(outputs, 1)
        total += labels.size(0)
        correct += (predicted == labels).sum().item()

    epoch_loss = running_loss / len(train_loader)
    epoch_accuracy = 100 * correct / total

    print(f'Epoch [{epoch + 1}/{num_epochs}], Loss: {epoch_loss:.4f}, Accuracy: {epoch_accuracy:.2f}%')

# 保存训练好的模型
torch.save(model, './Fruit.pt')
print("模型已保存！")
print("Model saved!")

```

2.Eport

```python
import torch.onnx
import os
import torch
from torch import nn, optim
from torch.utils.data import Dataset, DataLoader, Subset
from torchvision import transforms
from PIL import Image
import pandas as pd
import torch.nn.functional as F

class Net(nn.Module):
    def __init__(self):
        super(Net, self).__init__()
        # 第一卷积层：输入3通道，输出10通道，卷积核大小5
        self.conv1 = nn.Conv2d(3, 10, kernel_size=5, stride=1, padding=2)  # 保持尺寸
        # 最大池化层：2x2池化，减小空间尺寸
        self.pool = nn.MaxPool2d(kernel_size=2, stride=2)
        # 第二卷积层：输入10通道，输出20通道，卷积核大小5
        self.conv2 = nn.Conv2d(10, 20, kernel_size=5, stride=1, padding=2)  # 保持尺寸
        # 第三卷积层：输入20通道，输出40通道，卷积核大小3
        self.conv3 = nn.Conv2d(20, 40, kernel_size=3, stride=1, padding=1)  # 保持尺寸
        # 第四卷积层：输入40通道，输出80通道，卷积核大小3
        self.conv4 = nn.Conv2d(40, 80, kernel_size=3, stride=1, padding=1)  # 保持尺寸
        # 全局平均池化：将每个特征图压缩为一个值
        self.pooling = nn.AdaptiveAvgPool2d(1)  # 输出尺寸 1x1x80
        # 全连接层：将全局池化后的80维输入到全连接层
        self.fc = nn.Linear(80, 3)  # 3个分类

    def forward(self, x):
        # 第一卷积层 + 池化层
        x = self.pool(torch.relu(self.conv1(x)))
        # 第二卷积层 + 池化层
        x = self.pool(torch.relu(self.conv2(x)))
        # 第三卷积层 + 池化层
        x = self.pool(torch.relu(self.conv3(x)))
        # 第四卷积层 + 池化层
        x = self.pool(torch.relu(self.conv4(x)))
        # 全局平均池化层
        x = self.pooling(x)  # 输出大小: [batch_size, 80, 1, 1]
        # 展平
        x = x.view(-1, 80)  # 展平为[batch_size, 80]
        # 全连接层
        x = self.fc(x)
        return x

model = Net()
model = torch.load('./Fruit.pt')
device="cpu"
# 设置模型为推理模式
model.eval().to(device)

# 设置模型输入的尺寸
# b channel width heigh
dummy_input = torch.randn(1, 3,300,300).to(device)
with torch.no_grad():
    # 导出ONNX模型
    torch.onnx.export(model,  # model being run
                  dummy_input,  # model input (or a tuple for multiple inputs)
                  "Fruit.onnx",  # where to save the model
                  opset_version=11,  # the ONNX version to export the model to
                  input_names=['input'],  # the model's input names
                  output_names=['output'],  # the model's output names
                  )
print('Model has been converted to ONNX')

import  onnx
onnx_model=onnx.load("./Fruit.onnx")
onnx.checker.check_model(onnx_model)

```

3.infer onnx

```python
import cv2
import onnx
import onnxruntime as ort
import numpy as np
import os
from PIL import Image
from torchvision import transforms

# 加载 ONNX 模型
onnx_model_path = "./Fruit.onnx"
onnx_model = onnx.load(onnx_model_path)

# 设置推理会话，明确指定使用 CPU 提供者
session = ort.InferenceSession(onnx_model_path, providers=['CPUExecutionProvider'])

#
# def preprocess_image(image_path):
#     # 1. 使用 OpenCV 读取图像
#     image = cv2.imread(image_path)  # 默认是 BGR 格式
#     # 2. 将 BGR 转换为 RGB 格式
#     image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
#     # 3. 将 NumPy 数组转换为 PIL 图像
#     # 4. 转换为 [C, H, W] 格式
#     image = np.transpose(image, (2, 0, 1))
#     # 5. 添加一个维度以匹配模型输入的形状 (batch_size, channels, height, width)
#     image = image.reshape(1, *image.shape)  # 变为 [1, C, H, W]
#     # 6. 返回处理后的图像，转换为 float32 类型
#     return image.astype(np.float32)
def preprocess_image(image_path):
    # 1. 使用 OpenCV 读取图像
    image = cv2.imread(image_path)  # 默认是 BGR 格式

    # 2. 将 BGR 转换为 RGB 格式
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    # 3. 将图像从 HWC 布局转换为 CHW 布局
    image_chw = np.transpose(image, (2, 0, 1))  # HWC -> CHW

    # 4. 归一化处理，将像素值除以 255 使其在 [0, 1] 范围内
    #image_chw = image_chw.astype(np.float32) / 255.0
    image_chw = image_chw.astype(np.float32) 
    # 5. 增加一个维度，变为 [1, C, H, W] 形状，以符合模型输入要求
    image_chw = image_chw.reshape(1, *image_chw.shape)  # 变为 [1, C, H, W]

    return image_chw


def evaluate_model(image_folder):
    correct_predictions = 0
    total_images = 0

    # 获取文件夹内所有的图片文件
    for filename in os.listdir(image_folder):
        # 只处理以 0、1、2 开头的 jpg 文件
        if filename[0] in ['0', '1', '2'] and filename.lower().endswith('.jpg'):
            image_path = os.path.join(image_folder, filename)

            # 预处理输入图像
            input_data = preprocess_image(image_path)

            # 获取模型的输入和输出名称
            input_name = session.get_inputs()[0].name
            output_name = session.get_outputs()[0].name

            # 进行推理
            outputs = session.run([output_name], {input_name: input_data})

            # 获取预测类别（假设输出是一个 logits 向量）
            output_data = outputs[0]
            predicted_class = np.argmax(output_data, axis=1)[0]

            # 获取真实标签，假设文件名的第一个字符是真实标签
            true_label = int(filename[0])  # 从文件名中提取标签（例如：'0_image.jpg' 的标签是 0）

            # 输出预测结果
            print(f"文件名: {filename}, 真实标签: {true_label}, 预测标签: {predicted_class}")

            # 统计正确预测
            total_images += 1
            if predicted_class == true_label:
                correct_predictions += 1

    # 计算并输出准确率
    if total_images > 0:
        accuracy = correct_predictions / total_images
        print(f"正确率: {accuracy * 100:.2f}%")
    else:
        print("没有找到符合要求的图片文件。")


# 主程序入口
if __name__ == "__main__":
    image_folder = "./resized_data_back"  # 替换为你的图片文件夹路径
    evaluate_model(image_folder)

```

4.calibration

```python
import os
import cv2
import numpy as np

def print_image_info(img, step):
    """
    打印图像的颜色格式和形状信息
    :param img: 输入图像（numpy array）
    :param step: 当前步骤描述
    """
    if len(img.shape) == 2:  # 灰度图像 (H, W)
        print(f"Step: {step} - Gray, Shape: {img.shape}")
    elif len(img.shape) == 3:
        if img.shape[2] == 3:  # BGR 或 RGB 图像 (H, W, 3)
            print(f"Step: {step} - RGB/BGR, Shape: {img.shape}")
        elif img.shape[2] == 4:  # RGBA 图像
            print(f"Step: {step} - RGBA, Shape: {img.shape}")
        else:
            print(f"Step: {step} - Unknown 3D Image, Shape: {img.shape}")
    else:
        print(f"Step: {step} - Unknown format, Shape: {img.shape}")

src_root = r'/data/horizon_x5/data/src_dir/Fruit'
cal_img_num = 20  # 想要的图像个数
dst_root = './calibration_data_rgb_f32'


## 1. 从原始图像文件夹中获取20个图像作为校准数据
num_count = 0
img_names = []
for src_name in sorted(os.listdir(src_root)):
    if num_count > cal_img_num:
        break
    img_names.append(src_name)
    num_count += 1

# 检查目标文件夹是否存在，如果不存在就创建
if not os.path.exists(dst_root):
    os.system('mkdir {0}'.format(dst_root))

## 2.1 定义图像缩放函数，返回为np.float32
# 图像缩放为目标尺寸(W, H)
# 值得注意的是，缩放时候，长宽等比例缩放，空白的区域填充颜色为pad_value, 默认127
def imequalresize(img, target_size, pad_value=127.):
    target_w, target_h = target_size
    image_h, image_w = img.shape[:2]
    img_channel = 3 if len(img.shape) > 2 else 1

    # 确定缩放尺度，确定最终目尺寸
    scale = min(target_w * 1.0 / image_w, target_h * 1.0 / image_h)
    new_h, new_w = int(scale * image_h), int(scale * image_w)

    resize_image = cv2.resize(img, (new_w, new_h))

    # 如果是灰度图像，扩展为 (H, W, 1)
    if len(resize_image.shape) == 2:  # 灰度图像
        resize_image = resize_image[:, :, np.newaxis]  # 扩展为 (H, W, 1)

    # elif 避免重复如果是彩色图像（3通道），resize_image 应该是 (H, W, 3)
    elif len(resize_image.shape) == 3 and resize_image.shape[2] == 1:  # 单通道扩展为3通道
        resize_image = np.repeat(resize_image, 3, axis=2)

    # 准备待返回图像
    pad_image = np.full(shape=[target_h, target_w, img_channel], fill_value=pad_value)

    # 将图像resize_image放置在pad_image的中间
    dw, dh = (target_w - new_w) // 2, (target_h - new_h) // 2
    pad_image[dh:new_h + dh, dw:new_w + dw, :] = resize_image
    return pad_image

## 2.2 开始转换
for each_imgname in img_names:
    img_path = os.path.join(src_root, each_imgname)

    # Step 1: 读取图像
    img = cv2.imread(img_path, cv2.IMREAD_UNCHANGED)  # 默认读取为灰度图或BGR图像
    print_image_info(img, "Read Image")

    # Step 2: 判断图像模式，灰度图不需要RGB转换
    if len(img.shape) == 2:  # 如果是灰度图
        print_image_info(img, "Skip RGB conversion (Grayscale)")
    elif len(img.shape) == 3 and img.shape[2] == 3:  # 如果是BGR图像
        # 将BGR转换为RGB
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)  # 转换为 RGB
        print_image_info(img, "Convert to RGB")
    elif len(img.shape) == 3 and img.shape[2] == 4:  # 如果是RGBA图像
        # 去掉Alpha通道，只保留RGB
        img = img[:, :, :3]
        print_image_info(img, "Remove Alpha Channel (RGBA)")
    else:
        print("Unrecognized image format, skipping processing")
        continue

    # Step 3: 缩放图像
    #img = imequalresize(img, (300, 300))  # Resize to 28x28, padding if necessary
    #print_image_info(img, "Resize Image")

    # Step 4: 转换为 CHW 符合pytorch模型架构输入
    img = np.transpose(img, (2, 0, 1))  # Convert to CHW format (C, H, W)
    print_image_info(img, "Convert to CHW")

    # Step 5: 转换数据类型为 float32
    img = img.astype(np.float32)  # 保证数据为float32
    print_image_info(img, "Convert to float32")

    # 将图像保存到目标文件夹下
    dst_path = os.path.join(dst_root, each_imgname + '.rgbchw')
    print(f"write: {dst_path}")
    img.tofile(dst_path)  # 直接保存为二进制数据
print('Finish')
```

5.yaml

```yaml
# Copyright (c) 2020 Horizon Robotics.All Rights Reserved.
#
# The material in this file is confidential and contains trade secrets
# of Horizon Robotics Inc. This is proprietary information owned by
# Horizon Robotics Inc. No part of this work may be disclosed,
# reproduced, copied, transmitted, or used in any way for any purpose,
# without the express written permission of Horizon Robotics Inc.

# 模型转化相关的参数
# ------------------------------------
# model conversion related parameters
model_parameters:
  # ONNX浮点网络数据模型文件
  # -------------------------------------------------------------------------------------------------------------------
  # the model file of floating-point ONNX neural network data
  onnx_model: '/data/horizon_x5/data/Fruit.onnx'

  # 适用BPU架构
  # --------------------------------
  # the applicable BPU architecture
  march: "bayes-e"

  # 指定模型转换过程中是否输出各层的中间结果，如果为True，则输出所有层的中间输出结果，
  # ---------------------------------------------------------------------------------------
  # specifies whether or not to dump the intermediate results of all layers in conversion
  # if set to True, then the intermediate results of all layers shall be dumped
  layer_out_dump: False

  # 模型转换输出的结果的存放目录
  # ---------------------------------------------------------------------------------------
  # the directory in which model conversion results are stored
  working_dir: 'model_output'

  # 模型转换输出的用于上板执行的模型文件的名称前缀
  # -----------------------------------------------------------------------------------------
  # model conversion generated name prefix of those model files used for dev board execution
  output_model_file_prefix: 'Fruit'


# 模型输入相关参数, 若输入多个节点, 则应使用';'进行分隔, 使用默认缺省设置则写None
# -------------------------------------------------------------------------
# model input related parameters,
# please use ";" to seperate when inputting multiple nodes,
# please use None for default setting
input_parameters:

  # (选填) 模型输入的节点名称, 此名称应与模型文件中的名称一致, 否则会报错, 不填则会使用模型文件中的节点名称
  # -------------------------------------------------------------------------------------------------
  # (Optional) node name of model input,
  # it shall be the same as the name of model file, otherwise an error will be reported,
  # the node name of model file will be used when left blank
  input_name: ""

  # 网络实际执行时，输入给网络的数据格式，包括 nv12/rgb/bgr/yuv444/gray/featuremap,
  # ------------------------------------------------------------------------------------------
  # the data formats to be passed into neural network when actually performing neural network
  # available options: nv12/rgb/bgr/yuv444/gray/featuremap,

  input_type_rt: 'nv12'

  # 网络实际执行时输入的数据排布, 可选值为 NHWC/NCHW
  # 若input_type_rt配置为nv12，则此处参数不需要配置
  # ------------------------------------------------------------------
  # the data layout formats to be passed into neural network when actually performing neural network, available options: NHWC/NCHW
  # If input_type_rt is configured as nv12, then this parameter does not need to be configured
  # input_layout_rt: 'NCHW'

  # 网络训练时输入的数据格式，可选的值为rgb/bgr/gray/featuremap/yuv444
  # ---------------------------------------------------------------------
  # the data formats in network training
  # available options: rgb/bgr/gray/featuremap/yuv444
  input_type_train: 'rgb'

  # 网络训练时输入的数据排布, 可选值为 NHWC/NCHW
  # ---------------------------------------------------------------------
  # the data layout in network training, available options: NHWC/NCHW
  input_layout_train: 'NCHW'

  # (选填) 模型网络的输入大小, 以'x'分隔, 不填则会使用模型文件中的网络输入大小，否则会覆盖模型文件中输入大小
  # -------------------------------------------------------------------------------------------
  # (Optional)the input size of model network, seperated by 'x'
  # note that the network input size of model file will be used if left blank
  # otherwise it will overwrite the input size of model file
  input_shape: ''

  # 网络实际执行时，输入给网络的batch_size, 默认值为1
  # ---------------------------------------------------------------------
  # the data batch_size to be passed into neural network when actually performing neural network, default value: 1
  #input_batch: 1

  # 网络输入的预处理方法，主要有以下几种：
  # no_preprocess 不做任何操作
  # data_mean 减去通道均值mean_value
  # data_scale 对图像像素乘以data_scale系数
  # data_mean_and_scale 减去通道均值后再乘以scale系数
  # -------------------------------------------------------------------------------------------
  # preprocessing methods of network input, available options:
  # 'no_preprocess' indicates that no preprocess will be made
  # 'data_mean' indicates that to minus the channel mean, i.e. mean_value
  # 'data_scale' indicates that image pixels to multiply data_scale ratio
  # 'data_mean_and_scale' indicates that to multiply scale ratio after channel mean is minused
  norm_type: 'no_preprocess'

  # 图像减去的均值, 如果是通道均值，value之间必须用空格分隔
  # --------------------------------------------------------------------------
  # the mean value minused by image
  # note that values must be seperated by space if channel mean value is used
  #mean_value: 127 127 127

  # 图像预处理缩放比例，如果是通道缩放比例，value之间必须用空格分隔
  # ---------------------------------------------------------------------------
  # scale value of image preprocess
  # note that values must be seperated by space if channel scale value is used
  # scale_value: 0.0078125 0.0078125 0.0078125
  # scale_value: 255 255 255

# 模型量化相关参数
# -----------------------------
# model calibration parameters
calibration_parameters:

  # 模型量化的参考图像的存放目录，图片格式支持Jpeg、Bmp等格式，输入的图片
  # 应该是使用的典型场景，一般是从测试集中选择20~100张图片，另外输入
  # 的图片要覆盖典型场景，不要是偏僻场景，如过曝光、饱和、模糊、纯黑、纯白等图片
  # 若有多个输入节点, 则应使用';'进行分隔
  # -----------------------------------------------------------------------
  # the directory where reference images of model quantization are stored
  # image formats include JPEG, BMP etc.
  # should be classic application scenarios, usually 20~100 images are picked out from test datasets
  # in addition, note that input images should cover typical scenarios
  # and try to avoid those overexposed, oversaturated, vague,
  # pure blank or pure white images
  # use ';' to seperate when there are multiple input nodes
  cal_data_dir: './calibration_data_rgb_f32'

  # 校准数据二进制文件的数据存储类型，可选值为：float32, uint8
  # calibration data binary file save type, available options: float32, uint8
  cal_data_type: 'float32'

  # 如果输入的图片文件尺寸和模型训练的尺寸不一致时，并且preprocess_on为true，
  # 则将采用默认预处理方法(skimage resize)，
  # 将输入图片缩放或者裁减到指定尺寸，否则，需要用户提前把图片处理为训练时的尺寸
  # ----------------------------------------------------------------------------------
  # In case the size of input image file is different from that of in model training
  # and that preprocess_on is set to True,
  # shall the default preprocess method(skimage resize) be used
  # i.e., to resize or crop input image into specified size
  # otherwise user must keep image size as that of in training in advance
  # preprocess_on: False

  # 模型量化的算法类型，支持default、mix、kl、max、load，通常采用default即可满足要求
  # 如不符合预期可先尝试修改为mix 仍不符合预期再尝试kl或max
  # 当使用QAT导出模型时，此参数则应设置为load
  # 相关参数的技术原理及说明请您参考用户手册中的PTQ原理及步骤中参数组详细介绍部分
  # ----------------------------------------------------------------------------------
  # The algorithm type of model quantization, support default, mix, kl, max, load, usually use default can meet the requirements.
  # If it does not meet the expectation, you can try to change it to mix first. If there is still no expectation, try kl or max again.
  # When using QAT to export the model, this parameter should be set to load.
  # For more details of the parameters, please refer to the parameter details in PTQ Principle And Steps section of the user manual.
  calibration_type: 'default'

# 编译器相关参数
# ----------------------------
# compiler related parameters
compiler_parameters:

  # 编译策略，支持bandwidth和latency两种优化模式;
  # bandwidth以优化ddr的访问带宽为目标；
  # latency以优化推理时间为目标
  # ------------------------------------------------------------------------------------------
  # compilation strategy, there are 2 available optimization modes: 'bandwidth' and 'lantency'
  # the 'bandwidth' mode aims to optimize ddr access bandwidth
  # while the 'lantency' mode aims to optimize inference duration
  compile_mode: 'latency'

  # 设置debug为True将打开编译器的debug模式，能够输出性能仿真的相关信息，如帧率、DDR带宽占用等
  # ------------------------------------------------------------------------------------------
  # the compiler's debug mode will be enabled by setting to True
  # this will dump performance simulation related information
  # such as: frame rate, DDR bandwidth usage etc.
  debug: True

  # 编译模型指定核数，不指定默认编译单核模型, 若编译双核模型，将下边注释打开即可
  # -------------------------------------------------------------------------------------
  # specifies number of cores to be used in model compilation
  # as default, single core is used as this value left blank
  # please delete the "# " below to enable dual-core mode when compiling dual-core model
  # core_num: 2

  # 优化等级可选范围为O0~O3
  # O0不做任何优化, 编译速度最快，优化程度最低,
  # O1-O3随着优化等级提高，预期编译后的模型的执行速度会更快，但是所需编译时间也会变长。
  # 推荐用O2做最快验证
  # ---------------------------------------------------------------------------------------
  # optimization level ranges between O0~O3
  # O0 indicates that no optimization will be made
  # the faster the compilation, the lower optimization level will be
  # O1-O3: as optimization levels increase gradually, model execution, after compilation,
  # shall become faster while compilation will be prolonged
  # it is recommended to use O2 for fastest verification
  optimize_level: 'O3'
```

6.infer

```python
import cv2
import numpy as np
from hobot_dnn import pyeasy_dnn as dnn
import argparse
import os


def bgr2nv12_opencv(image):
    # 如果需要处理 RGB 图像，请先转换为 BGR
    if image.shape[2] == 3 and image.shape[2] == 'RGB':
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

    height, width = image.shape[0], image.shape[1]
    area = height * width
    yuv420p = cv2.cvtColor(image, cv2.COLOR_BGR2YUV_I420).reshape((area * 3 // 2,))
    y = yuv420p[:area]
    uv_planar = yuv420p[area:].reshape((2, area // 4))
    uv_packed = uv_planar.transpose((1, 0)).reshape((area // 2,))

    nv12 = np.zeros_like(yuv420p)
    nv12[:height * width] = y
    nv12[height * width:] = uv_packed
    return nv12


def print_properties(pro):
    print("tensor type:", pro.tensor_type)
    print("data type:", pro.dtype)
    print("layout:", pro.layout)
    print("shape:", pro.shape)


def parse_args():
    # 解析命令行参数
    parser = argparse.ArgumentParser(description="Image Inference with DNN model")
    parser.add_argument('--image_folder', type=str, required=True, help="Path to input image folder")
    return parser.parse_args()


def main():
    # 解析命令行参数
    args = parse_args()
    image_folder = args.image_folder

    # 加载模型
    binpath = "./FruitTrain255Yaml255.bin"
    models = dnn.load(binpath)

    # 打印输入 tensor 的属性
    print("输入类型")
    print_properties(models[0].inputs[0].properties)

    # 初始化正确预测计数和总数
    correct_predictions = 0
    total_images = 0

    # 遍历文件夹中的所有文件
    for filename in os.listdir(image_folder):
        # 只处理以 0、1、2 开头的文件
        if filename[0] in ['0', '1', '2'] and filename.lower().endswith(('.jpg', '.jpeg', '.png')):

            # 获取图像路径
            image_path = os.path.join(image_folder, filename)

            # 预处理输入图像
            img = cv2.imread(image_path, cv2.IMREAD_UNCHANGED)  # 默认读取为灰度图或BGR图像
            img = bgr2nv12_opencv(img)

            # 模型推理
            outputs = models[0].forward(img)

            # 获取模型输出的值，假设输出是形状为 (1, 1, 1, N) 的数组，N是类别数
            output_array = np.array(outputs[0].buffer)
            print(output_array)
            # 假设输出形状为 (1, 1, 1, N)，我们需要提取该数组的最大值
            predicted_label = np.argmax(output_array)

            # 获取真实标签，假设文件名的第一个字符是真实标签
            true_label = int(filename[0])  # 从文件名中提取标签
            print(f"文件名: {filename}, 真实标签: {true_label}, 预测标签: {predicted_label}")

            # 统计正确预测
            total_images += 1
            if predicted_label == true_label:
                correct_predictions += 1

    # 计算并输出正确率
    if total_images > 0:
        accuracy = correct_predictions / total_images
        print(f"正确率: {accuracy * 100:.2f}%")
    else:
        print("没有找到符合要求的图片文件。")


if __name__ == "__main__":
    main()

```

## 5.3 Demo-转Tensor除以255：

修改处使用了`修改处`标志

1.Train

```python
import os
import cv2
import torch
import torch.nn as nn
import torch.optim as optim
import torch.utils.data as data
import numpy as np
from torchvision import transforms
from torch.utils.data import Dataset, DataLoader
import torch.nn.functional as F
from PIL import Image


# 自定义BGR转RGB的转换类
class BGR2RGB(object):
    def __call__(self, img):
        return cv2.cvtColor(img, cv2.COLOR_BGR2RGB)



class Net(nn.Module):
    def __init__(self):
        super(Net, self).__init__()
        # 第一卷积层：输入3通道，输出10通道，卷积核大小5
        self.conv1 = nn.Conv2d(3, 10, kernel_size=5, stride=1, padding=2)  # 保持尺寸
        # 最大池化层：2x2池化，减小空间尺寸
        self.pool = nn.MaxPool2d(kernel_size=2, stride=2)
        # 第二卷积层：输入10通道，输出20通道，卷积核大小5
        self.conv2 = nn.Conv2d(10, 20, kernel_size=5, stride=1, padding=2)  # 保持尺寸
        # 第三卷积层：输入20通道，输出40通道，卷积核大小3
        self.conv3 = nn.Conv2d(20, 40, kernel_size=3, stride=1, padding=1)  # 保持尺寸
        # 第四卷积层：输入40通道，输出80通道，卷积核大小3
        self.conv4 = nn.Conv2d(40, 80, kernel_size=3, stride=1, padding=1)  # 保持尺寸
        # 全局平均池化：将每个特征图压缩为一个值
        self.pooling = nn.AdaptiveAvgPool2d(1)  # 输出尺寸 1x1x80
        # 全连接层：将全局池化后的80维输入到全连接层
        self.fc = nn.Linear(80, 3)  # 3个分类

    def forward(self, x):
        # 第一卷积层 + 池化层
        x = self.pool(torch.relu(self.conv1(x)))
        # 第二卷积层 + 池化层
        x = self.pool(torch.relu(self.conv2(x)))
        # 第三卷积层 + 池化层
        x = self.pool(torch.relu(self.conv3(x)))
        # 第四卷积层 + 池化层
        x = self.pool(torch.relu(self.conv4(x)))
        # 全局平均池化层
        x = self.pooling(x)  # 输出大小: [batch_size, 80, 1, 1]
        # 展平
        x = x.view(-1, 80)  # 展平为[batch_size, 80]
        # 全连接层
        x = self.fc(x)
        return x


def image_to_tensor(image_path, transform=None):
    # 读取图像（默认为BGR）
    image = cv2.imread(image_path)

    # 如果存在transform，则应用转换
    if transform:
        image = transform(image)

    # 1. 将BGR转为RGB（通过切片操作）
    image_rgb = image[:, :, ::-1]  # BGR -> RGB

    # 2. 将HWC布局转为CHW布局
    image_chw = image_rgb.transpose(2, 0, 1)  # HWC -> CHW

    # 3. 创建数组副本，避免负步幅
    image_chw = image_chw.copy()  # 使用copy()来避免负步幅问题

    # 4. 转换为Tensor类型
    #image_tensor = torch.from_numpy(image_chw).float() # / 255.0  # 转为Tensor并归一化 
    '''
    修改处
    '''
    image_tensor = torch.from_numpy(image_chw).float()/ 255.0  # 转为Tensor并归一化



    return image_tensor

# 定义自定义数据集
class CustomDataset(data.Dataset):
    def __init__(self, data_dir, transform=None):
        self.data_dir = data_dir  # 数据目录
        self.transform = transform  # 数据变换（如果有）
        self.image_paths = []  # 存储图像路径
        self.labels = []  # 存储标签
        self.label_map = {'0': 0, '1': 1, '2': 2}  # 标签与数字的映射

        # 遍历每个类别文件夹
        for label_folder in os.listdir(data_dir):
            label_folder_path = os.path.join(data_dir, label_folder)
            if os.path.isdir(label_folder_path):
                for image_name in os.listdir(label_folder_path):
                    if image_name.endswith('.jpg'):
                        image_path = os.path.join(label_folder_path, image_name)
                        self.image_paths.append(image_path)
                        self.labels.append(self.label_map[label_folder])  # 获取标签

    def __len__(self):
        return len(self.image_paths)  # 返回数据集的大小

    def __getitem__(self, idx):
        image_path = self.image_paths[idx]
        label = self.labels[idx]

        # 使用 OpenCV 读取图像
        image = image_to_tensor(image_path)
        # print(type(image))#<class 'numpy.ndarray'>
        # 如果有transform，应用转换
        # if self.transform:
        #     image = self.transform(image)
        # print(image.shape) #torch.Size([3, 300, 300])
        # print(type(image))#<class 'torch.Tensor'>
        # print((image).dtype)#torch.float32
        return image, label


# 定义数据转换（包括BGR到RGB的转换，不需要在外部进行归一化）
transform = transforms.Compose([
    # BGR2RGB(),  # 将BGR图像转换为RGB
    # transforms.ToTensor(),  # 转换为Tensor，像素值缩放到 [0, 1]

])

# 创建训练数据集
data_dir = 'resized_data'  # 数据所在文件夹路径
dataset = CustomDataset(data_dir=data_dir, transform=transform)

# 创建数据加载器
batch_size = 32  # 设置批处理大小
train_loader = DataLoader(dataset, batch_size=batch_size, shuffle=True)

# 创建模型实例
model = Net()

# 定义损失函数和优化器
criterion = nn.CrossEntropyLoss()  # 交叉熵损失函数
optimizer = optim.Adam(model.parameters(), lr=0.001)  # Adam优化器

# 训练模型（一个简单的训练循环示例）
num_epochs = 10  # 训练轮数

for epoch in range(num_epochs):
    model.train()  # 设定为训练模式
    running_loss = 0.0
    correct = 0
    total = 0

    for inputs, labels in train_loader:
        # 将输入数据移到GPU（如果有GPU）
        inputs, labels = inputs.to("cpu"), labels.to("cpu")

        # 清零梯度
        optimizer.zero_grad()

        # 前向传播
        outputs = model(inputs)
        loss = criterion(outputs, labels)  # 计算损失

        # 反向传播
        loss.backward()

        # 更新权重
        optimizer.step()

        # 统计损失和准确率
        running_loss += loss.item()
        _, predicted = torch.max(outputs, 1)
        total += labels.size(0)
        correct += (predicted == labels).sum().item()

    epoch_loss = running_loss / len(train_loader)
    epoch_accuracy = 100 * correct / total

    print(f'Epoch [{epoch + 1}/{num_epochs}], Loss: {epoch_loss:.4f}, Accuracy: {epoch_accuracy:.2f}%')

# 保存训练好的模型
torch.save(model, './Fruit.pt')
print("模型已保存！")
print("Model saved!")

```

2.Eport

```python
同上一种
```

3.infer onnx

```python
import cv2
import onnx
import onnxruntime as ort
import numpy as np
import os
from PIL import Image
from torchvision import transforms

# 加载 ONNX 模型
onnx_model_path = "./Fruit.onnx"
onnx_model = onnx.load(onnx_model_path)

# 设置推理会话，明确指定使用 CPU 提供者
session = ort.InferenceSession(onnx_model_path, providers=['CPUExecutionProvider'])

#
# def preprocess_image(image_path):
#     # 1. 使用 OpenCV 读取图像
#     image = cv2.imread(image_path)  # 默认是 BGR 格式
#     # 2. 将 BGR 转换为 RGB 格式
#     image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
#     # 3. 将 NumPy 数组转换为 PIL 图像
#     # 4. 转换为 [C, H, W] 格式
#     image = np.transpose(image, (2, 0, 1))
#     # 5. 添加一个维度以匹配模型输入的形状 (batch_size, channels, height, width)
#     image = image.reshape(1, *image.shape)  # 变为 [1, C, H, W]
#     # 6. 返回处理后的图像，转换为 float32 类型
#     return image.astype(np.float32)
def preprocess_image(image_path):
    # 1. 使用 OpenCV 读取图像
    image = cv2.imread(image_path)  # 默认是 BGR 格式

    # 2. 将 BGR 转换为 RGB 格式
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    # 3. 将图像从 HWC 布局转换为 CHW 布局
    image_chw = np.transpose(image, (2, 0, 1))  # HWC -> CHW

    # 4. 归一化处理，将像素值除以 255 使其在 [0, 1] 范围内
    '''
    修改处
    '''
    image_chw = image_chw.astype(np.float32) / 255.0
    #image_chw = image_chw.astype(np.float32) 
    # 5. 增加一个维度，变为 [1, C, H, W] 形状，以符合模型输入要求
    image_chw = image_chw.reshape(1, *image_chw.shape)  # 变为 [1, C, H, W]

    return image_chw


def evaluate_model(image_folder):
    correct_predictions = 0
    total_images = 0

    # 获取文件夹内所有的图片文件
    for filename in os.listdir(image_folder):
        # 只处理以 0、1、2 开头的 jpg 文件
        if filename[0] in ['0', '1', '2'] and filename.lower().endswith('.jpg'):
            image_path = os.path.join(image_folder, filename)

            # 预处理输入图像
            input_data = preprocess_image(image_path)

            # 获取模型的输入和输出名称
            input_name = session.get_inputs()[0].name
            output_name = session.get_outputs()[0].name

            # 进行推理
            outputs = session.run([output_name], {input_name: input_data})

            # 获取预测类别（假设输出是一个 logits 向量）
            output_data = outputs[0]
            predicted_class = np.argmax(output_data, axis=1)[0]

            # 获取真实标签，假设文件名的第一个字符是真实标签
            true_label = int(filename[0])  # 从文件名中提取标签（例如：'0_image.jpg' 的标签是 0）

            # 输出预测结果
            print(f"文件名: {filename}, 真实标签: {true_label}, 预测标签: {predicted_class}")

            # 统计正确预测
            total_images += 1
            if predicted_class == true_label:
                correct_predictions += 1

    # 计算并输出准确率
    if total_images > 0:
        accuracy = correct_predictions / total_images
        print(f"正确率: {accuracy * 100:.2f}%")
    else:
        print("没有找到符合要求的图片文件。")


# 主程序入口
if __name__ == "__main__":
    image_folder = "./resized_data_back"  # 替换为你的图片文件夹路径
    evaluate_model(image_folder)

```

4.calibration

```python
同上一种
```

5.yaml

```yaml
# Copyright (c) 2020 Horizon Robotics.All Rights Reserved.
#
# The material in this file is confidential and contains trade secrets
# of Horizon Robotics Inc. This is proprietary information owned by
# Horizon Robotics Inc. No part of this work may be disclosed,
# reproduced, copied, transmitted, or used in any way for any purpose,
# without the express written permission of Horizon Robotics Inc.

# 模型转化相关的参数
# ------------------------------------
# model conversion related parameters
model_parameters:
  # ONNX浮点网络数据模型文件
  # -------------------------------------------------------------------------------------------------------------------
  # the model file of floating-point ONNX neural network data
  onnx_model: '/data/horizon_x5/data/Fruit.onnx'

  # 适用BPU架构
  # --------------------------------
  # the applicable BPU architecture
  march: "bayes-e"

  # 指定模型转换过程中是否输出各层的中间结果，如果为True，则输出所有层的中间输出结果，
  # ---------------------------------------------------------------------------------------
  # specifies whether or not to dump the intermediate results of all layers in conversion
  # if set to True, then the intermediate results of all layers shall be dumped
  layer_out_dump: False

  # 模型转换输出的结果的存放目录
  # ---------------------------------------------------------------------------------------
  # the directory in which model conversion results are stored
  working_dir: 'model_output'

  # 模型转换输出的用于上板执行的模型文件的名称前缀
  # -----------------------------------------------------------------------------------------
  # model conversion generated name prefix of those model files used for dev board execution
  output_model_file_prefix: 'Fruit'


# 模型输入相关参数, 若输入多个节点, 则应使用';'进行分隔, 使用默认缺省设置则写None
# -------------------------------------------------------------------------
# model input related parameters,
# please use ";" to seperate when inputting multiple nodes,
# please use None for default setting
input_parameters:

  # (选填) 模型输入的节点名称, 此名称应与模型文件中的名称一致, 否则会报错, 不填则会使用模型文件中的节点名称
  # -------------------------------------------------------------------------------------------------
  # (Optional) node name of model input,
  # it shall be the same as the name of model file, otherwise an error will be reported,
  # the node name of model file will be used when left blank
  input_name: ""

  # 网络实际执行时，输入给网络的数据格式，包括 nv12/rgb/bgr/yuv444/gray/featuremap,
  # ------------------------------------------------------------------------------------------
  # the data formats to be passed into neural network when actually performing neural network
  # available options: nv12/rgb/bgr/yuv444/gray/featuremap,

  input_type_rt: 'nv12'

  # 网络实际执行时输入的数据排布, 可选值为 NHWC/NCHW
  # 若input_type_rt配置为nv12，则此处参数不需要配置
  # ------------------------------------------------------------------
  # the data layout formats to be passed into neural network when actually performing neural network, available options: NHWC/NCHW
  # If input_type_rt is configured as nv12, then this parameter does not need to be configured
  # input_layout_rt: 'NCHW'

  # 网络训练时输入的数据格式，可选的值为rgb/bgr/gray/featuremap/yuv444
  # ---------------------------------------------------------------------
  # the data formats in network training
  # available options: rgb/bgr/gray/featuremap/yuv444
  input_type_train: 'rgb'

  # 网络训练时输入的数据排布, 可选值为 NHWC/NCHW
  # ---------------------------------------------------------------------
  # the data layout in network training, available options: NHWC/NCHW
  input_layout_train: 'NCHW'

  # (选填) 模型网络的输入大小, 以'x'分隔, 不填则会使用模型文件中的网络输入大小，否则会覆盖模型文件中输入大小
  # -------------------------------------------------------------------------------------------
  # (Optional)the input size of model network, seperated by 'x'
  # note that the network input size of model file will be used if left blank
  # otherwise it will overwrite the input size of model file
  input_shape: ''

  # 网络实际执行时，输入给网络的batch_size, 默认值为1
  # ---------------------------------------------------------------------
  # the data batch_size to be passed into neural network when actually performing neural network, default value: 1
  #input_batch: 1

  # 网络输入的预处理方法，主要有以下几种：
  # no_preprocess 不做任何操作
  # data_mean 减去通道均值mean_value
  # data_scale 对图像像素乘以data_scale系数
  # data_mean_and_scale 减去通道均值后再乘以scale系数
  # -------------------------------------------------------------------------------------------
  # preprocessing methods of network input, available options:
  # 'no_preprocess' indicates that no preprocess will be made
  # 'data_mean' indicates that to minus the channel mean, i.e. mean_value
  # 'data_scale' indicates that image pixels to multiply data_scale ratio
  # 'data_mean_and_scale' indicates that to multiply scale ratio after channel mean is minused
  norm_type: 'data_scale'

  # 图像减去的均值, 如果是通道均值，value之间必须用空格分隔
  # --------------------------------------------------------------------------
  # the mean value minused by image
  # note that values must be seperated by space if channel mean value is used
  #mean_value: 127 127 127

  # 图像预处理缩放比例，如果是通道缩放比例，value之间必须用空格分隔
  # ---------------------------------------------------------------------------
  # scale value of image preprocess
  # note that values must be seperated by space if channel scale value is used
  # scale_value: 0.0078125 0.0078125 0.0078125
  scale_value: 255 255 255

# 模型量化相关参数
# -----------------------------
# model calibration parameters
calibration_parameters:

  # 模型量化的参考图像的存放目录，图片格式支持Jpeg、Bmp等格式，输入的图片
  # 应该是使用的典型场景，一般是从测试集中选择20~100张图片，另外输入
  # 的图片要覆盖典型场景，不要是偏僻场景，如过曝光、饱和、模糊、纯黑、纯白等图片
  # 若有多个输入节点, 则应使用';'进行分隔
  # -----------------------------------------------------------------------
  # the directory where reference images of model quantization are stored
  # image formats include JPEG, BMP etc.
  # should be classic application scenarios, usually 20~100 images are picked out from test datasets
  # in addition, note that input images should cover typical scenarios
  # and try to avoid those overexposed, oversaturated, vague,
  # pure blank or pure white images
  # use ';' to seperate when there are multiple input nodes
  cal_data_dir: './calibration_data_rgb_f32'

  # 校准数据二进制文件的数据存储类型，可选值为：float32, uint8
  # calibration data binary file save type, available options: float32, uint8
  cal_data_type: 'float32'

  # 如果输入的图片文件尺寸和模型训练的尺寸不一致时，并且preprocess_on为true，
  # 则将采用默认预处理方法(skimage resize)，
  # 将输入图片缩放或者裁减到指定尺寸，否则，需要用户提前把图片处理为训练时的尺寸
  # ----------------------------------------------------------------------------------
  # In case the size of input image file is different from that of in model training
  # and that preprocess_on is set to True,
  # shall the default preprocess method(skimage resize) be used
  # i.e., to resize or crop input image into specified size
  # otherwise user must keep image size as that of in training in advance
  # preprocess_on: False

  # 模型量化的算法类型，支持default、mix、kl、max、load，通常采用default即可满足要求
  # 如不符合预期可先尝试修改为mix 仍不符合预期再尝试kl或max
  # 当使用QAT导出模型时，此参数则应设置为load
  # 相关参数的技术原理及说明请您参考用户手册中的PTQ原理及步骤中参数组详细介绍部分
  # ----------------------------------------------------------------------------------
  # The algorithm type of model quantization, support default, mix, kl, max, load, usually use default can meet the requirements.
  # If it does not meet the expectation, you can try to change it to mix first. If there is still no expectation, try kl or max again.
  # When using QAT to export the model, this parameter should be set to load.
  # For more details of the parameters, please refer to the parameter details in PTQ Principle And Steps section of the user manual.
  calibration_type: 'default'

# 编译器相关参数
# ----------------------------
# compiler related parameters
compiler_parameters:

  # 编译策略，支持bandwidth和latency两种优化模式;
  # bandwidth以优化ddr的访问带宽为目标；
  # latency以优化推理时间为目标
  # ------------------------------------------------------------------------------------------
  # compilation strategy, there are 2 available optimization modes: 'bandwidth' and 'lantency'
  # the 'bandwidth' mode aims to optimize ddr access bandwidth
  # while the 'lantency' mode aims to optimize inference duration
  compile_mode: 'latency'

  # 设置debug为True将打开编译器的debug模式，能够输出性能仿真的相关信息，如帧率、DDR带宽占用等
  # ------------------------------------------------------------------------------------------
  # the compiler's debug mode will be enabled by setting to True
  # this will dump performance simulation related information
  # such as: frame rate, DDR bandwidth usage etc.
  debug: True

  # 编译模型指定核数，不指定默认编译单核模型, 若编译双核模型，将下边注释打开即可
  # -------------------------------------------------------------------------------------
  # specifies number of cores to be used in model compilation
  # as default, single core is used as this value left blank
  # please delete the "# " below to enable dual-core mode when compiling dual-core model
  # core_num: 2

  # 优化等级可选范围为O0~O3
  # O0不做任何优化, 编译速度最快，优化程度最低,
  # O1-O3随着优化等级提高，预期编译后的模型的执行速度会更快，但是所需编译时间也会变长。
  # 推荐用O2做最快验证
  # ---------------------------------------------------------------------------------------
  # optimization level ranges between O0~O3
  # O0 indicates that no optimization will be made
  # the faster the compilation, the lower optimization level will be
  # O1-O3: as optimization levels increase gradually, model execution, after compilation,
  # shall become faster while compilation will be prolonged
  # it is recommended to use O2 for fastest verification
  optimize_level: 'O3'
```

6.infer

```python
同上一种
```



# 6.总结

以上结果不一定具有可行性因为debug了好久，大致入门体验流程是这样的，期待有缘人创造一个，傻瓜式可以转自己随意搭建的模型平台，有点像华为那个import啥来着，我也忘了，听说好像加一句就可以适配，当然我也是听说哈哈，总之昇腾太贵了，不买，买X5

