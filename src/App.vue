<template>
  <div class="app">
    <nav class="navbar" v-if="currentUser">
      <div class="nav-brand">Todo List</div>
      <div class="nav-menu">
        <router-link to="/" class="nav-item">待办事项</router-link>
        <router-link to="/focus" class="nav-item">专注模式</router-link>
        <router-link to="/notes" class="nav-item">我的笔记</router-link>
        <div class="user-menu">
          <span class="username">{{ currentUser.username }}</span>
          <button @click="showSettings = true" class="settings-btn" title="账号设置">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 13.333a3.333 3.333 0 1 0 0-6.666 3.333 3.333 0 0 0 0 6.666Z" stroke="#666" stroke-width="1.5"/>
              <path d="M17.5 10a7.5 7.5 0 0 0-.125-1.333l1.542-1.2a.417.417 0 0 0 .1-.542l-1.458-2.5a.417.417 0 0 0-.5-.192l-1.825.733a7.5 7.5 0 0 0-1.15-.667l-.275-1.933A.417.417 0 0 0 13.417 2.5h-2.834a.417.417 0 0 0-.417.35l-.275 1.933a7.5 7.5 0 0 0-1.15.667l-1.825-.733a.417.417 0 0 0-.5.192l-1.458 2.5a.417.417 0 0 0 .1.542l1.542 1.2A7.5 7.5 0 0 0 2.5 10c0 .45.042.892.125 1.333l-1.542 1.2a.417.417 0 0 0-.1.542l1.458 2.5a.417.417 0 0 0 .5.192l1.825-.733c.367.25.75.475 1.15.667l.275 1.933a.417.417 0 0 0 .417.35h2.834a.417.417 0 0 0 .417-.35l.275-1.933c.4-.192.783-.417 1.15-.667l1.825.733a.417.417 0 0 0 .5-.192l1.458-2.5a.417.417 0 0 0-.1-.542l-1.542-1.2c.083-.441.125-.883.125-1.333Z" stroke="#666" stroke-width="1.5"/>
            </svg>
          </button>
          <button @click="handleLogout" class="logout-btn">退出</button>
        </div>
      </div>
    </nav>
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
    <AccountSettings v-if="showSettings" @close="showSettings = false" />
  </div>
</template>

<script>
import { useAuth } from './composables/useAuth'
import { onMounted, ref } from 'vue'
import AccountSettings from './components/AccountSettings.vue'

export default {
  name: 'App',
  setup() {
    const { currentUser, logout, checkAuth } = useAuth()
    const showSettings = ref(false)

    onMounted(() => {
      checkAuth()
    })

    const handleLogout = () => {
      logout()
    }

    return {
      currentUser,
      handleLogout,
      showSettings
    }
  },
  components: {
    AccountSettings
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

.settings-btn {
  padding: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
}

.settings-btn:hover {
  color: #6b46c1;
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
