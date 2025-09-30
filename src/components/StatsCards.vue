<template>
  <div class="stats-cards">
    <div class="stat-card card-users">
      <div class="stat-info">
        <h3>{{ userStore.activeUsers }}</h3>
        <p>活跃用户</p>
      </div>
      <div class="stat-icon">
        <i class="fas fa-users"></i>
      </div>
    </div>
    <div class="stat-card card-orders">
      <div class="stat-info">
        <h3>524</h3>
        <p>今日检测数量</p>
      </div>
      <div class="stat-icon">
        <i class="fas fa-shopping-cart"></i>
      </div>
    </div>
    <div class="stat-card card-revenue">
      <div class="stat-info">
        <h3>¥12,580</h3>
        <p>本月检测数量</p>
      </div>
      <div class="stat-icon">
        <i class="fas fa-chart-line"></i>
      </div>
    </div>
    <div class="stat-card card-growth">
      <div class="stat-info">
        <h3>1</h3>
        <p>用户人数</p>
      </div>
      <div class="stat-icon">
        <i class="fas fa-chart-pie"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '../stores/user'

export default {
  name: 'StatsCards',
  setup() {
    const userStore = useUserStore()
    
    return {
      userStore
    }
  }
}
</script>

<style scoped>
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  padding: 20px;
  border-radius: 8px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-info h3 {
  font-size: 1.8rem;
  margin-bottom: 5px;
}

.stat-info p {
  font-size: 0.9rem;
  opacity: 0.9;
}

.stat-icon {
  font-size: 2.5rem;
  opacity: 0.8;
}

.card-users {
  background: linear-gradient(to right, #3498db, #2980b9);
}

.card-orders {
  background: linear-gradient(to right, #2ecc71, #27ae60);
}

.card-revenue {
  background: linear-gradient(to right, #9b59b6, #8e44ad);
}

.card-growth {
  background: linear-gradient(to right, #e67e22, #d35400);
}

@media (max-width: 768px) {
  .stats-cards {
    grid-template-columns: 1fr;
  }
}
</style>