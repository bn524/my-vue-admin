<template>
  <div class="dashboard">
    <div class="page-header">
      <div class="page-title">
        <h1>控制台</h1>
        <div class="breadcrumb">
          <a href="#">首页</a> / <span>控制台</span>
        </div>
      </div>
      <div>
        <button class="btn btn-primary" @click="goToDetection">
          <i class="fas fa-plus"></i> 新建检测
        </button>
      </div>
    </div>

    <!-- 检测系统统计卡片 -->
    <div class="stats-cards">
      <div class="stat-card card-detections">
        <div class="stat-info">
          <h3>{{ detectionStore.totalDetections.toLocaleString() }}</h3>
          <p>总检测数量</p>
          <div class="stat-trend positive">
            <i class="fas fa-arrow-up"></i>
            <span>今日 +{{ detectionStore.todayDetections }}</span>
          </div>
        </div>
        <div class="stat-icon">
          <i class="fas fa-camera"></i>
        </div>
      </div>
      <div class="stat-card card-users">
        <div class="stat-info">
          <h3>{{ userStore.activeUsers }}</h3>
          <p>活跃用户</p>
          <div class="stat-trend positive">
            <i class="fas fa-arrow-up"></i>
            <span>今日 +{{ userStore.todayUserGrowth }}</span>
          </div>
        </div>
        <div class="stat-icon">
          <i class="fas fa-users"></i>
        </div>
      </div>
      <div class="stat-card card-accuracy">
        <div class="stat-info">
          <h3>{{ (detectionStore.detectionAccuracy * 100).toFixed(1) }}%</h3>
          <p>检测准确率</p>
          <div class="stat-trend positive">
            <i class="fas fa-arrow-up"></i>
            <span>+2.3%</span>
          </div>
        </div>
        <div class="stat-icon">
          <i class="fas fa-bullseye"></i>
        </div>
      </div>
      <div class="stat-card card-categories">
        <div class="stat-info">
          <h3>{{ detectionStore.detectedCategories }}</h3>
          <p>检测类别数</p>
          <div class="stat-trend">
            <i class="fas fa-minus"></i>
            <span>较昨日持平</span>
          </div>
        </div>
        <div class="stat-icon">
          <i class="fas fa-tags"></i>
        </div>
      </div>
    </div>

    <!-- 检测数据图表和统计 -->
    <div class="charts-section">
      <div class="chart-row">
        <div class="chart-card">
          <div class="card-header">
            <div class="card-title">检测数量趋势</div>
            <div class="chart-filter">
              <select v-model="chartTimeRange">
                <option value="7d">最近7天</option>
                <option value="30d">最近30天</option>
                <option value="90d">最近90天</option>
              </select>
            </div>
          </div>
          <div class="card-body">
            <div class="chart-container">
              <div class="chart-placeholder">
                <i class="fas fa-chart-line"></i>
                <p>检测数量趋势图表</p>
                <div class="chart-data-preview">
                  <div class="data-point" v-for="point in detectionTrend" :key="point.date">
                    <div class="point-value">{{ point.value }}</div>
                    <div class="point-date">{{ point.date }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="chart-card">
          <div class="card-header">
            <div class="card-title">检测类别分布</div>
          </div>
          <div class="card-body">
            <div class="chart-container">
              <div class="chart-placeholder">
                <i class="fas fa-chart-pie"></i>
                <p>检测类别分布图</p>
                <div class="category-list">
                  <div class="category-item" v-for="category in detectionStore.topCategories" :key="category.name">
                    <div class="category-info">
                      <span class="category-name">{{ category.name }}</span>
                      <span class="category-count">{{ category.count }}次</span>
                    </div>
                    <div class="category-bar">
                      <div class="bar-fill" :style="{width: category.percentage + '%'}"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 快速操作和最近检测 -->
    <div class="content-row">
      <div class="card quick-actions">
        <div class="card-header">
          <div class="card-title">快速操作</div>
        </div>
        <div class="card-body">
          <div class="action-buttons">
            <button class="action-btn" @click="goToDetection">
              <i class="fas fa-play-circle"></i>
              <span>开始检测</span>
            </button>
            <button class="action-btn" @click="goToUpload">
              <i class="fas fa-upload"></i>
              <span>上传图片</span>
            </button>
            <button class="action-btn" @click="goToHistory">
              <i class="fas fa-history"></i>
              <span>检测历史</span>
            </button>
            <button class="action-btn" @click="goToModels">
              <i class="fas fa-cube"></i>
              <span>模型管理</span>
            </button>
          </div>
        </div>
      </div>

      <div class="card recent-detections">
        <div class="card-header">
          <div class="card-title">最近检测记录</div>
          <router-link to="/detections" class="view-all">查看全部</router-link>
        </div>
        <div class="card-body">
          <div class="detection-list">
            <div class="detection-item" v-for="detection in detectionStore.recentDetections" :key="detection.id">
              <div class="detection-image">
                <img :src="detection.thumbnail" :alt="detection.filename" />
                <div class="detection-badge">{{ detection.objects }}个对象</div>
              </div>
              <div class="detection-info">
                <div class="detection-filename">{{ detection.filename }}</div>
                <div class="detection-meta">
                  <span class="detection-time">{{ detection.time }}</span>
                  <span class="detection-status" :class="'status-' + detection.status">
                    {{ detection.statusText }}
                  </span>
                </div>
              </div>
              <div class="detection-actions">
                <button class="btn btn-sm btn-outline" @click="viewDetectionDetail(detection.id)">
                  查看
                </button>
              </div>
            </div>
          </div>
          <div v-if="detectionStore.recentDetections.length === 0" class="no-detections">
            <i class="fas fa-images"></i>
            <h3>暂无检测记录</h3>
            <p>系统中还没有检测记录，请开始第一次检测</p>
            <button class="btn btn-primary" @click="goToDetection">
              <i class="fas fa-play-circle"></i> 开始检测
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useDetectionStore } from '../stores/detection'

export default {
  name: 'Dashboard',
  setup() {
    const userStore = useUserStore()
    const detectionStore = useDetectionStore()
    const router = useRouter()
    const chartTimeRange = ref('7d')
    
    // 模拟检测趋势数据
    const detectionTrend = computed(() => {
      const baseData = [125, 143, 118, 167, 189, 156, 201]
      return baseData.map((value, index) => ({
        date: `10月${index + 1}日`,
        value: value
      }))
    })
    
    // 导航函数 - 使用不同的函数名避免重复
    const goToDetection = () => {
      router.push('/detections')
    }
    
    const goToUpload = () => {
      router.push('/detections')
    }
    
    const goToHistory = () => {
      router.push('/detections')
    }
    
    const goToModels = () => {
      router.push('/models')
    }
    
    const viewDetectionDetail = (id) => {
      router.push(`/detections?view=${id}`)
    }
    
    return {
      userStore,
      detectionStore,
      chartTimeRange,
      detectionTrend,
      goToDetection,
      goToUpload,
      goToHistory,
      goToModels,
      viewDetectionDetail
    }
  }
}
</script>

<style scoped>
.dashboard {
  padding: 0;
}

.page-header {
  padding: 30px 30px 0;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  padding: 30px;
  padding-bottom: 0;
}

.stat-card {
  padding: 25px;
  border-radius: 12px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.stat-info h3 {
  font-size: 2.2rem;
  margin-bottom: 8px;
  font-weight: 700;
}

.stat-info p {
  font-size: 0.95rem;
  opacity: 0.9;
  margin-bottom: 10px;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.8rem;
  padding: 4px 8px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.2);
  width: fit-content;
}

.stat-trend.positive {
  color: #2ecc71;
}

.stat-icon {
  font-size: 3rem;
  opacity: 0.8;
}

.card-detections {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.card-users {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.card-accuracy {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.card-categories {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

/* 图表区域 */
.charts-section {
  padding: 30px;
}

.chart-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.chart-card {
  background-color: var(--card-bg);
  border-radius: 12px;
  box-shadow: var(--shadow);
  overflow: hidden;
}

.chart-container {
  padding: 0;
  height: 300px;
}

.chart-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--gray);
}

.chart-placeholder i {
  font-size: 3rem;
  margin-bottom: 15px;
  opacity: 0.5;
}

.chart-data-preview {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.data-point {
  text-align: center;
  padding: 8px;
  background: rgba(0, 0, 0, 0.03);
  border-radius: 6px;
}

.point-value {
  font-weight: bold;
  color: var(--primary);
}

.point-date {
  font-size: 0.8rem;
  color: var(--gray);
}

.category-list {
  width: 100%;
  max-width: 300px;
}

.category-item {
  margin-bottom: 15px;
}

.category-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.category-name {
  font-weight: 500;
  color: var(--text-color);
}

.category-count {
  color: var(--gray);
  font-size: 0.9rem;
}

.category-bar {
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(to right, var(--primary), var(--secondary));
  border-radius: 3px;
  transition: width 0.5s ease;
}

/* 内容区域 */
.content-row {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 20px;
  padding: 0 30px 30px;
}

.quick-actions .card-body {
  padding: 25px;
}

.action-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: var(--card-bg);
  border: 2px dashed #ddd;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  color: var(--text-color);
}

.action-btn:hover {
  border-color: var(--primary);
  background: rgba(58, 123, 213, 0.05);
  transform: translateY(-2px);
}

.action-btn i {
  font-size: 2rem;
  margin-bottom: 10px;
  color: var(--primary);
}

.action-btn span {
  font-weight: 500;
}

/* 检测记录列表 */
.detection-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.detection-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #eee;
  transition: background-color 0.2s;
}

.detection-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.detection-image {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
}

.detection-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detection-badge {
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 0.7rem;
}

.detection-info {
  flex: 1;
}

.detection-filename {
  font-weight: 500;
  margin-bottom: 5px;
  color: var(--text-color);
}

.detection-meta {
  display: flex;
  gap: 15px;
  font-size: 0.8rem;
  color: var(--gray);
}

.detection-status {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 500;
}

.status-completed {
  background-color: rgba(46, 204, 113, 0.2);
  color: var(--success);
}

.status-processing {
  background-color: rgba(243, 156, 18, 0.2);
  color: var(--warning);
}

.status-failed {
  background-color: rgba(231, 76, 60, 0.2);
  color: var(--danger);
}

.no-detections {
  text-align: center;
  padding: 40px 20px;
  color: var(--gray);
}

.no-detections i {
  font-size: 3rem;
  margin-bottom: 20px;
  opacity: 0.5;
}

.no-detections h3 {
  margin-bottom: 10px;
  color: var(--text-color);
}

.no-detections p {
  margin-bottom: 20px;
}

.view-all {
  color: var(--primary);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
}

.view-all:hover {
  text-decoration: underline;
}

.chart-filter select {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: var(--card-bg);
  color: var(--text-color);
  font-size: 0.9rem;
}

@media (max-width: 1200px) {
  .chart-row {
    grid-template-columns: 1fr;
  }
  
  .content-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .page-header,
  .stats-cards,
  .charts-section,
  .content-row {
    padding: 15px;
  }
  
  .stats-cards {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    grid-template-columns: 1fr;
  }
}
</style>