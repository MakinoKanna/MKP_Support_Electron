# MKP Support Electron

A modern desktop application for [MKP Support](https://github.com/YZcat2023/MKPSupport), built with Electron.

## 声明与致敬 (Credits & Acknowledgement)

本项目是基于 [YZcat2023/MKPSupport](https://github.com/YZcat2023/MKPSupport) 开发的第三方可视化桌面应用版本。

原版 MKP Support 是一款优秀的 3D 打印辅助工具，其核心定位为：**"用于后处理 FDM 支撑结构，以提升打印质量并减少材料使用 (An application for post-processing FDM support structures to improve print quality and reduce material usage.)"**。

本项目的核心参数理念、数据结构与处理思路均完全源自原作者。本项目采用 Electron 技术栈，将 Web 界面封装为桌面应用，旨在为用户提供更加便捷的使用体验。感谢原作者为 3D 打印开源社区做出的杰出贡献。

## 项目特性 (Features)

* **桌面应用**: 基于 Electron 构建的跨平台桌面应用，无需浏览器即可运行。
* **现代化界面**: 采用响应式设计，支持暗色模式，提供流畅的用户体验。
* **智能机型管理**: 支持品牌分类、机型收藏、智能搜索和排序。
* **主题系统**: 完整的暗色模式支持，可跟随系统主题自动切换。
* **配置管理**: 使用 JSON 格式统一管理机型库和预设路径。
* **构建优化**: 优化构建大小，减少不必要的依赖和文件。

## 快速开始 (Quick Start)

### 1. 环境准备
确保您的计算机已安装 Node.js 14 或更高版本。

### 2. 克隆项目
```bash
git clone https://github.com/MakinoKanna/MKP_Support_Electron.git
cd MKP_Support_Electron

```

### 3. 安装依赖

```bash
# 安装 npm 依赖
npm install

```

### 4. 运行应用

```bash
# 开发模式运行
npm start

# 构建应用
npm run build

```

构建完成后，可在 `dist-electron` 目录中找到可执行文件。

## 项目结构

```
MKP_Support_Electron/
├── main.js              # Electron 主进程
├── preload.js           # Electron 预加载脚本
├── package.json         # npm 配置文件
├── renderer/            # 渲染进程文件
│   ├── index.html       # 主页面
│   └── assets/          # 静态资源
│       ├── css/         # 样式文件
│       ├── js/          # JavaScript 文件
│       └── images/      # 图片资源
└── _backup/             # 备份文件
```

## 技术栈

- **桌面框架**: Electron
- **前端**: Vanilla JavaScript + Tailwind CSS
- **构建工具**: electron-packager

## 作者

MakinoKanna

## 许可证

MIT License