# MKP Support 项目规则

## Git 配置

### 用户信息
- **用户名**: MakinoKanna
- **邮箱**: 使用 GitHub 邮箱或 user@example.com

在执行 Git 操作前，请确保配置正确的用户信息：
```bash
git config user.name "MakinoKanna"
git config user.email "user@example.com"
```

### 代理配置
本项目需要代理才能连接 GitHub，代理端口为 **7890**：
```bash
git config --global http.proxy http://127.0.0.1:7890
git config --global https.proxy http://127.0.0.1:7890
```

## 项目结构

```
MKP_Support/
├── main.py              # FastAPI 后端入口
├── templates/
│   └── index.html       # 主页面模板
├── static/
│   ├── icons/           # 图标资源
│   └── images/          # 图片资源（机型图片等）
└── .trae/
    └── rules/
        └── project_rules.md  # 本规则文件
```

## 技术栈

- **后端**: FastAPI + Uvicorn
- **前端**: Vanilla JavaScript + Tailwind CSS
- **模板引擎**: Jinja2

## 启动项目

```bash
# 安装依赖
pip install fastapi uvicorn jinja2

# 启动服务器
python main.py

# 访问地址
http://127.0.0.1:8000
```

## 代码规范

- 代码注释使用中文
- 变量和函数命名使用英文
- 遵循现有的代码风格和命名约定
