// src/assets/menus.js

export const labInfoMenu = {
    name: "环境配置与软件安装",
    icon: "help",
    frontpath: "/lab-info",
    child: [
      
      {
        name: "WSL 安装",
        icon: "home-filled",
        frontpath: "/menu/oneone/information",
      },{
        name: "docker Destop安装",
        icon: "home-filled",
        frontpath: "/menu/onetwo/information",
      },
      
    ],
  };
  
  export const infoManagementMenu = {
    name: "导出ONNX最后写",
    icon: "shopping-bag",
    frontpath: "/teacher-service",
    child: [
      {
        name: "Train",
        icon: "Edit",
        frontpath: "/menu/twoone",
      },
      {
        name: "Export",
        icon: "message",
        frontpath: "/menu/twotwo",
      },
      {
        name: "Infer on PC",
        icon: "message",
        frontpath: "/menu/twothree",
      },
    ],
  };
  
  export const adminManagementMenu = {
    name: "模型转化bin(这个写了)",
    icon: "setting",
    frontpath: "/admin-management",
    child: [
      {
        name: "工具链快速测试",
        icon: "user",
        frontpath: "/menu/threeone",
      },
      {
        name: "模型验证",
        icon: "message-box",
        frontpath: "/menu/threetwo",
      },
      {
        name: "数据校准",
        icon: "Stopwatch",
        frontpath: "/menu/threethree",
      },
      {
        name: "模型转化",
        icon: "Stopwatch",
        frontpath: "/menu/threefour",
      }
    ],
  };
  