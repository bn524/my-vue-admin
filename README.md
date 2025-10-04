# my-vue-admin：基于YOLOv8和Vue3的目标检测后台管理系统

## 项目简介

my-vue-admin 是一个现代化的目标检测后台管理系统，采用前后端分离架构。前端基于 Vue3 + Vite 构建，提供直观的用户界面；后端使用 FastAPI 集成 YOLOv8 模型，提供高效的目标检测能力。系统专为需要管理图像检测任务和分析检测结果的场景设计。

## 系统预览

- **前端地址**: http://localhost:3000
- **后端地址**: http://localhost:8000
- **默认账号**: 管理员 (无需密码或使用演示数据)

## 核心功能

### 🔍 智能目标检测
- 支持拖拽上传图片进行实时检测
- 集成 YOLOv8 模型，识别80+种常见对象
- 可视化检测结果，显示边界框和置信度
- 支持 JPG、PNG 格式，最大10MB文件

### 📊 检测记录管理
- 完整的检测历史记录存储和查看
- 支持按状态、时间范围筛选记录
- 实时统计检测数量、准确率等指标
- 检测结果导出功能

### 👥 用户信息管理
- 当前用户信息展示
- 系统用户统计和基本信息
- 用户搜索和筛选功能

### ⚙️ 系统设置
- 明暗主题切换
- 响应式设计，支持移动端
- 服务状态监控

## 技术架构

### 前端技术栈
- **框架**: Vue 3.3.4 + Composition API
- **构建工具**: Vite 4.3.9
- **路由**: Vue Router 4.2.4
- **状态管理**: Pinia 2.1.4
- **UI组件**: 自定义组件 + Font Awesome 图标
- **HTTP客户端**: Axios

### 后端技术栈
- **框架**: FastAPI
- **AI模型**: YOLOv8 (Ultralytics)
- **图像处理**: OpenCV
- **服务器**: Uvicorn
- **CORS**: 支持跨域请求

## 环境配置指南

### 系统要求
- Node.js 16.0+ 
- Python 3.8+
- 4GB+ 内存
- 支持CUDA的GPU（可选，用于加速检测）

### 第一步：获取项目代码

```bash
# 克隆项目到本地
git clone <项目仓库地址>
cd my-vue-admin
```

### 第二步：前端环境配置

1. **安装 Node.js 依赖**
```bash
# 进入前端目录
cd my-vue-admin

# 安装依赖包
npm install
```

2. **启动前端开发服务器**
```bash
# 开发模式启动（默认端口3000）
npm run dev

# 或指定端口启动
npm run dev -- --port 3000
```

3. **验证前端启动**
打开浏览器访问 `http://localhost:3000`，应该能看到登录界面。

### 第三步：后端环境配置

1. **创建 Python 虚拟环境（推荐）**
```bash
# 进入后端目录
cd backend

# 创建虚拟环境
python -m venv venv

# 激活虚拟环境
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate
```

2. **安装 Python 依赖**
```bash
pip install -r requirements.txt
```

如果没有 requirements.txt，手动安装：
```bash
pip install fastapi uvicorn python-multipart
pip install ultralytics opencv-python numpy
```

3. **启动后端服务**
```bash
# 启动 FastAPI 服务（默认端口8000）
python main.py

# 或使用 uvicorn
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

4. **验证后端启动**
打开浏览器访问 `http://localhost:8000`，应该看到：
```json
{
  "status": "success",
  "message": "YOLOv8图像识别服务运行正常",
  "version": "2.0.0",
  "model": "yolov8n"
}
```

### 第四步：测试系统集成

1. 确保前端 (3000端口) 和后端 (8000端口) 都在运行
2. 访问 `http://localhost:3000`
3. 进入"检测管理"页面
4. 上传测试图片进行检测

## 故障排除指南

### 🔴 前端启动问题

**问题1**: `npm install` 失败
```
解决方案：
1. 清除缓存重新安装
   npm cache clean --force
   npm install

2. 使用淘宝镜像
   npm install --registry=https://registry.npmmirror.com

3. 删除 node_modules 重新安装
   rm -rf node_modules
   npm install
```

**问题2**: 端口被占用
```
解决方案：
1. 使用其他端口启动
   npm run dev -- --port 3001

2. 查找并关闭占用进程
   # Windows:
   netstat -ano | findstr :3000
   taskkill /PID <进程ID> /F
   
   # Linux/Mac:
   lsof -i :3000
   kill -9 <进程ID>
```

### 🔴 后端启动问题

**问题1**: Python 包安装失败
```
解决方案：
1. 使用国内镜像源
   pip install -i https://pypi.tuna.tsinghua.edu.cn/simple -r requirements.txt

2. 逐包安装排查问题包
   pip install fastapi
   pip install uvicorn
   pip install ultralytics
```

**问题2**: YOLOv8 模型下载失败
```
解决方案：
1. 手动下载模型文件
   - 访问: https://github.com/ultralytics/assets/releases
   - 下载: yolov8n.pt
   - 放置到项目根目录

2. 使用代理或更换网络环境
```

**问题3**: 端口8000被占用
```
解决方案：
1. 修改后端端口
   # 在 main.py 中修改
   uvicorn.run(app, host="0.0.0.0", port=8001)

2. 或启动时指定端口
   uvicorn main:app --port 8001
```

### 🔴 前后端连接问题

**问题**: 前端无法连接到后端服务
```
错误信息：服务健康检查失败/无法连接到后端服务

解决方案：
1. 检查后端服务是否运行
   - 访问 http://localhost:8000 确认后端正常

2. 检查CORS配置
   - 确保后端 main.py 中包含正确的CORS配置
   - 允许前端地址 (localhost:3000) 访问

3. 检查防火墙设置
   - 确保8000端口没有被防火墙阻止

4. 修改前端API配置
   - 编辑 src/services/api.js
   - 修改 baseURL 为实际的后端地址
```

### 🔴 检测功能问题

**问题1**: 图片上传失败
```
解决方案：
1. 检查图片格式和大小
   - 只支持 JPG、PNG 格式
   - 文件大小不超过10MB

2. 检查后端文件处理
   - 确保后端有足够的磁盘空间
   - 检查临时文件权限
```

**问题2**: 检测结果不显示
```
解决方案：
1. 检查浏览器控制台错误信息
2. 确认YOLOv8模型加载成功
3. 检查网络连接状态
4. 查看后端日志输出
```

## 项目结构说明

```
my-vue-admin/
├── public/                 # 静态资源
├── src/
│   ├── components/         # 可复用组件
│   │   ├── Header.vue     # 顶部导航栏
│   │   ├── Sidebar.vue    # 侧边栏菜单
│   │   └── ...
│   ├── views/             # 页面组件
│   │   ├── Dashboard.vue  # 控制台
│   │   ├── Detections.vue # 检测管理
│   │   ├── Users.vue      # 用户信息
│   │   └── Settings.vue   # 系统设置
│   ├── stores/            # 状态管理
│   │   ├── user.js        # 用户状态
│   │   └── detection.js   # 检测状态
│   ├── services/          # API服务
│   │   └── api.js         # HTTP请求封装
│   ├── router/            # 路由配置
│   │   └── index.js
│   └── App.vue            # 根组件
├── backend/
│   ├── main.py            # FastAPI后端入口
│   └── requirements.txt   # Python依赖
├── package.json           # 前端依赖配置
└── vite.config.js         # Vite构建配置
```
***后端代码部分可存放于其他位置***

## 开发指南

### 添加新功能
1. 在 `src/views/` 创建新页面组件
2. 在 `src/router/index.js` 添加路由
3. 在 `src/components/Sidebar.vue` 添加菜单项
4. 如需状态管理，在 `src/stores/` 创建store

### 自定义配置
- **修改主题颜色**: 编辑 `src/App.vue` 中的 CSS 变量
- **更改API地址**: 修改 `src/services/api.js` 中的 baseURL
- **调整检测参数**: 修改 `backend/main.py` 中的模型配置

## 部署建议

### 开发环境
- 使用 npm run dev 和 python main.py 分别启动前后端
- 启用热重载功能，便于开发调试

### 生产环境
1. **前端构建**
   ```bash
   npm run build
   # 生成的 dist 目录可部署到任何静态文件服务器
   ```

2. **后端部署**
   ```bash
   # 使用生产级ASGI服务器
   pip install gunicorn
   gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
   ```

## 获取帮助

如果遇到问题：

1. **查看日志**: 前后端控制台输出错误信息
2. **检查网络**: 确保端口连通，防火墙放行
3. **验证环境**: 确认Node.js和Python版本符合要求
4. **查阅文档**: 查看相关技术栈官方文档

## 技术文档链接

- [Vue3 官方文档](https://v3.vuejs.org/)
- [Vite 官方文档](https://vitejs.dev/)
- [FastAPI 官方文档](https://fastapi.tiangolo.com/)
- [YOLOv8 文档](https://docs.ultralytics.com/)
- [Pinia 状态管理](https://pinia.vuejs.org/)

---

**注意**: 本项目为演示用途，生产环境部署前请进行安全加固，包括但不限于：身份认证强化、输入验证、API限流、日志监控等。