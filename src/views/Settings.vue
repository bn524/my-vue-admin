<template>
  <div class="settings">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-title">
          <div class="title-icon">
            <i class="fas fa-cogs"></i>
          </div>
          <div class="title-text">
            <h1>系统设置</h1>
            <p>管理系统配置和个性化选项</p>
          </div>
        </div>
      </div>
    </div>

    <div class="settings-container">
      <!-- 左侧导航 -->
      <div class="settings-sidebar">
        <div class="sidebar-header">
          <h3><i class="fas fa-sliders-h"></i> 设置分类</h3>
        </div>
        <nav class="sidebar-nav">
          <a v-for="tab in tabs" 
             :key="tab.id"
             :class="['nav-item', { active: activeTab === tab.id }]"
             @click="activeTab = tab.id">
            <i :class="tab.icon"></i>
            <span>{{ tab.name }}</span>
          </a>
        </nav>
      </div>

      <!-- 右侧内容 -->
      <div class="settings-content">
        <!-- 通用设置 -->
        <div v-if="activeTab === 'general'" class="settings-section">
          <div class="section-header">
            <h2><i class="fas fa-wrench"></i> 通用设置</h2>
            <p>系统基础配置和常规选项</p>
          </div>
          
          <div class="settings-grid">
            <div class="setting-card">
              <div class="setting-header">
                <div class="setting-icon">
                  <i class="fas fa-palette"></i>
                </div>
                <div class="setting-info">
                  <h4>主题设置</h4>
                  <p>切换系统的明暗主题模式</p>
                </div>
              </div>
              <div class="setting-control">
                <button class="btn btn-primary" @click="userStore.toggleTheme">
                  <i :class="userStore.currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun'"></i>
                  {{ userStore.currentTheme === 'light' ? '切换到暗色模式' : '切换到亮色模式' }}
                </button>
              </div>
            </div>

            <div class="setting-card">
              <div class="setting-header">
                <div class="setting-icon">
                  <i class="fas fa-language"></i>
                </div>
                <div class="setting-info">
                  <h4>语言设置</h4>
                  <p>选择系统显示语言</p>
                </div>
              </div>
              <div class="setting-control">
                <select v-model="language" class="setting-select">
                  <option value="zh-CN">简体中文</option>
                  <option value="en-US">English</option>
                  <option value="ja-JP">日本語</option>
                </select>
              </div>
            </div>

            <div class="setting-card">
              <div class="setting-header">
                <div class="setting-icon">
                  <i class="fas fa-bell"></i>
                </div>
                <div class="setting-info">
                  <h4>通知设置</h4>
                  <p>管理系统的通知偏好</p>
                </div>
              </div>
              <div class="setting-control">
                <div class="toggle-group">
                  <div class="toggle-item">
                    <label>检测完成通知</label>
                    <label class="toggle-switch">
                      <input type="checkbox" v-model="notifications.detection">
                      <span class="slider"></span>
                    </label>
                  </div>
                  <div class="toggle-item">
                    <label>系统更新通知</label>
                    <label class="toggle-switch">
                      <input type="checkbox" v-model="notifications.updates">
                      <span class="slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 检测设置 -->
        <div v-if="activeTab === 'detection'" class="settings-section">
          <div class="section-header">
            <h2><i class="fas fa-camera"></i> 检测设置</h2>
            <p>配置目标检测相关参数</p>
          </div>
          
          <div class="settings-grid">
            <div class="setting-card">
              <div class="setting-header">
                <div class="setting-icon">
                  <i class="fas fa-cube"></i>
                </div>
                <div class="setting-info">
                  <h4>模型选择</h4>
                  <p>选择使用的YOLO模型版本</p>
                </div>
              </div>
              <div class="setting-control">
                <select v-model="detectionSettings.model" class="setting-select">
                  <option value="yolov8n">YOLOv8n (最快)</option>
                  <option value="yolov8s">YOLOv8s (平衡)</option>
                  <option value="yolov8m">YOLOv8m (准确)</option>
                  <option value="yolov8l">YOLOv8l (最准确)</option>
                </select>
              </div>
            </div>

            <div class="setting-card">
              <div class="setting-header">
                <div class="setting-icon">
                  <i class="fas fa-crosshairs"></i>
                </div>
                <div class="setting-info">
                  <h4>置信度阈值</h4>
                  <p>设置检测结果的置信度要求</p>
                </div>
              </div>
              <div class="setting-control">
                <div class="slider-group">
                  <input type="range" 
                         v-model="detectionSettings.confidence" 
                         min="0.1" 
                         max="0.9" 
                         step="0.05"
                         class="slider">
                  <span class="slider-value">{{ (detectionSettings.confidence * 100).toFixed(0) }}%</span>
                </div>
              </div>
            </div>

            <div class="setting-card">
              <div class="setting-header">
                <div class="setting-icon">
                  <i class="fas fa-expand"></i>
                </div>
                <div class="setting-info">
                  <h4>图像尺寸</h4>
                  <p>设置检测时图像的缩放尺寸</p>
                </div>
              </div>
              <div class="setting-control">
                <select v-model="detectionSettings.imageSize" class="setting-select">
                  <option value="640">640×640 (默认)</option>
                  <option value="320">320×320 (快速)</option>
                  <option value="1280">1280×1280 (高清)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- 系统信息 -->
        <div v-if="activeTab === 'system'" class="settings-section">
          <div class="section-header">
            <h2><i class="fas fa-info-circle"></i> 系统信息</h2>
            <p>查看系统状态和版本信息</p>
          </div>
          
          <div class="info-cards">
            <div class="info-card">
              <div class="info-header">
                <i class="fas fa-server"></i>
                <h4>服务状态</h4>
              </div>
              <div class="info-content">
                <div class="info-item">
                  <span class="label">检测服务</span>
                  <span class="value status-online">运行正常</span>
                </div>
                <div class="info-item">
                  <span class="label">模型状态</span>
                  <span class="value status-online">已加载</span>
                </div>
                <div class="info-item">
                  <span class="label">数据库</span>
                  <span class="value status-online">连接正常</span>
                </div>
              </div>
            </div>

            <div class="info-card">
              <div class="info-header">
                <i class="fas fa-code-branch"></i>
                <h4>版本信息</h4>
              </div>
              <div class="info-content">
                <div class="info-item">
                  <span class="label">系统版本</span>
                  <span class="value">v2.1.0</span>
                </div>
                <div class="info-item">
                  <span class="label">Vue版本</span>
                  <span class="value">3.3.4</span>
                </div>
                <div class="info-item">
                  <span class="label">YOLO版本</span>
                  <span class="value">8.0.0</span>
                </div>
                <div class="info-item">
                  <span class="label">最后更新</span>
                  <span class="value">2023-06-15</span>
                </div>
              </div>
            </div>

            <div class="info-card">
              <div class="info-header">
                <i class="fas fa-chart-bar"></i>
                <h4>使用统计</h4>
              </div>
              <div class="info-content">
                <div class="info-item">
                  <span class="label">总检测次数</span>
                  <span class="value">12,580</span>
                </div>
                <div class="info-item">
                  <span class="label">今日检测</span>
                  <span class="value">324</span>
                </div>
                <div class="info-item">
                  <span class="label">检测类别</span>
                  <span class="value">80</span>
                </div>
                <div class="info-item">
                  <span class="label">平均准确率</span>
                  <span class="value">95.6%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 关于 -->
        <div v-if="activeTab === 'about'" class="settings-section">
          <div class="section-header">
            <h2><i class="fas fa-question-circle"></i> 关于系统</h2>
            <p>了解YOLOv8检测管理系统的更多信息</p>
          </div>
          
          <div class="about-content">
            <div class="about-card">
              <div class="about-header">
                <div class="app-logo">
                  <i class="fas fa-camera"></i>
                </div>
                <div class="app-info">
                  <h3>YOLOv8 检测管理系统</h3>
                  <p>基于深度学习的智能图像识别平台</p>
                </div>
              </div>
              
              <div class="about-features">
                <h4>主要特性</h4>
                <div class="features-grid">
                  <div class="feature-item">
                    <i class="fas fa-bolt"></i>
                    <span>实时目标检测</span>
                  </div>
                  <div class="feature-item">
                    <i class="fas fa-history"></i>
                    <span>检测历史管理</span>
                  </div>
                  <div class="feature-item">
                    <i class="fas fa-chart-line"></i>
                    <span>数据统计分析</span>
                  </div>
                  <div class="feature-item">
                    <i class="fas fa-cube"></i>
                    <span>多模型支持</span>
                  </div>
                  <div class="feature-item">
                    <i class="fas fa-palette"></i>
                    <span>主题定制</span>
                  </div>
                  <div class="feature-item">
                    <i class="fas fa-mobile-alt"></i>
                    <span>响应式设计</span>
                  </div>
                </div>
              </div>
              
              <div class="about-actions">
                <button class="btn btn-outline">
                  <i class="fas fa-book"></i> 用户手册
                </button>
                <button class="btn btn-outline">
                  <i class="fas fa-bug"></i> 报告问题
                </button>
                <button class="btn btn-primary">
                  <i class="fas fa-sync"></i> 检查更新
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useUserStore } from '../stores/user'

export default {
  name: 'Settings',
  setup() {
    const userStore = useUserStore()
    const activeTab = ref('general')
    
    const tabs = [
      { id: 'general', name: '通用设置', icon: 'fas fa-wrench' },
      { id: 'detection', name: '检测设置', icon: 'fas fa-camera' },
      { id: 'system', name: '系统信息', icon: 'fas fa-info-circle' },
      { id: 'about', name: '关于系统', icon: 'fas fa-question-circle' }
    ]
    
    const language = ref('zh-CN')
    
    const notifications = reactive({
      detection: true,
      updates: true
    })
    
    const detectionSettings = reactive({
      model: 'yolov8n',
      confidence: 0.5,
      imageSize: '640'
    })
    
    return {
      userStore,
      activeTab,
      tabs,
      language,
      notifications,
      detectionSettings
    }
  }
}
</script>

<style scoped>
.settings {
  padding: 0;
}

/* 页面头部 */
.page-header {
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  color: white;
  padding: 30px;
  margin-bottom: 30px;
  border-radius: 0 0 20px 20px;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 20px;
}

.title-icon {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
}

.title-text h1 {
  font-size: 2.2rem;
  margin-bottom: 5px;
  font-weight: 700;
}

.title-text p {
  opacity: 0.9;
  font-size: 1.1rem;
}

/* 设置容器 */
.settings-container {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 30px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 30px;
}

/* 侧边栏 */
.settings-sidebar {
  background: var(--card-bg);
  border-radius: 15px;
  box-shadow: var(--shadow);
  overflow: hidden;
  height: fit-content;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  color: white;
}

.sidebar-header h3 {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  font-size: 1.2rem;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  padding: 10px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px 20px;
  color: var(--text-color);
  text-decoration: none;
  transition: all 0.3s;
  border-left: 4px solid transparent;
  cursor: pointer;
}

.nav-item:hover {
  background: rgba(0, 0, 0, 0.03);
  color: var(--primary);
}

.nav-item.active {
  background: rgba(58, 123, 213, 0.1);
  color: var(--primary);
  border-left-color: var(--primary);
}

.nav-item i {
  width: 20px;
  text-align: center;
}

/* 设置内容 */
.settings-content {
  min-height: 600px;
}

.settings-section {
  margin-bottom: 40px;
}

.section-header {
  margin-bottom: 30px;
}

.section-header h2 {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-color);
  font-size: 1.5rem;
  margin-bottom: 8px;
}

.section-header h2 i {
  color: var(--primary);
}

.section-header p {
  color: var(--gray);
  font-size: 1rem;
}

/* 设置网格 */
.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
}

.setting-card {
  background: var(--card-bg);
  padding: 25px;
  border-radius: 15px;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  gap: 20px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.setting-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.setting-header {
  display: flex;
  align-items: flex-start;
  gap: 15px;
}

.setting-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.setting-info h4 {
  margin: 0 0 5px 0;
  color: var(--text-color);
  font-size: 1.1rem;
}

.setting-info p {
  margin: 0;
  color: var(--gray);
  font-size: 0.9rem;
  line-height: 1.4;
}

.setting-control {
  display: flex;
  justify-content: flex-end;
}

.setting-select {
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: var(--card-bg);
  color: var(--text-color);
  width: 100%;
  max-width: 200px;
}

/* 切换开关 */
.toggle-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
}

.toggle-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: var(--primary);
}

input:checked + .slider:before {
  transform: translateX(26px);
}

/* 滑块 */
.slider-group {
  display: flex;
  align-items: center;
  gap: 15px;
  width: 100%;
}

.slider {
  flex: 1;
  height: 6px;
  background: #e9ecef;
  border-radius: 3px;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  background: var(--primary);
  border-radius: 50%;
  cursor: pointer;
}

.slider-value {
  min-width: 50px;
  text-align: center;
  font-weight: 600;
  color: var(--primary);
}

/* 信息卡片 */
.info-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.info-card {
  background: var(--card-bg);
  padding: 25px;
  border-radius: 15px;
  box-shadow: var(--shadow);
}

.info-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.info-header i {
  color: var(--primary);
  font-size: 1.2rem;
}

.info-header h4 {
  margin: 0;
  color: var(--text-color);
  font-size: 1.1rem;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.info-item .label {
  color: var(--text-color);
  font-weight: 500;
}

.info-item .value {
  color: var(--gray);
}

.status-online {
  color: var(--success) !important;
  font-weight: 600;
}

/* 关于内容 */
.about-content {
  max-width: 800px;
}

.about-card {
  background: var(--card-bg);
  padding: 30px;
  border-radius: 20px;
  box-shadow: var(--shadow);
}

.about-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.app-logo {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
}

.app-info h3 {
  margin: 0 0 5px 0;
  color: var(--text-color);
  font-size: 1.5rem;
}

.app-info p {
  margin: 0;
  color: var(--gray);
}

.about-features {
  margin-bottom: 30px;
}

.about-features h4 {
  margin-bottom: 20px;
  color: var(--text-color);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 15px;
  background: #f8f9fa;
  border-radius: 8px;
  color: var(--text-color);
}

.feature-item i {
  color: var(--primary);
  width: 16px;
}

.about-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .settings-container {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .settings-sidebar {
    order: 2;
  }
  
  .settings-content {
    order: 1;
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 20px;
  }
  
  .settings-container {
    padding: 0 20px;
  }
  
  .settings-grid,
  .info-cards {
    grid-template-columns: 1fr;
  }
  
  .about-actions {
    flex-direction: column;
  }
  
  .about-header {
    flex-direction: column;
    text-align: center;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>