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
        <button class="btn btn-primary"><i class="fas fa-plus"></i> 新增数据</button>
      </div>
    </div>

    <StatsCards />
    
    <div class="card">
      <div class="card-header">
        <div class="card-title">最近活动</div>
      </div>
      <div class="card-body">
        <p>这里是最近的活动记录...</p>
      </div>
    </div>
  </div>
</template>

<script>
import StatsCards from '../components/StatsCards.vue'

export default {
  name: 'Dashboard',
  components: {
    StatsCards
  }
}
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.page-title h1 {
  font-size: 1.8rem;
  color: var(--text-color);
  margin-bottom: 5px;
}

.breadcrumb {
  color: var(--gray);
  font-size: 0.9rem;
}

.breadcrumb a {
  color: var(--primary);
  text-decoration: none;
}

.card {
  background-color: var(--card-bg);
  border-radius: 8px;
  box-shadow: var(--shadow);
  margin-bottom: 25px;
  overflow: hidden;
}

.card-header {
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-color);
}

.card-body {
  padding: 20px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.btn-primary {
  background-color: var(--primary);
  color: white;
}

.btn-primary:hover {
  background-color: #2a69c4;
}
</style>