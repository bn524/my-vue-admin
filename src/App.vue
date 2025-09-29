<template>
  <div id="app" :class="currentTheme">
    <div class="app-container">
      <Sidebar />
      <div class="main-content">
        <Header />
        <div class="content">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useUserStore } from './stores/user'
import Sidebar from './components/Sidebar.vue'
import Header from './components/Header.vue'

export default {
  name: 'App',
  components: {
    Sidebar,
    Header
  },
  setup() {
    const userStore = useUserStore()
    
    const currentTheme = computed(() => userStore.currentTheme)
    
    return {
      currentTheme
    }
  }
}
</script>

<style>
:root {
  --primary: #3a7bd5;
  --secondary: #00d2ff;
  --dark: #2c3e50;
  --light: #f5f7fa;
  --success: #2ecc71;
  --warning: #f39c12;
  --danger: #e74c3c;
  --gray: #95a5a6;
  --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  --bg-color: #f0f2f5;
  --sidebar-bg: #2c3e50;
  --card-bg: #ffffff;
  --text-color: #333333;
  --text-light: #ffffff;
}

[data-theme="dark"] {
  --bg-color: #1a1a1a;
  --sidebar-bg: #121212;
  --card-bg: #2d2d2d;
  --text-color: #e0e0e0;
  --text-light: #e0e0e0;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
  transition: background-color 0.3s, color 0.3s;
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
}

#app {
  min-height: 100vh;
}

.app-container {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.content {
  padding: 30px;
  flex: 1;
  overflow-y: auto;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .content {
    padding: 15px;
  }
}
</style>