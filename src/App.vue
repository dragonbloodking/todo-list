<template>
  <div class="app">
    <nav class="navbar" v-if="currentUser">
      <div class="nav-brand">Todo List</div>
      <div class="nav-menu">
        <router-link to="/" class="nav-item">待办事项</router-link>
        <router-link to="/focus" class="nav-item">专注模式</router-link>
        <div class="user-menu">
          <span class="username">{{ currentUser.username }}</span>
          <button @click="handleLogout" class="logout-btn">退出</button>
        </div>
      </div>
    </nav>
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </div>
</template>

<script>
import { useAuth } from './composables/useAuth'
import { onMounted } from 'vue'

export default {
  name: 'App',
  setup() {
    const { currentUser, logout, checkAuth } = useAuth()

    onMounted(() => {
      checkAuth()
    })

    const handleLogout = () => {
      logout()
    }

    return {
      currentUser,
      handleLogout
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  line-height: 1.6;
  color: #333;
}

.app {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.navbar {
  background: #fff;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  font-size: 1.25rem;
  font-weight: bold;
  color: #6b46c1;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-item {
  color: #666;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-item:hover,
.nav-item.router-link-active {
  color: #6b46c1;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.username {
  color: #666;
  font-weight: 500;
}

.logout-btn {
  padding: 0.5rem 1rem;
  background: #e53e3e;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.logout-btn:hover {
  background: #c53030;
}

@media (max-width: 768px) {
  .navbar {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
  }

  .nav-menu {
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }

  .user-menu {
    width: 100%;
    justify-content: center;
    padding-top: 1rem;
    border-top: 1px solid #eee;
  }
}
</style>
