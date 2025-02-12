// src/assets/menus.js

export const labInfoMenu = {
    name: "环境配置与软件安装",
    icon: "help",
    frontpath: "/lab-info",
    child: [
      {
        name: "docker Destop安装",
        icon: "home-filled",
        frontpath: "/menu/onezerothree/information",
        // child: [
        //   {
        //     name: "实验室介绍",
        //     icon: "home-filled",
        //     frontpath: "/menu/onezerothree/information",
        //   },
        //   {
        //     name: "课表信息",
        //     icon: "calendar",
        //     frontpath: "/menu/onezerothree/schedule",
        //   },
        // ],
      },
      {
        name: "WSL 安装",
        icon: "home-filled",
        frontpath: "/menu/onezerotwo/information",
        child: [
          {
            name: "实验室介绍",
            icon: "home-filled",
            frontpath: "/menu/onezerotwo/information",
          },
          {
            name: "课表信息",
            icon: "calendar",
            frontpath: "/menu/onezerotwo/schedule",
          },
        ],
      },
      {
        name: "104",
        icon: "home-filled",
        frontpath: "/menu/onezerofour",
        child: [
          {
            name: "实验室介绍",
            icon: "home-filled",
            frontpath: "/menu/onezerofour/information",
          },
          {
            name: "课表信息",
            icon: "calendar",
            frontpath: "/menu/onezerofour/schedule",
          },
        ],
      },
    ],
  };
  
  export const infoManagementMenu = {
    name: "ONNX模型准备",
    icon: "shopping-bag",
    frontpath: "/teacher-service",
    child: [
      {
        name: "预定实验室管理",
        icon: "Edit",
        frontpath: "/teacher/applylab",
      },
      {
        name: "实验室事务反馈",
        icon: "message",
        frontpath: "/teacher/labfeedback",
      },
      {
        name: "实验室设备预约操作",
        icon: "message",
        frontpath: "/common/EquipmentBorrow",
      },
    ],
  };
  
  export const adminManagementMenu = {
    name: "模型转化bin",
    icon: "setting",
    frontpath: "/admin-management",
    child: [
      {
        name: "用户管理",
        icon: "user",
        frontpath: "/admin/usermanagement",
      },
      {
        name: "实验室事务处理",
        icon: "message-box",
        frontpath: "/admin/labaffairs",
      },
      {
        name: "实验室数据统计",
        icon: "Stopwatch",
        frontpath: "/admin/labstats",
      },
      {
        name: "实验室公告发布",
        icon: "Stopwatch",
        frontpath: "/admin/gonggao",
      },
      {
        name: "实验室设备管理",
        icon: "message",
        frontpath: "/teacher/quipment",
      },
    ],
  };
  