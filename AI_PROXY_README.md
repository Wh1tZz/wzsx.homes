# AI代理服务器配置说明

## 概述
本项目使用后端代理服务器来安全地调用Gemini AI API，确保API密钥不会暴露在前端代码中。

## 配置步骤

### 1. 安装后端依赖
```bash
cd server
npm install
```

### 2. 配置Gemini API密钥
编辑 `server/.env` 文件，将你的Gemini API密钥填入：
```env
# Gemini API Key - 请替换为你的实际API密钥
GEMINI_API_KEY=your_gemini_api_key_here

# 服务器端口
PORT=3001
```

### 3. 安装主项目依赖（如果还没有安装）
```bash
npm install
```

## 启动方式

### 方式一：同时启动前后端（推荐）
```bash
npm run dev:full
```
这会同时启动：
- 前端开发服务器（http://localhost:3000）
- 后端代理服务器（http://localhost:3001）

### 方式二：分别启动
```bash
# 启动前端
npm run dev

# 在另一个终端启动后端
cd server && npm run dev
```

## 项目结构
```
├── server/                 # 后端代理服务器
│   ├── index.js           # Express服务器主文件
│   ├── package.json       # 后端依赖
│   ├── .env              # 环境变量（包含API密钥）
│   └── .gitignore        # 忽略敏感文件
├── src/components/
│   └── ChatWindow.tsx     # 前端AI聊天组件
└── package.json           # 前端项目配置
```

## 安全说明
- API密钥存储在后端的 `.env` 文件中，不会暴露给前端
- `.env` 文件已在 `.gitignore` 中忽略，不会被提交到代码仓库
- 前端通过本地代理API调用AI服务，而不是直接调用Gemini API

## 故障排除

### 代理服务器未启动
如果AI助手显示"代理服务器未启动"，请确保：
1. 后端服务器正在运行（http://localhost:3001）
2. `server/.env` 文件中的API密钥配置正确
3. 端口3001没有被其他程序占用

### CORS错误
如果遇到CORS错误，请检查 `server/index.js` 中的CORS配置是否包含你的前端域名。

### API调用失败
检查控制台错误信息，确认：
1. Gemini API密钥有效
2. 网络连接正常
3. API配额未用完