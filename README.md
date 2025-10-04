# YOLOv8 + Vue3 目标检测后台管理系统

<div align="center">

  <img src="https://img.shields.io/badge/Vue.js-3.3.4-4fc08d?style=for-the-badge&logo=vuedotjs&logoColor=white" alt="Vue.js">
  <img src="https://img.shields.io/badge/FastAPI-0.104.1-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI">
  <img src="https://img.shields.io/badge/YOLOv8-8.0.0-00a8ff?style=for-the-badge&logo=pytorch&logoColor=white" alt="YOLOv8">
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="License">

  <br>
  <strong>现代化的全栈目标检测解决方案，集成前沿的计算机视觉技术和现代Web开发框架</strong>
  <br><br>
  
  <a href="https://github.com/bn524/my-vue-admin/blob/main/README.md#项目演示">项目演示</a> • 
  <a href="https://github.com/bn524/my-vue-admin/blob/main/README.md#核心功能">核心功能</a> • 
  <a href="https://github.com/bn524/my-vue-admin/blob/main/README.md#快速开始">快速开始</a> • 
  <a href="https://github.com/bn524/my-vue-admin/blob/main/README.md#部署指南">部署指南</a> •
</div>

## 🌟 系统预览

### 界面展示

<div align="center">

| 登录界面 | 控制台仪表板 |
|:---:|:---:|
| <img src="./images/管理员登录.png" width="400" alt="管理员登录界面"/> | <img src="./images/控制台页面.png" width="400" alt="控制台页面"/> |
| **简洁安全的用户认证系统**<br>• 现代化登录表单设计<br>• JWT Token身份验证<br>• 响应式布局适配 | **数据可视化控制台**<br>• 实时检测数据统计<br>• 系统运行状态监控<br>• 快速操作入口 |

| 检测管理 | 模型管理 |
|:---:|:---:|
| <img src="./images/检测管理页面.png" width="400" alt="检测管理界面"/> | <img src="./images/模型管理页面.png" width="400" alt="模型管理界面"/> |
| **智能目标检测中心**<br>• 拖拽上传图片检测<br>• 实时结果可视化<br>• 检测历史记录管理 | **AI模型管理中心**<br>• YOLOv8模型管理<br>• 性能指标监控<br>• 模型切换控制 |

| 用户管理 | 系统设置 |
|:---:|:---:|
| <img src="./images/用户管理页面.png" width="400" alt="用户管理界面"/> | <img src="./images/系统设置.png" width="400" alt="系统设置界面"/> |
| **用户信息管理中心**<br>• 用户统计数据分析<br>• 个人信息管理<br>• 系统使用情况监控 | **个性化配置中心**<br>• 明暗主题切换<br>• 系统偏好设置<br>• 界面个性化定制 |

</div>

### 访问信息
- **🌐 前端地址**: http://localhost:3000 (开发环境)
- **⚙️ 后端地址**: http://localhost:8000 (开发环境)  
- **👤 默认账号**: 管理员 (演示模式，无需密码)
- **📁 支持格式**: JPG、PNG，最大10MB文件

## 🚀 核心功能

### 🎯 智能目标检测
- **实时图像分析**: 集成YOLOv8最新模型，支持80+种对象识别
- **可视化结果**: 实时显示检测边界框、类别标签和置信度
- **批量处理**: 支持连续上传多张图片进行高效检测
- **性能优化**: GPU加速支持，毫秒级推理响应

### 📊 检测记录管理
- **完整历史追踪**: 自动保存所有检测记录，支持时间线查看
- **智能筛选系统**: 按状态、时间范围、对象类别多维度筛选
- **数据统计分析**: 检测数量趋势、准确率变化等可视化图表
- **结果导出**: JSON格式检测数据导出，便于后续分析

### 🔐 用户认证系统
- **安全登录机制**: 基于JWT Token的身份验证
- **路由权限控制**: 自动拦截未授权访问，保护系统安全
- **状态持久化**: 页面刷新自动恢复登录状态
- **会话管理**: 安全的登录状态维护和超时处理

### 👥 用户信息管理
- **个人信息中心**: 当前用户资料展示和编辑功能
- **系统用户统计**: 用户数量、活跃度、增长趋势数据分析
- **智能搜索**: 支持姓名、邮箱、角色多条件快速查找
- **状态监控**: 实时用户活跃状态跟踪和管理

### ⚙️ 系统监控设置
- **服务健康监控**: 前后端服务运行状态实时监测
- **主题个性化**: 一键切换明暗主题，适配不同使用环境
- **响应式设计**: 完美适配桌面、平板、移动端各种设备
- **性能优化**: 懒加载、缓存策略、请求优化等多项性能提升

## 🛠 技术架构

### 前端技术栈
| 技术组件 | 版本 | 用途说明 |
|---------|------|----------|
| **Vue 3** | 3.3.4 | 现代化响应式前端框架 |
| **Vite** | 4.3.9 | 下一代前端构建工具，极速冷启动 |
| **Pinia** | 2.1.4 | 轻量级状态管理库 |
| **Vue Router** | 4.2.4 | 官方路由管理解决方案 |
| **Axios** | 1.5.0 | Promise-based HTTP客户端 |
| **Font Awesome 6** | 6.4.0 | 专业图标库 |
| **CSS3 + 变量** | - | 现代化样式方案，支持主题切换 |

### 后端技术栈
| 技术组件 | 版本 | 用途说明 |
|---------|------|----------|
| **FastAPI** | 0.104.1 | 高性能Python Web框架 |
| **YOLOv8** | 8.0.0 | 最先进的目标检测模型 |
| **OpenCV** | 4.8.1 | 计算机视觉处理库 |
| **Uvicorn** | 0.24.0 | 高性能ASGI服务器 |
| **Pydantic** | 2.4.2 | 数据验证和设置管理 |
| **Python-multipart** | 0.0.6 | 文件上传处理支持 |

### 系统架构图
```
┌─────────────────┐    HTTP/REST API    ┌──────────────────┐
│   Vue3 前端应用  │ ◄──────────────────► │  FastAPI 后端服务  │
│                 │                     │                  │
│ • 响应式UI组件   │    WebSocket实时通信  │ • 图像处理管道    │
│ • 状态管理       │ ◄──────────────────► │ • YOLOv8模型推理  │
│ • 路由导航       │                     │ • 结果序列化      │
└─────────────────┘                     └──────────────────┘
         │                                       │
         ▼                                       ▼
┌─────────────────┐                     ┌──────────────────┐
│   用户浏览器     │                     │   CUDA加速计算    │
│                 │                     │   (可选)          │
└─────────────────┘                     └──────────────────┘
```

## 📋 环境配置指南

### 系统要求
- **Node.js**: 16.0 或更高版本
- **Python**: 3.8 或更高版本  
- **内存**: 4GB+ (推荐8GB)
- **存储**: 2GB+ 可用空间
- **GPU**: 支持CUDA的GPU (可选，用于加速检测)

### 🚀 快速开始

#### 第一步：获取项目代码
```bash
# 克隆项目到本地
git clone https://github.com/your-username/yolov8-vue3-admin.git
cd yolov8-vue3-admin
```

#### 第二步：前端环境配置
```bash
# 安装Node.js依赖
npm install

# 启动开发服务器 (端口3000)
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

#### 第三步：后端环境配置
```bash
# 进入后端目录
cd backend

# 创建Python虚拟环境
python -m venv venv

# 激活虚拟环境
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# 安装Python依赖
pip install -r requirements.txt

# 启动后端服务 (端口8000)
python main.py
```

#### 第四步：验证安装
1. 访问 `http://localhost:3000` 查看前端界面
2. 访问 `http://localhost:8000` 验证后端API
3. 访问 `http://localhost:8000/docs` 查看API文档
4. 上传测试图片进行目标检测验证

## 🔧 故障排除指南

### 常见问题解决方案

#### 1. 前端启动问题
**问题**: npm install 失败
```bash
# 清理缓存并重试
npm cache clean --force
npm install --registry=https://registry.npmmirror.com
```

**问题**: 端口被占用
```bash
# 查找占用进程并终止
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -i :3000
kill -9 <PID>

# 或更换端口启动
npm run dev -- --port 3001
```

#### 2. 后端启动问题
**问题**: Python包安装失败
```bash
# 使用国内镜像加速
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple -r requirements.txt
```

**问题**: YOLOv8模型下载失败
```bash
# 手动下载模型文件
wget https://github.com/ultralytics/assets/releases/download/v8.0.0/yolov8n.pt
# 或将模型文件放置在 backend/models/ 目录下
```

#### 3. 前后端连接问题
**问题**: CORS跨域错误
```python
# 确保后端CORS配置包含前端地址
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://127.0.0.1:3000",
        "http://localhost:5173"  # Vite默认端口
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

#### 4. 检测功能问题
**问题**: 图片上传失败
- ✅ 检查文件格式是否为JPG/PNG
- ✅ 验证文件大小不超过10MB
- ✅ 确认后端服务正常运行
- ✅ 查看浏览器控制台错误信息

## 📁 项目结构说明

```
yolov8-vue3-admin/
├── 📁 public/                 # 静态资源
│   ├── favicon.ico
│   └── index.html
├── 📁 src/
│   ├── 📁 components/         # 可复用组件
│   │   ├── Header.vue        # 顶部导航栏组件
│   │   ├── Sidebar.vue       # 侧边栏菜单组件
│   │   └── Common/           # 通用业务组件
│   ├── 📁 views/             # 页面视图组件
│   │   ├── Dashboard.vue     # 控制台仪表板
│   │   ├── Detections.vue    # 检测管理页面
│   │   ├── Users.vue         # 用户信息页面
│   │   ├── Models.vue        # 模型管理页面
│   │   └── Settings.vue      # 系统设置页面
│   ├── 📁 stores/            # Pinia状态管理
│   │   ├── user.js           # 用户状态管理
│   │   └── detection.js      # 检测状态管理
│   ├── 📁 services/          # API服务层
│   │   └── api.js            # HTTP请求封装
│   ├── 📁 router/            # 路由配置
│   │   └── index.js          # 路由定义
│   ├── 📁 assets/            # 静态资源
│   │   └── styles/           # 全局样式文件
│   ├── App.vue               # 根组件
│   └── main.js               # 应用入口文件
├── 📁 backend/               # 后端服务
│   ├── main.py              # FastAPI应用入口
│   ├── requirements.txt     # Python依赖列表
│   └── 📁 models/           # 模型文件目录
├── 📁 images/               # 项目截图文档
│   ├── admin-login.png      # 登录界面截图
│   ├── dashboard.png        # 控制台截图
│   ├── detection-management.png # 检测管理截图
│   ├── model-management.png # 模型管理截图
│   ├── user-management.png  # 用户管理截图
│   └── system-settings.png  # 系统设置截图
├── package.json             # 前端依赖配置
├── vite.config.js           # Vite构建配置
└── README.md               # 项目说明文档
```

## 💡 开发指南

### 添加新功能模块
1. **创建页面组件**: 在 `src/views/` 创建Vue单文件组件
2. **配置路由规则**: 在 `src/router/index.js` 添加路由定义
3. **更新导航菜单**: 在 `src/components/Sidebar.vue` 添加菜单项
4. **状态管理设计**: 如需全局状态，在 `src/stores/` 创建store
5. **API接口集成**: 在 `src/services/api.js` 添加后端接口调用

### 自定义配置选项
- **主题定制**: 修改 `src/App.vue` 中的CSS自定义属性
- **API端点配置**: 调整 `src/services/api.js` 中的baseURL
- **模型参数调整**: 配置 `backend/main.py` 中的检测参数
- **上传限制修改**: 前后端统一调整文件大小和格式验证规则

### 性能优化建议
- 🚀 使用Vue的异步组件实现路由懒加载
- 📦 对大型图片进行压缩和缓存处理
- ⚡ 实现检测请求的防抖和取消机制
- 🔧 使用Web Worker处理复杂的计算任务
- 💾 合理使用浏览器缓存和本地存储

## 🚀 部署方案

### 开发环境部署
```bash
# 前端开发模式 (热重载)
npm run dev

# 后端开发模式 (自动重载)
python main.py
```

### 生产环境部署

#### 前端部署
```bash
# 构建生产版本
npm run build

# 部署到静态服务器 (Nginx配置示例)
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### 后端部署
```bash
# 使用生产级ASGI服务器
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:8000

# 或使用Docker部署
docker build -t yolov8-backend .
docker run -d -p 8000:8000 --name yolov8-api yolov8-backend
```

#### Docker Compose 一键部署
```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "3000:80"
    depends_on:
      - backend
      
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - MODEL_PATH=/app/models/yolov8n.pt
    volumes:
      - ./backend/models:/app/models
```

### 环境变量配置
创建 `.env` 文件进行环境配置：

```env
# 前端环境变量
VUE_APP_API_URL=http://localhost:8000
VUE_APP_ENV=production
VUE_APP_TITLE=YOLOv8检测系统

# 后端环境变量
MODEL_PATH=./models/yolov8n.pt
MAX_FILE_SIZE=10485760
LOG_LEVEL=INFO
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

## 🆘 获取帮助

### 问题排查步骤
1. **查看运行日志**: 检查前后端控制台输出信息
2. **网络请求分析**: 使用浏览器开发者工具检查网络请求状态
3. **环境版本验证**: 确认Node.js和Python版本符合要求
4. **依赖完整性检查**: 验证所有依赖包正确安装且版本兼容

### 技术支持渠道
- **📚 项目文档**: 详细阅读项目README和代码注释
- **💬 技术社区**: Vue3、FastAPI、YOLOv8官方社区和论坛
- **🐛 问题反馈**: 通过GitHub Issues提交详细的问题报告
- **🔧 代码贡献**: 欢迎提交Pull Request改进项目

### 扩展学习资源
- [Vue3官方文档](https://v3.vuejs.org/) - 深入学习Vue3框架
- [FastAPI官方文档](https://fastapi.tiangolo.com/) - 掌握FastAPI开发
- [YOLOv8文档](https://docs.ultralytics.com/) - 了解YOLOv8模型
- [Pinia状态管理](https://pinia.vuejs.org/) - 学习状态管理最佳实践

## 📝 版本更新日志

### v2.0.0 (当前版本) ✨
- ✅ 完整集成YOLOv8最新目标检测模型
- ✅ 现代化Vue3 + Vite前端架构
- ✅ 完整的用户认证和权限管理系统
- ✅ 实时检测结果可视化展示
- ✅ 响应式设计完美适配多端设备
- ✅ 明暗主题切换个性化功能
- ✅ 前后端分离的RESTful API设计

### 未来版本规划 🚧
- 🔄 批量图片异步检测功能
- 🔄 视频流实时检测支持
- 🔄 多模型动态切换机制
- 🔄 检测结果深度统计分析
- 🔄 用户权限分级精细管理
- 🔄 系统性能监控告警
- 🔄 移动端APP版本开发

---

<div align="center">

## ⭐ 支持项目

如果这个项目对你有帮助，请给个Star支持一下！

**欢迎贡献代码、提出问题或分享使用经验**

---

**重要提示**: 本项目为技术演示用途，生产环境部署前请进行充分的安全测试和性能优化，包括但不限于：身份认证强化、输入验证、API限流、日志监控、数据加密等措施。

**开源协议**: MIT License | Copyright © 2025 YOLOv8 Vue3 Admin Team

</div>