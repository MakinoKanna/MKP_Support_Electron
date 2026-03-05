# MKP Support Electron

A modern desktop application for [MKP Support](https://github.com/YZcat2023/MKPSupport), built with Electron, featuring dual-mode operation (CLI + GUI).

## 声明与致敬 (Credits & Acknowledgement)

本项目是基于 [YZcat2023/MKPSupport](https://github.com/YZcat2023/MKPSupport) 开发的第三方可视化桌面应用版本。

原版 MKP Support 是一款优秀的 3D 打印辅助工具，其核心定位为：**"用于后处理 FDM 支撑结构，以提升打印质量并减少材料使用 (An application for post-processing FDM support structures to improve print quality and reduce material usage.)"**。

本项目的核心参数理念、数据结构与处理思路均完全源自原作者。本项目采用 Electron 技术栈，将 Web 界面封装为桌面应用，旨在为用户提供更加便捷的使用体验。感谢原作者为 3D 打印开源社区做出的杰出贡献。

## 项目特性 (Features)

* **双重人格架构**: 支持 CLI 静默处理模式和 GUI 图形界面模式，满足不同场景的需求。
* **桌面应用**: 基于 Electron 构建的跨平台桌面应用，无需浏览器即可运行。
* **现代化界面**: 采用响应式设计，支持暗色模式，提供流畅的用户体验。
* **智能机型管理**: 支持品牌分类、机型收藏、智能搜索和排序。
* **主题系统**: 完整的暗色模式支持，可跟随系统主题自动切换。
* **配置管理**: 使用 JSON 和 TOML 格式统一管理机型库和预设路径。
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
cd ui_app
npm install

```

### 4. 运行应用

#### GUI 模式
```bash
# 开发模式运行
npm start

# 构建应用
npm run build

```
构建完成后，可在 `dist` 目录中找到可执行文件。

#### CLI 模式
```bash
# 处理 Gcode 文件
electron . --Gcode <gcode文件路径> <toml配置文件路径>

```
CLI 模式会静默处理 Gcode 文件，完成后显示系统通知并自动退出。

## 项目结构

```
MKP_Support_Electron/
├── ui_app/                 # Electron 核心工程
│   ├── src/
│   │   ├── main/           # 主进程
│   │   │   ├── main.js     # Electron 入口与 CLI 拦截器
│   │   │   └── mkp_engine.js # Gcode 处理引擎
│   │   └── renderer/       # 渲染进程
│   │       ├── index.html  # 主页面
│   │       └── assets/     # 静态资源
│   │           ├── css/     # 样式文件
│   │           ├── js/      # JavaScript 文件
│   │           └── images/  # 图片资源
│   ├── package.json         # npm 配置文件
│   └── preload.js           # 预加载脚本
├── reference_python/        # Python 源码存档
├── cloud_presets/           # 云端 OTA 预设库
├── .gitignore
└── README.md
```

## 技术栈

- **桌面框架**: Electron
- **前端**: Vanilla JavaScript + Tailwind CSS
- **后端**: Node.js (CLI 模式)
- **配置格式**: JSON, TOML
- **构建工具**: electron-packager

## 作者

MakinoKanna

## 许可证

MIT License